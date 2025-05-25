import express, { Request, Response } from "express";
import { PORT, HOST } from "./config.js";
import events from "../Routes/event.route.js";
import feedbacks from "../Routes/feedback.route.js";
import cors from "cors";
import updateApiVersion from "../Middlewares/update-version.js";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import admins from "../Routes/admin.route.js";
import speakers from "../Routes/speaker.route.js";
import tracks from "../Routes/track.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, "../../ApiVersion.txt");

const app: any = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

if (HOST != "localhost") {
  console.log(path.join(__dirname, '../../src/Images'))
  app.use("/Images", express.static(path.join(__dirname, "../../src/Images")));
} else {
  app.use("/Public", express.static(path.join(__dirname, "../Public")));
}

app.use(admins);
app.use(speakers);

// middlewares
app.use(express.json({ limit: "10mb" }));
app.use(updateApiVersion);

// routes
app.use(events);
app.use(feedbacks);
app.use(tracks);

app.get("/apiVersion", async (req: Request, res: Response) => {
  const apiVersion = await readFile(logFilePath, "utf-8");

  return res.status(200).json({ apiVersion });
});

// fallback
app.use(async (req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server's running on ${PORT} port`);
});
