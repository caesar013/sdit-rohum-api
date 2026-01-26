import express from "express";
import {
  getAll,
  getAllAdmin,
  getBySlug,
  getById,
  getCategories,
  getStatuses,
  create,
  update,
  deleteNews,
} from "../controllers/newsController.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";
import { uploadPhoto } from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getAll); // Get published news with pagination
router.get("/categories", getCategories); // Get available categories
router.get("/statuses", getStatuses); // Get available statuses
router.get("/slug/:slug", getBySlug); // Get single news by slug (increments views)

// Protected routes - Admin only
router.get("/admin", authenticateToken, isAdmin, getAllAdmin); // Get all news (including drafts)
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
