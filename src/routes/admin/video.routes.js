import express from "express";
import {
  create,
  update,
  deleteVideo,
} from "../../controllers/videoController.js";
import { authenticateToken, isAdmin } from "../../middleware/auth.js";

const router = express.Router();

// Admin routes
router.post("/", authenticateToken, isAdmin, create);
router.put("/:id", authenticateToken, isAdmin, update);
router.delete("/:id", authenticateToken, isAdmin, deleteVideo);

export default router;
