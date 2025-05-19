import { Router } from "express";
import  express  from "express";

import {
  deleteProfile,
  getAdmin,
  loginProfile,
  makeAdmin,
  updateProfile,
} from "../Controllers/admin-controller.js";
import { Auth } from "../Middlewares/auth.js";
import {
  deleteSpeakerProfile,
  updateSpeakerProfile,
} from "../Controllers/speaker-controller.js";
import { uploadImage } from "../Middlewares/storage.js";

const admins = Router();

admins.get("/api/admins/:email", Auth(), getAdmin);
admins.post("/api/admins/login", express.json(), loginProfile);
admins.post("/api/admins", uploadImage.single("image"), makeAdmin);
admins.patch(
  "/api/admins/:email2Update",
  Auth(),
  uploadImage.single("image"),
  updateProfile
);
admins.delete("/api/admins/:email", Auth(), deleteProfile);
admins.delete("/api/admins/speaker/:email", Auth(), deleteSpeakerProfile);

export default admins;
