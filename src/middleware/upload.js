import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage configuration for photos
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/photos"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "photo-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Storage configuration for downloads
const downloadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/downloads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "file-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for photos
const photoFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, JPG, PNG, WEBP) are allowed"));
  }
};

// File filter for downloads
const downloadFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|xls|xlsx/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX, XLS, XLSX files are allowed"));
  }
};

// Upload configurations
export const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: photoFilter,
});

export const uploadDownload = multer({
  storage: downloadStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: downloadFilter,
});
