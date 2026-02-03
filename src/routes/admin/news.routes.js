import express from "express";
import {
  getAllAdmin,
  getById,
  getCategories,
  getStatuses,
  create,
  update,
  deleteNews,
} from "../../controllers/newsController.js";
import { authenticateToken, isAdmin } from "../../middleware/auth.js";
import { uploadPhoto } from "../../middleware/upload.js";

const router = express.Router();

// Admin routes
router.get("/", authenticateToken, isAdmin, getAllAdmin); // Get all news (including drafts)
router.get("/categories", authenticateToken, isAdmin, getCategories); // Get available categories
router.get("/statuses", authenticateToken, isAdmin, getStatuses); // Get available statuses
router.get("/:id", authenticateToken, isAdmin, getById); // Get by ID (no view increment)
router.post(
  "/",
  authenticateToken,
  isAdmin,
  uploadPhoto.single("featured_image"),
  create,
);
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  uploadPhoto.single("featured_image"),
  update,
);
router.delete("/:id", authenticateToken, isAdmin, deleteNews);

export default router;
