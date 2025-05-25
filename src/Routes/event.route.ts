import { Router } from "express";

import {
  getEvents,
  registerEvent,
  updateEvent,
  deleteEvent,
  subscribeToAnEvent,
  unSubscribeFromAnEvent,
  getSubscribedEvents,
  checkEventStatus,
  getEventsFromTrack
} from "../Controllers/event-controller.js";
import { Auth } from "../Middlewares/auth.js";

const events = Router();

events.get("/api/events/:id", getEvents);
events.get("/api/events", getEvents);
events.get("/api/events/track/:name", getEventsFromTrack);
events.post("/api/events", Auth(), registerEvent);
events.post("/api/events/check", checkEventStatus);
events.patch("/api/events/:id",Auth(), updateEvent);
events.delete("/api/events/:id",Auth(), deleteEvent);
events.get("/api/subscribed/", getSubscribedEvents);
events.patch("/api/events/subscribe/:id", subscribeToAnEvent);
events.patch("/api/events/unsubscribe/:id", unSubscribeFromAnEvent);

export default events;
