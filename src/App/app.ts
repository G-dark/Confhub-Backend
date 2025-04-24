import express from "express";
import {PORT} from "./config.js";
import events from "../Routes/events.routes.js";

const app:any = express();

app.use(express.json());
app.use(events);

app.listen(PORT, ()=>{
    console.log(`Server's running on ${PORT} port`);
});