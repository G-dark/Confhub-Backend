import { Router } from "express";

import {
  getEvents,
  registerEvent,
  updateEvent,
  deleteEvent,
  subscribeToAnEvent,
  unSubscribeFromAnEvent,
} from "../Controllers/event-controller.js";

const events = Router();

events.get("/api/events/:id", getEvents);
events.get("/api/events", getEvents);
events.post("/api/events", registerEvent);
events.patch("/api/events/:id", updateEvent);
events.delete("/api/events/:id", deleteEvent);
events.patch("/api/events/subscribe/:id", subscribeToAnEvent);
events.patch("/api/events/unsubscribe/:id", unSubscribeFromAnEvent);

export default events;
