import { Request, Response } from "express";
import { myEvent } from "../Domain/Entities/Event.js";
import { generateRandomId } from "../Utils/tools.js";
import { SuscribeToAnEventUsecase } from "../Domain/Usecases/EventUsecases/SubscribetoAnEventUsecase.js";
import { Conference } from "../Implementations/Conference.js";
import { ThisEventExistsUsecase } from "../Domain/Usecases/EventUsecases/ThisEventExistsUsecase.js";
import { UpdateAnEventUsecase } from "../Domain/Usecases/EventUsecases/UpdateAnEventUsecase.js";
import { DeleteAnEventUsecase } from "../Domain/Usecases/EventUsecases/DeleteAnEventUsecase.js";
import { GetEventsUsecase } from "../Domain/Usecases/EventUsecases/GetEventsUsecase.js";
import { UnSuscribeFromAnEventUsecase } from "../Domain/Usecases/EventUsecases/UnSubscribeFromAnEventUsecase.js";
import { loadSubscribedEvents, saveSubscribedEvents } from "../Utils/subscriptions.js";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, "../../ApiVersion.txt");

export const getEvents: any = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await GetEventsUsecase.call(Number(id));

    return result.length > 0
      ? res.json(result)
      : res.json({ msg: "Sin eventos con ese id" }).status(404);
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ msg: "Error interno" });
  }
};

export const registerEvent: any = async (req: Request, res: Response) => {
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
    };
    const conference = new Conference();
    const result = await conference.makeAnEvent(event);

    const ApiVersion = await readFile(logFilePath, "utf-8");
    return result
      ? res.json({ msg: "Evento registrado", apiVersion: ApiVersion })
      : res.json({ msg: "Evento no registrado" }).status(404);
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ msg: "Error interno" });
  }
};

export const updateEvent: any = async (req: Request, res: Response) => {
  const { id } = req.params;

  const {
    eventid,
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
  } = req.body;

  try {
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
    };

    const exists = await ThisEventExistsUsecase.call(Number(id));

    if (exists) {
      const result = await UpdateAnEventUsecase.call(event, Number(id));

      const ApiVersion = await readFile(logFilePath, "utf-8");

      return result
        ? res.json({ msg: "Evento actualizado", apiversion: ApiVersion })
        : res.json({ msg: "Evento no actualizado" }).status(404);
    } else {
      return res.json({ msg: "Ese evento no existe" });
    }
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ msg: "Error interno" });
  }
};

export const deleteEvent: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exists = await ThisEventExistsUsecase.call(Number(id));
    if (exists) {
      const result = await DeleteAnEventUsecase.call(Number(id));

      const ApiVersion = readFile(logFilePath, "utf-8");

      return result
        ? res.json({ msg: "Evento eliminado", apiversion: ApiVersion })
        : res.json({ msg: "No eliminado" }).status(404);
    } else {
      return res.json({ msg: "Ese evento no existe" });
    }
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ msg: "Error interno" });
  }
};

let subscribedEvents: number[] = [];
loadSubscribedEvents().then((data) => (subscribedEvents = data));

export const getSubscribedEvents: any = async (req: Request, res: Response) => {
  return res.json(subscribedEvents);
  
}

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
        ? res.json({ msg: "Subscrito correctamente", apiVersion: ApiVersion })
        : res.json({ msg: "No subscrito" });
    } else {
      return res.json({ msg: "Ese evento no existe" });
    }
  } catch (error) {
    console.error("Hubo un error", error);
    return res.json({ msg: "Error interno" });
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
        ? res.json({ msg: "Desubscrito correctamente", apiVersion: ApiVersion })
        : res.json({ msg: "No desubscrito" });
    } else {
      return res.json({ msg: "Ese evento no existe" });
    }
  } catch (error) {
    console.error("Hubo un error", error);
    return res.json({ msg: "Error interno" });
  }
};
