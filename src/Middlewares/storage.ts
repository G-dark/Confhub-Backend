import multer from "multer";


const save = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/Public");
  },
  filename: (req, file, cb) => {
    if (file !== null) {
      const ext = file.originalname.split(".").pop();
      cb(null, req.body.email + Date.now() + "." + ext);
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
