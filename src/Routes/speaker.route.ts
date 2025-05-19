import { Router } from "express";
import express from "express"
import { deleteSpeakerProfile, getSpeaker, loginProfile, makeSpeaker, updateSpeakerProfile } from "../Controllers/speaker-controller.js";
import { Auth } from "../Middlewares/auth.js";
import { uploadImage } from "../Middlewares/storage.js";

const speakers = Router();

speakers.get("/api/speakers/:email", Auth(), getSpeaker);
speakers.post("/api/speakers/login", express.json(), loginProfile);
speakers.post("/api/speakers", uploadImage.single('image'), makeSpeaker);
speakers.patch("/api/speakers/:email2Update", Auth(), uploadImage.single('image'), updateSpeakerProfile);
speakers.delete("/api/speakers/:email", Auth(), deleteSpeakerProfile);


export default speakers;
