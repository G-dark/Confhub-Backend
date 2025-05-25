import { Request, Response } from "express";
import { Speaker } from "../Domain/Entities/Speaker.js";
import { MakeAProfileUsecase } from "../Domain/Usecases/SpeakerUsecases/MakeAProfileUsecase.js";
import { LoginSpeakerUsecase } from "../Domain/Usecases/SpeakerUsecases/LoginSpeakerUsecase.js";
import { HOST, JWT_SECRET_KEY, URL_BASE } from "../App/config.js";
import jwt from "jsonwebtoken";
import { GetSpeakerUsecase } from "../Domain/Usecases/SpeakerUsecases/GetSpeakerUsecase.js";
import { UpdateAProfileUsecase } from "../Domain/Usecases/SpeakerUsecases/UpdateAProfileUsecase.js";
import { DeleteAProfileUsecase } from "../Domain/Usecases/SpeakerUsecases/DeleteAProfileUsecase.js";
import { AuthRequest } from "../Middlewares/auth.js";
import { ThisAdminExistsUsecase } from "../Domain/Usecases/AdminUsecases/ThisAdminExistsUsecase.js";
import { ThisSpeakerExistsUsecase } from "../Domain/Usecases/SpeakerUsecases/ThisSpeakerExistsUsecase.js";
import deleteFile from "../Utils/delete-file.js";

export const makeSpeaker: any = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const speaker: Speaker = {
      firstName: firstName ? firstName : "",
      lastName: lastName ? lastName : "",
      email,
      password,
      events: [],
      image: req.file
        ? URL_BASE +
          (HOST == "localhost" ? "/Public/" : "/Images/") +
          req.file.filename
        : "",
    };
    let result;
    if (email && password) {
      if (
        !(await ThisAdminExistsUsecase.call(email)) &&
        !(await ThisSpeakerExistsUsecase.call(email))
      ) {
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
  let result = false;
  try {
    if (await ThisSpeakerExistsUsecase.call(email2Update)) {
      const speaker2Updated = transformToSpeaker(
        ((await GetSpeakerUsecase.call(email2Update)) as any)[0]
      );
      const speaker: Speaker = {
        ...speaker2Updated,
        ...req.body,
        image: req.file
          ? URL_BASE +
            (HOST == "localhost" ? "/Public/" : "/Images/") +
            req.file.filename
          : speaker2Updated.image,
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
        if (speaker2delete.image) {
          const ext = speaker2delete.image.split(".").pop();
          // delete the image depending on the Host
          if (HOST == "localhost") {
            deleteFile("./src/Public/" + email + "."+ ext);
          } else {
            deleteFile("./src/Images/" + email + "." + ext);
          }
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
  };
};
