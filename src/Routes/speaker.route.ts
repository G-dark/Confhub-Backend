import { Router } from "express";

import { deleteSpeakerProfile, loginProfile, makeSpeaker, updateSpeakerProfile } from "../Controllers/speaker-controller.js";
import { Auth } from "../Middlewares/auth.js";

const speakers = Router();

speakers.post("/api/speakers/login", loginProfile);
speakers.post("/api/speakers", makeSpeaker);
speakers.patch("/api/speakers/:email2Update", Auth(), updateSpeakerProfile);
speakers.delete("/api/speakers/:email", Auth(), deleteSpeakerProfile);


export default speakers;
