import { Router } from "express";


import { Auth } from "../Middlewares/auth.js";
import { deleteTrack, getTracks, registerTrack, updateTrack } from "../Controllers/track-controller.js";

const tracks = Router();

tracks.get("/api/tracks/:name", getTracks);
tracks.get("/api/tracks", getTracks);
tracks.post("/api/tracks", Auth(), registerTrack);
tracks.patch("/api/tracks/:name",Auth(), updateTrack);
tracks.delete("/api/tracks/:name",Auth(), deleteTrack);

export default tracks;
