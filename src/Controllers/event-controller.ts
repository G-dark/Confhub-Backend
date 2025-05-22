import { Request, Response } from "express";
import { myEvent } from "../Domain/Entities/Event.js";
import { generateRandomId } from "../Utils/tools.js";
import { SuscribeToAnEventUsecase } from "../Domain/Usecases/EventUsecases/SubscribetoAnEventUsecase.js";
import { ThisEventExistsUsecase } from "../Domain/Usecases/EventUsecases/ThisEventExistsUsecase.js";
import { UpdateAnEventUsecase } from "../Domain/Usecases/EventUsecases/UpdateAnEventUsecase.js";
import { DeleteAnEventUsecase } from "../Domain/Usecases/EventUsecases/DeleteAnEventUsecase.js";
import { GetEventsUsecase } from "../Domain/Usecases/EventUsecases/GetEventsUsecase.js";
import { UnSuscribeFromAnEventUsecase } from "../Domain/Usecases/EventUsecases/UnSubscribeFromAnEventUsecase.js";
import {
  loadSubscribedEvents,
  saveSubscribedEvents,
} from "../Utils/subscriptions.js";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { AuthRequest } from "../Middlewares/auth.js";
import { MakeAnEventUsecase } from "../Domain/Usecases/EventUsecases/MakeAnEventUsecase.js";
import { ThisSpeakerExistsUsecase } from "../Domain/Usecases/SpeakerUsecases/ThisSpeakerExistsUsecase.js";
import { GetSpeakerUsecase } from "../Domain/Usecases/SpeakerUsecases/GetSpeakerUsecase.js";
import { transformToSpeaker } from "./speaker-controller.js";
import { ThisAdminExistsUsecase } from "../Domain/Usecases/AdminUsecases/ThisAdminExistsUsecase.js";
import { transformToAdmin } from "./admin-controller.js";
import { GetAdminUsecase } from "../Domain/Usecases/AdminUsecases/GetAdminUsecase.js";
import { UpdateProfileUsecase } from "../Domain/Usecases/AdminUsecases/UpdateProfileUsecase.js";
import { UpdateAProfileUsecase } from "../Domain/Usecases/SpeakerUsecases/UpdateAProfileUsecase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, "../../ApiVersion.txt");

export const getEvents: any = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await GetEventsUsecase.call(Number(id));

    return result.length > 0
      ? res.json(result)
      : res.status(404).json({ msg: "Sin eventos con ese id" }).status(404);
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ msg: "Error interno" });
  }
};

export const registerEvent: any = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      attendees,
      avgScore,
      availableSpots,
      category,
      dateTime,
      location,
      numberReviews,
      sessionOrder,
      speakerAvatar,
      speakerName,
      status,
      tags,
      user_info,
      track,
    } = req.body;

    let eventid: number;

    do {
      eventid = generateRandomId();
    } while (await ThisEventExistsUsecase.call(eventid));

    const event: myEvent = {
      eventid,
      title,
      description,
      attendees,
      avgScore,
      availableSpots,
      category,
      dateTime: new Date(dateTime),
      location,
      numberReviews,
      sessionOrder,
      speakerAvatar,
      speakerName,
      status,
      tags,
      user_info,
      track,
    };

    const email = req.user?.email;
    let user, user2;
    if (email && (await ThisSpeakerExistsUsecase.call(email))) {
      user = transformToSpeaker(
        ((await GetSpeakerUsecase.call(email)) as any)[0]
      );
    }

    if (email && (await ThisAdminExistsUsecase.call(email))) {
      user2 = transformToAdmin(((await GetAdminUsecase.call(email)) as any)[0]);
    }

    const result = await MakeAnEventUsecase.call(event);
    if (user || (user2 && result)) {
      if (email && user2 && req.user?.rol == "admin") {
        user2.events?.push(eventid);
        await UpdateProfileUsecase.call(user2, email);
      } else if (email && user && req.user?.rol == "user") {
        user.events?.push(eventid);
        await UpdateAProfileUsecase.call(user, email);
      }
    }

    return result
      ? res.json({ success: "Evento registrado" })
      : res.status(444).json({ error: "Evento no registrado" }).status(404);
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ msg: "Error interno" });
  }
};

export const updateEvent: any = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const email = req.user?.email;
  let user;
  if (email && (await ThisSpeakerExistsUsecase.call(email))) {
    user = transformToSpeaker(
      ((await GetSpeakerUsecase.call(email)) as any)[0]
    );
  }

  if (email && (await ThisAdminExistsUsecase.call(email))) {
    user = transformToAdmin(((await GetAdminUsecase.call(email)) as any)[0]);
  }

  if (
    (user && user.events && user.events.includes(Number(id))) ||
    req.user?.rol == "admin"
  ) {
    try {
      const existingEvent = await ThisEventExistsUsecase.call(Number(id));
      if (!existingEvent) {
        return res.status(404).json({ error: "Ese evento no existe" });
      }

      // Obtener los datos actuales del evento
      const currentEvent = transformToMyEvent((await GetEventsUsecase.call(Number(id)))[0]);
      if (!currentEvent) {
        return res
          .status(404)
          .json({ error: "No se pudo obtener el evento actual" });
      }

      // Actualizar solo los campos enviados en el cuerpo de la solicitud
      const updatedEvent = {
        ...currentEvent, // Mantener los valores actuales
        ...req.body, // Sobrescribir con los valores enviados
        dateTime: req.body.dateTime
          ? new Date(req.body.dateTime)
          : currentEvent.dateTime,
      };

      const result = await UpdateAnEventUsecase.call(updatedEvent, Number(id));

      return result
        ? res.json({ success: "Evento actualizado" })
        : res.status(444).json({ error: "Evento no actualizado" });
    } catch (error) {
      console.error("se obtuvo un error", error);
      res.status(500).json({ error: "Error interno" });
    }
  } else {
    res.status(444).json({
      error:
        "No puedes editar eventos que no son tuyos al menos que seas admin",
    });
  }
};

