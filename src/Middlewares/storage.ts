import multer from "multer";
import { HOST } from "../App/config.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const save = multer.diskStorage({
  destination: (req, file, cb) => {
    if (HOST != "localhost") {
      console.log(path.join(__dirname, '../../src/Images'))
      cb(null, path.join(__dirname, "../../src/Images"));
    } else {
      console.log(path.join(__dirname, '../Public'))
      cb(null,  path.join(__dirname, '../Public'));
    }
  },
  filename: (req, file, cb) => {
    if (file !== null) {
      const ext = file.originalname.split(".").pop();
      cb(null, (req.body.email ? req.body.email : req.params.email2Update) + "." + ext);
    }
  },
});

const filter = (req: any, file: any, cb: any) => {
  if (
    file &&
    (file.mimetype == "image/jpg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadImage = multer({
  storage: save,
  fileFilter: filter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
