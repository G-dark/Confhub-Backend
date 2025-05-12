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

export const makeAdmin: any = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, image } = req.body;

  try {
    const admin: Admin = {
      firstName: firstName ? firstName : "",
      lastName: lastName ? lastName : "",
      email,
      password,
      events: [],
      rol: true,
      image: image ? image : "",
    };

    let result;

    if (email && password) {
      if (
        !(await ThisAdminExistsUsecase.call(email)) &&
        !(await ThisSpeakerExistsUsecase.call(email))
      ) {
        result = await MakeProfileUsecase.call(admin);
      } else {
        res
          .status(444)
          .json({ error: "el email ya está registrado como speaker o admin" });
      }
    } else {
      res.status(444).json({ error: "email y contraseña requeridos" });
    }

    return result
      ? res.json({ success: "Admin registrado" })
      : res.status(444).json({ error: "Admin no registrado" });
  } catch (error) {
    console.error("Se obtuvo un error", error);
    res.status(500).json({ error: "Error interno" });
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
      res.status(404).json({ error: "Usuario inexistente" });
    }
  } catch (error) {
    console.error("Se obtuvo un error", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const updateProfile: any = async (req: AuthRequest, res: Response) => {
  const { email2Update } = req.params;
  const { firstName, lastName, email, password, events } = req.body;
  let result = false;
  try {
    if (await ThisAdminExistsUsecase.call(email2Update)) {
      const admin2Updated = transformToAdmin(
        ((await GetAdminUsecase.call(email2Update)) as any)[0]
      );

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
      res.status(404).json({ error: "Usuario inexistente" });
    }
  } catch (error) {
    console.error("Se obtuvo un error", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const deleteProfile: any = async (req: AuthRequest, res: Response) => {
  const { email } = req.params;

  try {
    if (await ThisAdminExistsUsecase.call(email)) {
      const result = await DeleteProfileUsecase.call(email);

      return result
        ? res.json({ success: "Usuario eliminado" })
        : res.status(444).json({ error: "Usuario no eliminado" });
    } else {
      res.status(404).json({ error: "Usuario inexistente" });
    }
  } catch (error) {
    console.error("Se obtuvo un error", error);
    res.status(500).json({ error: "Error interno" });
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
  };
};
