import express from "express";
import {
  getAll,
  getAllKeys,
  getByKey,
  updateByKey,
  updateMultiple,
  deleteByKey,
} from "../controllers/schoolProfileController.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAll); // Get all profile data as object
router.get("/keys", getAllKeys); // Get all available keys
router.get("/:key", getByKey); // Get specific key value

// Protected routes - Admin only
router.put("/:key", authenticateToken, isAdmin, updateByKey); // Update single key
router.put("/", authenticateToken, isAdmin, updateMultiple); // Update multiple keys
router.delete("/:key", authenticateToken, isAdmin, deleteByKey); // Delete key

export default router;
