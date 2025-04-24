import { Request, Response } from "express";
import { Database } from "../DB/Database.js";
import { myEvent } from "../Domain/Entities/Event.js";
import { generateRandomId } from "../Utils/tools.js";

export const getEvents: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Database.read(id, "events", "eventid");
    console.log(result);
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

    let eventid:number;

    do {
      eventid = generateRandomId();
    } while (await Database.idExists(eventid, "events", "eventid"));

    const event: myEvent = {
      eventid,
      title,
      description,
      attendees,
      avgScore,
      availableSpots,
      category,
      dateTime:new Date(dateTime),
      location,
      numberReviews,
      sessionOrder,
      speakerAvatar,
      speakerName,
      status,
      tags,
    };

    const result = await Database.register("events", event);

    return result
      ? res.json({ msg: "Evento registrado" })
      : res.json({ msg: "No registrado" }).status(404);
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ msg: "Error interno" });
  }
};

export const updateEvent: any = async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
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


    const event: myEvent = {
      eventid,
      title,
      description,
      attendees,
      avgScore,
      availableSpots,
      category,
      dateTime:new Date(dateTime),
      location,
      numberReviews,
      sessionOrder,
      speakerAvatar,
      speakerName,
      status,
      tags,
    };
    const exists = await Database.idExists(id, "events", "eventid");

    if (exists) {
      const result = await Database.update(id, "events", "eventid", event);

      return result
        ? res.json({ msg: "Evento actualizado" })
        : res.json({ msg: "No actualizado" }).status(404);
    } else {
      throw new Error("Ese evento no existe");
    }
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ msg: "Error interno" });
  }
};

export const deleteEvent: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exists = await Database.idExists(id, "events", "eventid");
    if (exists) {
      const result = await Database.delete(id, "events", "eventid");
      console.log(result);
      return result
      ? res.json({ msg: "Evento eliminado" })
      : res.json({ msg: "No eliminado" }).status(404);
    } else {
      throw new Error("Ese evento no existe");
    }
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ msg: "Error interno" });
  }
};
