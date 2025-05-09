import { Router } from "express";

import {
  getEvents,
  registerEvent,
  updateEvent,
  deleteEvent,
  subscribeToAnEvent,
  unSubscribeFromAnEvent,
  getSubscribedEvents,
  checkEventStatus
} from "../Controllers/event-controller.js";

const events = Router();

events.get("/api/events/:id", getEvents);
events.get("/api/events", getEvents);
events.post("/api/events", registerEvent);
events.post("/api/events/check", checkEventStatus);
events.patch("/api/events/:id", updateEvent);
events.delete("/api/events/:id", deleteEvent);
events.get("/api/subscribed/", getSubscribedEvents);
events.patch("/api/events/subscribe/:id", subscribeToAnEvent);
events.patch("/api/events/unsubscribe/:id", unSubscribeFromAnEvent);

export default events;
