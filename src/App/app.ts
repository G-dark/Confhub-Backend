import express, { Request, Response } from "express";
import { PORT } from "./config.js";
import events from "../Routes/event.route.js";
import feedbacks from "../Routes/feedback.route.js";
import cors from "cors";
import updateApiVersion from "../Middlewares/update-version.js";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, "../../ApiVersion.txt");

const app: any = express();

// middlewares
app.use(express.json());

app.use(updateApiVersion);
app.use(cors());

// routes
app.use(events);
app.use(feedbacks);

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PACTH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));


app.get("/Apiversion", async (req: Request, res: Response) => {
  const apiVersion = await readFile(logFilePath, "utf-8");

  return res.status(200).json({ apiVersion });
});

// fallback
app.use(async (req: Request, res: Response) => {
  res.status(404).json({ msg: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server's running on ${PORT} port`);
});
