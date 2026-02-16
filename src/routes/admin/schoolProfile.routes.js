import express from "express";
import {
  create,
  updateByKey,
  updateMultiple,
  deleteByKey,
  uploadImage,
} from "../../controllers/schoolProfileController.js";
import { authenticateToken, isAdmin } from "../../middleware/auth.js";
import { uploadPhoto } from "../../middleware/upload.js";

const router = express.Router();

// Admin routes
router.post("/upload-image", authenticateToken, isAdmin, uploadPhoto.single("image"), uploadImage); // Upload image
router.post("/", authenticateToken, isAdmin, create); // Create new key-value pair
router.put("/:key", authenticateToken, isAdmin, updateByKey); // Update single key
router.put("/", authenticateToken, isAdmin, updateMultiple); // Update multiple keys
router.delete("/:key", authenticateToken, isAdmin, deleteByKey); // Delete key

export default router;