export const deleteEvent: any = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const email = req.user?.email;
  let user;
  try {
    if (email && (await ThisSpeakerExistsUsecase.call(email))) {
      user = transformToSpeaker(
        ((await GetSpeakerUsecase.call(email)) as any)[0]
      );
    }

    if (email && (await ThisAdminExistsUsecase.call(email))) {
      user = transformToAdmin(((await GetAdminUsecase.call(email)) as any)[0]);
    }

    if (
      (user && user.events && user.events.includes(Number(id))) ||
      req.user?.rol == "admin"
    ) {
      const exists = await ThisEventExistsUsecase.call(Number(id));
      if (exists) {
        const event = await GetEventsUsecase.call(Number(id));
        const result = await DeleteAnEventUsecase.call(Number(id));

        const newEvents = user?.events?.filter((event) => {
          return event != Number(id);
        });

        if (event.user_info) {
          const admin2updated = await GetAdminUsecase.call(event.user_info);
          const speaker2updated = await GetSpeakerUsecase.call(event.user_info);
          let updatedUser;
          if (newEvents && speaker2updated) {
            updatedUser = await UpdateAProfileUsecase.call(
              speaker2updated,
              event.user_info
            );
          }
          if (newEvents && admin2updated) {
            updatedUser = await UpdateProfileUsecase.call(
              admin2updated,
              event.user_info
            );
          }
        }
        return result
          ? res.json({ success: "Evento eliminado" })
          : res.status(444).json({ error: "No eliminado" }).status(404);
      } else {
        return res.status(404).json({ error: "Ese evento no existe" });
      }
    } else {
      return res.status(444).json({
        error:
          "No puedes eliminar eventos que no son tuyos al menos que seas admin",
      });
    }
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ error: "Error interno" });
  }
};

let subscribedEvents: number[] = [];
loadSubscribedEvents().then((data) => (subscribedEvents = data));

export const getSubscribedEvents: any = async (req: Request, res: Response) => {
  return res.json(subscribedEvents);
};

export const subscribeToAnEvent: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exists = await ThisEventExistsUsecase.call(Number(id));

    if (exists) {
      const result = await SuscribeToAnEventUsecase.call(Number(id));
      const ApiVersion = await readFile(logFilePath, "utf-8");
      if (result && !subscribedEvents.includes(Number(id))) {
        subscribedEvents.push(Number(id));
        await saveSubscribedEvents(subscribedEvents);
      }

      return result
        ? res.json({
            success: "Subscrito correctamente",
            apiVersion: ApiVersion,
          })
        : res.status(444).json({ error: "No subscrito" });
    } else {
      return res.status(404).json({ error: "Ese evento no existe" });
    }
  } catch (error) {
    console.error("Hubo un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const unSubscribeFromAnEvent: any = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const exists = await ThisEventExistsUsecase.call(Number(id));
    if (exists) {
      const result = await UnSuscribeFromAnEventUsecase.call(Number(id));
      if (result) {
        subscribedEvents = subscribedEvents.filter(
          (event) => event !== Number(id)
        );
        await saveSubscribedEvents(subscribedEvents);
      }

      const ApiVersion = await readFile(logFilePath, "utf-8");

      return result
        ? res.json({
            success: "Desubscrito correctamente",
            apiVersion: ApiVersion,
          })
        : res.status(444).json({ error: "No desubscrito" });
    } else {
      return res.status(404).json({ error: "Ese evento no existe" });
    }
  } catch (error) {
    console.error("Hubo un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const checkEventStatus: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const events = await GetEventsUsecase.call(Number(id));

    if (!events || events.length === 0) {
      return res.status(404).json({ error: "No hay eventos para verificar" });
    }

    const now = new Date();
    const updatedEvents = [];

    for (const event of events) {
      // Reasignar los atributos del evento al formato esperado
      const updatedEvent = transformToMyEvent(event);
      console.log("Verificando " + updatedEvent.title);

      // Verificar si la fecha ya pasó y actualizar el estado
      if (
        new Date(updatedEvent.dateTime).getTime() < now.getTime() &&
        updatedEvent.status !== "Finalizado"
      ) {
        updatedEvent.status = "Finalizado";
        console.log("Estado actualizado");
        await UpdateAnEventUsecase.call(updatedEvent, updatedEvent.eventid); // Actualizar el evento
        updatedEvents.push({
          eventid: updatedEvent.eventid,
          title: updatedEvent.title,
          status: updatedEvent.status,
        });
      }
    }

    return res.json({
      success: "Estados de eventos verificados",
      updatedEvents,
    });
  } catch (error) {
    console.error("Error al verificar el estado de los eventos", error);
    res.status(500).json({ error: "Error interno" });
  }
};

const transformToMyEvent = (event: any): myEvent => {
  return {
    eventid: event.eventid,
    title: event.title,
    category: event.category,
    location: event.location_,
    dateTime: new Date(event.datetime), // Convertir a Date
    attendees: event.attendees,
    availableSpots: event.availablespots, // Reasignar
    description: event.description,
    speakerName: event.speakername, // Reasignar
    speakerAvatar: event.speakeravatar, // Reasignar
    sessionOrder: event.sessionorder, // Convertir de string a JSON
    tags: event.tags,
    avgScore: event.avgscore, // Reasignar
    numberReviews: event.numberreviews, // Reasignar
    status: event.status as "Por empezar" | "Finalizado", // Asegurar el tipo
    user_info: event.user_info,
    track: event.track,
  };
};
