import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, '../../ApiVersion.txt');

 const updateApiVersion = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const modifyingMethods= ['PUT','PATCH','POST','DELETE']

    if(modifyingMethods.includes(req.method)){

    const entry = new Date(Date.now()).toISOString();

    // Sobrescribe el archivo en cada modificación
    fs.writeFile(logFilePath, entry, (err) => {
        if (err) {
          console.error('Error al sobrescribir el log:', err);
        }
      });

    }
    next();
};

export default updateApiVersion;