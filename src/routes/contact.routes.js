import express from "express";
import {
  getAllMessages,
  getMessageById,
  getStatusCounts,
  createMessage,
  updateMessageStatus,
  deleteMessage,
} from "../controllers/contactController.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public route - Submit contact form
router.post("/", createMessage);

// Protected routes - Admin only
router.get("/", authenticateToken, isAdmin, getAllMessages); // Get all messages with filters
router.get("/stats", authenticateToken, isAdmin, getStatusCounts); // Get status counts
router.get("/:id", authenticateToken, isAdmin, getMessageById); // Get message by ID
router.put("/:id/status", authenticateToken, isAdmin, updateMessageStatus); // Update status
router.delete("/:id", authenticateToken, isAdmin, deleteMessage); // Delete message

export default router;
