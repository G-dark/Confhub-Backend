import { Request, Response } from "express";
import { Admin } from "../Domain/Entities/Admin.js";
import { MakeProfileUsecase } from "../Domain/Usecases/AdminUsecases/MakeProfileUsecase.js";
import { DeleteProfileUsecase } from "../Domain/Usecases/AdminUsecases/DeleteProfileUsecase.js";
import { UpdateProfileUsecase } from "../Domain/Usecases/AdminUsecases/UpdateProfileUsecase.js";
import { GetAdminUsecase } from "../Domain/Usecases/AdminUsecases/GetAdminUsecase.js";
import { LoginAdminUsecase } from "../Domain/Usecases/AdminUsecases/LoginAdminUsecase.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../App/config.js";
import { AuthRequest } from "../Middlewares/auth.js";
import { ThisAdminExistsUsecase } from "../Domain/Usecases/AdminUsecases/ThisAdminExistsUsecase.js";
import { ThisSpeakerExistsUsecase } from "../Domain/Usecases/SpeakerUsecases/ThisSpeakerExistsUsecase.js";
import { v2 as cloudinary } from "cloudinary";
import { CLOUD_NAME, API_KEY, API_SECRET } from "../App/config.js";

export const makeAdmin: any = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  const file = req.file;
  try {
    let result;

    if (email && password) {
      if (
        !(await ThisAdminExistsUsecase.call(email)) &&
        !(await ThisSpeakerExistsUsecase.call(email))
      ) {
        // Configuration
        cloudinary.config({
          cloud_name: CLOUD_NAME,
          api_key: API_KEY,
          api_secret: API_SECRET,
        });

        let base64String;
        let uploadResult;
        if (file) {
          // Convertir buffer a base64
          base64String = `data:${file.mimetype};base64,${file.buffer.toString(
            "base64"
          )}`;
          // Upload an image
          uploadResult = await cloudinary.uploader
            .upload(base64String, {
              folder: "users/pfps",
              transformation: [
                { width: 800, height: 800, crop: "limit" },
                { quality: "auto", fetch_format: "auto" },
              ],
            })
            .catch((error) => {
              console.log(error);
            });
        }

        const admin: Admin = {
          firstName: firstName ? firstName : "",
          lastName: lastName ? lastName : "",
          email,
          password,
          events: [],
          rol: true,
          image: uploadResult ? uploadResult.secure_url : "",
          id_image: uploadResult ? uploadResult.public_id : "",
        };

        result = await MakeProfileUsecase.call(admin);
      } else {
        return res
          .status(444)
          .json({ error: "el email ya está registrado como speaker o admin" });
      }
    } else {
      return res.status(444).json({ error: "email y contraseña requeridos" });
    }

    return result
      ? res.json({ success: "Admin registrado" })
      : res.status(444).json({ error: "Admin no registrado" });
  } catch (error) {
    console.error("Se obtuvo un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const loginProfile: any = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let token;
  try {
    if (await ThisAdminExistsUsecase.call(email)) {
      const result = await LoginAdminUsecase.call(email, password);

      if (result) {
        token = jwt.sign(
          { email: email, rol: "admin" },
          JWT_SECRET_KEY as string,
          {
            expiresIn: "1h",
          }
        );
      }

      return result
        ? res.json({ success: "Usuario logueado", token: token })
        : res.status(444).json({ error: "Usuario no logueado" });
    } else {
      return res.status(404).json({ error: "Usuario inexistente" });
    }
  } catch (error) {
    console.error("Se obtuvo un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const updateProfile: any = async (req: AuthRequest, res: Response) => {
  const { email2Update } = req.params;
  const { email } = req.body;
  const file = req.file;
  let result = false;

  try {
    if (await ThisAdminExistsUsecase.call(email2Update)) {
      if (req.user && email2Update == req.user.email) {
        const admin2Updated = transformToAdmin(
          ((await GetAdminUsecase.call(email2Update)) as any)[0]
        );

        // Configuration
        cloudinary.config({
          cloud_name: CLOUD_NAME,
          api_key: API_KEY,
          api_secret: API_SECRET,
        });

        let base64String;
        let uploadResult;
        if (file) {
          // Convertir buffer a base64
          base64String = `data:${file.mimetype};base64,${file.buffer.toString(
            "base64"
          )}`;

          if (admin2Updated.id_image == "") {
            // Upload an image
            uploadResult = await cloudinary.uploader
              .upload(base64String, {
                folder: "users/pfps",
                transformation: [
                  { width: 800, height: 800, crop: "limit" },
                  { quality: "auto", fetch_format: "auto" },
                ],
              })
              .catch((error) => {
                console.log(error);
              });

            admin2Updated.image = uploadResult ? uploadResult.secure_url : "";
            admin2Updated.id_image = uploadResult ? uploadResult.public_id : "";
          } else {
            // Update an image
            uploadResult = await cloudinary.uploader
              .upload(base64String, {
                public_id: admin2Updated.id_image, // mismo que el anterior
                overwrite: true,
                transformation: [
                  { width: 800, height: 800, crop: "limit" },
                  { quality: "auto", fetch_format: "auto" },
                ],
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }

        const admin: Admin = {
          ...admin2Updated,
          ...req.body,
        };

        if ((email && email2Update == email) || !email) {
          result = await UpdateProfileUsecase.call(admin, email2Update);
        } else {
          return res
            .status(444)
            .json({ error: "no se puede modificar el email de una cuenta" });
        }

        return result
          ? res.json({ success: "Usuario actualizado" })
          : res.status(444).json({ error: "Usuario no actualizado" });
      } else {
        return res.status(401).json({
          error: "un admin no puede modificar otro admin que no sea el mismo",
        });
      }
    } else {
      return res.status(404).json({ error: "Usuario inexistente" });
    }
  } catch (error) {
    console.error("Se obtuvo un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const deleteProfile: any = async (req: AuthRequest, res: Response) => {
  const { email } = req.params;

  try {
    // verify the existence of the admin
    if (await ThisAdminExistsUsecase.call(email)) {
      if (req.user && req.user.email == email) {
        // get admin for delete image
        const admin2delete = transformToAdmin(
          ((await GetAdminUsecase.call(email)) as any)[0]
        );

        // ensure the existence of an image to delete
        if (admin2delete.image !== "") {
          // delete the pfp image
          const deletepfp = await cloudinary.uploader.destroy(
            admin2delete.id_image
          );
        }

        // make the delete request
        const result = await DeleteProfileUsecase.call(email);

        return result
          ? res.json({ success: "Usuario eliminado" })
          : res.status(444).json({ error: "Usuario no eliminado" });
      } else {
        return res.status(401).json({
          error: "Un admin no puede eliminar a otro admin que no sea el mismo",
        });
      }
    } else {
      return res.status(404).json({ error: "Usuario inexistente" });
    }
  } catch (error) {
    console.error("Se obtuvo un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const getAdmin: any = async (req: AuthRequest, res: Response) => {
  const { email } = req.params;

  try {
    if (await ThisAdminExistsUsecase.call(email)) {
      if (
        (req.user && req.user.email && req.user.email == email) ||
        req.user?.rol == "admin"
      ) {
        const admin = transformToAdmin(
          ((await GetAdminUsecase.call(email)) as any)[0]
        );
        return admin
          ? res.json({ admin })
          : res.status(444).json({ error: "Error obteniendo el usuario" });
      } else {
        return res.status(401).json({
          error: "Un admin no puede saber la información de otros admins",
        });
      }
    } else {
      return res.status(404).json({ error: "Usuario inexistente" });
    }
  } catch (error) {
    console.error("Se obtuvo un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const transformToAdmin = (admin: any): Admin => {
  return {
    email: admin.email,
    password: admin.passwrd,
    firstName: admin.firstname,
    lastName: admin.lastname,
    rol: admin.rol,
    image: admin.image,
    events: admin.events,
    id_image: admin.id_image,
  };
};
