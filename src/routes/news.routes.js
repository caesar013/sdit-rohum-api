import express from "express";
import {
  getAll,
  getBySlug,
  getCategories,
  getStatuses,
} from "../controllers/newsController.js";
import {
  getCommentsByNewsId,
  createComment,
} from "../controllers/commentController.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = express.Router();

// Public routes
router.get("/", getAll); // Get published news with pagination
router.get("/categories", getCategories); // Get available categories
router.get("/statuses", getStatuses); // Get available statuses
router.get("/slug/:slug", getBySlug); // Get single news by slug (increments views)

// Comment routes
router.get("/:newsId/comments", optionalAuth, getCommentsByNewsId); // Get comments (approved only for public, all for admin)
router.post("/:newsId/comments", createComment); // Submit a comment (public)

export default router;
