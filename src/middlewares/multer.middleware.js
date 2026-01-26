import multer from "multer";

// disk storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Multer destination - fieldname:", file.fieldname);
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    console.log("Multer filename - file:", file.originalname);
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    console.log(" Multer fileFilter:", file.fieldname, file.originalname);
    cb(null, true);
  },
});
