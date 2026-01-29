import express from "express";
import {
  getAllComments,
  getCommentById,
  updateCommentStatus,
  deleteComment,
  getCommentStatusCounts,
} from "../../controllers/commentController.js";
import { authenticateToken, isAdmin } from "../../middleware/auth.js";

const router = express.Router();

// Admin routes for managing comments
router.get("/", authenticateToken, isAdmin, getAllComments); // Get all comments with filters
router.get("/:id", authenticateToken, isAdmin, getCommentById); // Get comment by ID
router.put("/:id/status", authenticateToken, isAdmin, updateCommentStatus); // Update comment status
router.delete("/:id", authenticateToken, isAdmin, deleteComment); // Delete comment
router.get(
  "/news/:newsId/stats",
  authenticateToken,
  isAdmin,
  getCommentStatusCounts,
); // Get status counts for a news article

export default router;
