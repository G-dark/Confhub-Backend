import express from "express";
import {PORT} from "./config.js";
import events from "../Routes/event.routes.js";
import feedbacks from "../Routes/feedback.routes.js";
import cors from 'cors'
const app:any = express();

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PACTH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(events);
app.use(feedbacks);

app.listen(PORT, ()=>{
    console.log(`Server's running on ${PORT} port`);
});