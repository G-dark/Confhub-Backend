import { Router } from "express";

import { deleteProfile, loginProfile, makeAdmin, updateProfile } from "../Controllers/admin-controller.js";
import { Auth } from "../Middlewares/auth.js";
import { deleteSpeakerProfile, updateSpeakerProfile } from "../Controllers/speaker-controller.js";

const admins = Router();

admins.post("/api/admins/login", loginProfile);
admins.post("/api/admins", makeAdmin);
admins.patch("/api/admins/:email2Update", Auth(), updateProfile);
admins.delete("/api/admins/:email", Auth(), deleteProfile);
admins.patch("/api/admins/speaker/:email2Update", Auth(), updateSpeakerProfile);
admins.delete("/api/admins/speaker/:email", Auth(), deleteSpeakerProfile);

export default admins;
