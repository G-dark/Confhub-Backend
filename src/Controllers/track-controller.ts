import { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { AuthRequest } from "../Middlewares/auth.js";
import { GetTracksUsecase } from "../Domain/Usecases/TrackUsecases/GetTracksUsecase.js";
import { Track } from "../Domain/Entities/Track.js";
import { MakeATrackUsecase } from "../Domain/Usecases/TrackUsecases/MakeATrackUsecase.js";
import { ThisTrackExistsUsecase } from "../Domain/Usecases/TrackUsecases/ThisTrackExistsUsecase.js";
import { UpdateATrackUsecase } from "../Domain/Usecases/TrackUsecases/UpdateATrackUsecase.js";
import { DeleteATrackUsecase } from "../Domain/Usecases/TrackUsecases/DeleteATrackUsecase.js";

export const getTracks: any = async (req: Request, res: Response) => {
  const { name } = req.params;

  try {
    const result = await GetTracksUsecase.call(name);

    return result.length > 0
      ? res.json(result)
      : res
          .status(404)
          .json({ msg: "Sin categorias con ese nombre" })
          .status(404);
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ msg: "Error interno" });
  }
};

export const registerTrack: any = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user && req.user.rol == "admin") {
      const { name, description } = req.body;

      const track: Track = {
        name,
        events:[],
        description,
      };

      const result = await MakeATrackUsecase.call(track);

      return result
        ? res.json({ success: "Track registrado" })
        : res.status(444).json({ error: "Track no registrado" }).status(404);
    } else {
      return res
        .status(444)
        .json({ error: "Solo un admin puede crear un track" });
    }
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ msg: "Error interno" });
  }
};

export const updateTrack: any = async (req: AuthRequest, res: Response) => {
  const { name } = req.params;

  try {
    if (req.user && req.user.rol == "admin") {
      const existingTrack = await ThisTrackExistsUsecase.call(name);
      if (!existingTrack) {
        return res.status(404).json({ error: "Ese track no existe" });
      }

      const currentTrack = (await GetTracksUsecase.call(name))[0]

      if (!currentTrack) {
        return res
          .status(404)
          .json({ error: "No se pudo obtener el track actual" });
      }

      // Actualizar solo los campos enviados en el cuerpo de la solicitud
      const updatedTrack = {
        ...currentTrack, // Mantener los valores actuales
        ...req.body, // Sobrescribir con los valores enviados
      };

      console.log(updatedTrack)

      const result = await UpdateATrackUsecase.call(updatedTrack, name);

      return result
        ? res.json({ success: "Track actualizado" })
        : res.status(444).json({ error: "Track no actualizado" });
    } else {
      return res
        .status(444)
        .json({ error: "Solo un admin puede actualizar un track" });
    }
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const deleteTrack: any = async (req: AuthRequest, res: Response) => {
  const { name } = req.params;

  try {
    if (req.user && req.user.rol == "admin") {
      const exists = await ThisTrackExistsUsecase.call(name);
      if (exists) {
        const result = await DeleteATrackUsecase.call(name);

        return result
          ? res.json({ success: "track eliminado" })
          : res.status(444).json({ error: "No eliminado" }).status(404);
      } else {
        return res.status(404).json({ error: "Ese track no existe" });
      }
    } else {
      return res
        .status(444)
        .json({ error: "Solo un admin puede eliminar un track" });
    }
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const orderEventsOntracks = async () => {

};
