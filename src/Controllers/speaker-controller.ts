import { Request, Response } from "express";
import { Speaker } from "../Domain/Entities/Speaker.js";
import { MakeAProfileUsecase } from "../Domain/Usecases/SpeakerUsecases/MakeAProfileUsecase.js";
import { LoginSpeakerUsecase } from "../Domain/Usecases/SpeakerUsecases/LoginSpeakerUsecase.js";
import { JWT_SECRET_KEY } from "../App/config.js";
import jwt from "jsonwebtoken";
import { GetSpeakerUsecase } from "../Domain/Usecases/SpeakerUsecases/GetSpeakerUsecase.js";
import { UpdateAProfileUsecase } from "../Domain/Usecases/SpeakerUsecases/UpdateAProfileUsecase.js";
import { DeleteAProfileUsecase } from "../Domain/Usecases/SpeakerUsecases/DeleteAProfileUsecase.js";
import { AuthRequest } from "../Middlewares/auth.js";
import { ThisAdminExistsUsecase } from "../Domain/Usecases/AdminUsecases/ThisAdminExistsUsecase.js";
import { ThisSpeakerExistsUsecase } from "../Domain/Usecases/SpeakerUsecases/ThisSpeakerExistsUsecase.js";
import { v2 as cloudinary } from "cloudinary";
import { CLOUD_NAME, API_KEY, API_SECRET } from "../App/config.js";

export const makeSpeaker: any = async (req: Request, res: Response) => {
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
        const speaker: Speaker = {
          firstName: firstName ? firstName : "",
          lastName: lastName ? lastName : "",
          email,
          password,
          events: [],
          image: uploadResult ? uploadResult.secure_url : "",
          id_image: uploadResult ? uploadResult.public_id : "",
        };

        result = await MakeAProfileUsecase.call(speaker);
      } else {
        return res
          .status(444)
          .json({ error: "el email ya está registrado como speaker o admin" });
      }
    } else {
      return res.status(444).json({ error: "email y contraseña requeridos" });
    }

    return result
      ? res.json({ succes: "Speaker registrado" })
      : res.status(444).json({ error: "Speaker no registrado" });
  } catch (error) {
    console.error("Se obtuvo un error", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const loginProfile: any = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let token;
  try {
    if (await ThisSpeakerExistsUsecase.call(email)) {
      const result = await LoginSpeakerUsecase.call(email, password);

      if (result) {
        token = jwt.sign(
          { email: email, rol: "user" },
          JWT_SECRET_KEY as string,
          {
            expiresIn: "1h",
          }
        );
      }

      return result
        ? res.json({ succes: "Usuario logueado", token: token })
        : res.status(444).json({ error: "Usuario no logueado" });
    } else {
      return res.status(404).json({ error: "Usuario inexistente" });
    }
  } catch (error) {
    console.error("Se obtuvo un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const updateSpeakerProfile: any = async (
  req: AuthRequest,
  res: Response
) => {
  const { email2Update } = req.params;
  const { email } = req.body;
  const file = req.file;
  let result = false;
  try {
    if (await ThisSpeakerExistsUsecase.call(email2Update)) {
      const speaker2Updated = transformToSpeaker(
        ((await GetSpeakerUsecase.call(email2Update)) as any)[0]
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

        if (speaker2Updated.id_image == "") {
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

          speaker2Updated.image = uploadResult ? uploadResult.secure_url : "";
          speaker2Updated.id_image = uploadResult ? uploadResult.public_id : "";
        } else {
          // Update an image
          uploadResult = await cloudinary.uploader
            .upload(base64String, {
              public_id: speaker2Updated.id_image, // mismo que el anterior
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

      const speaker: Speaker = {
        ...speaker2Updated,
        ...req.body,
      };
      if (
        (((email && email2Update == email) || !email) &&
          email2Update == req.user?.email) ||
        (req.user?.rol == "admin" &&
          ((email && email2Update == email) || !email))
      ) {
        result = await UpdateAProfileUsecase.call(speaker, email2Update);
      } else {
        return res.status(444).json({
          error:
            "no se puede modificar el email de una cuenta y un speaker tampoco puede modificar a otras cuentas",
        });
      }

      return result
        ? res.json({ succes: "Usuario actualizado" })
        : res.status(444).json({ error: "Usuario no actualizado" });
    } else {
      return res.status(444).json({ error: "Usuario inexistente" });
    }
  } catch (error) {
    console.error("Se obtuvo un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const deleteSpeakerProfile: any = async (
  req: AuthRequest,
  res: Response
) => {
  const { email } = req.params;

  try {
    if (await ThisSpeakerExistsUsecase.call(email)) {
      let result;
      if (req.user && (req.user.email == email || req.user.rol == "admin")) {
        // get admin for delete image
        const speaker2delete = transformToSpeaker(
          ((await GetSpeakerUsecase.call(email)) as any)[0]
        );

        // ensure the existence of an image to delete
        if (speaker2delete.image !== "") {
          // delete the pfp image
          const deletepfp = await cloudinary.uploader.destroy(
            speaker2delete.id_image
          );
        }
        // make the delete request
        result = await DeleteAProfileUsecase.call(email);
      } else {
        return res.status(444).json({
          error: "Un usuario speaker solo puede eliminar su propia cuenta",
        });
      }

      return result
        ? res.json({ succes: "Usuario eliminado" })
        : res.status(444).json({ error: "Usuario no eliminado" });
    } else {
      return res.status(444).json({ error: "Usuario inexistente" });
    }
  } catch (error) {
    console.error("Se obtuvo un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const getSpeaker: any = async (req: AuthRequest, res: Response) => {
  const { email } = req.params;

  try {
    if (await ThisSpeakerExistsUsecase.call(email)) {
      if (
        (req.user && req.user.email && req.user.email == email) ||
        req.user?.rol == "admin"
      ) {
        const speaker = transformToSpeaker(
          ((await GetSpeakerUsecase.call(email)) as any)[0]
        );
        return speaker
          ? res.json({ speaker })
          : res.status(444).json({ error: "Error obteniendo el usuario" });
      } else {
        res
          .status(401)
          .json({ error: "Un speaker solo puede saber su información" });
      }
    } else {
      return res.status(404).json({ error: "Usuario inexistente" });
    }
  } catch (error) {
    console.error("Se obtuvo un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const transformToSpeaker = (speaker: any): Speaker => {
  return {
    email: speaker.email,
    password: speaker.passwrd,
    firstName: speaker.firstname,
    lastName: speaker.lastname,
    events: speaker.events,
    image: speaker.image,
    id_image: speaker.id_image,
  };
};
