import express from "express";
import {
  updateByKey,
  updateMultiple,
  deleteByKey,
} from "../../controllers/schoolProfileController.js";
import { authenticateToken, isAdmin } from "../../middleware/auth.js";

const router = express.Router();

// Admin routes
router.put("/:key", authenticateToken, isAdmin, updateByKey); // Update single key
router.put("/", authenticateToken, isAdmin, updateMultiple); // Update multiple keys
router.delete("/:key", authenticateToken, isAdmin, deleteByKey); // Delete key

export default router;
