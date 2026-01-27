import express from "express";
import {
  createStudent,
  updateStudent,
  deleteStudent,
  enrollStudent,
  unenrollStudent,
} from "../../controllers/studentController.js";
import { authenticateToken } from "../../middleware/auth.js";
import { uploadPhoto } from "../../middleware/upload.js";

const router = express.Router();

// Admin routes
router.post("/", authenticateToken, uploadPhoto.single("photo"), createStudent);
router.put(
  "/:id",
  authenticateToken,
  uploadPhoto.single("photo"),
  updateStudent,
);
router.delete("/:id", authenticateToken, deleteStudent);
router.post("/:id/enroll", authenticateToken, enrollStudent);
router.delete("/:id/enroll/:class_id", authenticateToken, unenrollStudent);

export default router;
