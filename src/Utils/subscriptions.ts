import { writeFile, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const subscribedFilePath = path.join(__dirname, "../../SubscribedEvents.json");

async function loadSubscribedEvents(): Promise<number[]> {
  try {
    const content = await readFile(subscribedFilePath, "utf-8");
    return JSON.parse(content);
  } catch (e) {
    return []; 
  }
}

async function saveSubscribedEvents(events: number[]): Promise<void> {
  await writeFile(subscribedFilePath, JSON.stringify(events, null, 2));
}

export { loadSubscribedEvents, saveSubscribedEvents };