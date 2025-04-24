import { Router } from "express";

import { getEvents, registerEvent, updateEvent, deleteEvent} from "../Controllers/event-controller.js";

const events = Router();

events.get('/api/events/:id', getEvents);
events.get('/api/events', getEvents);
events.post('/api/events', registerEvent);
events.patch('/api/events/:id',updateEvent);
events.delete('/api/events/:id',deleteEvent);

export default events;