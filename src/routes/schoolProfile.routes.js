import express from "express";
import {
  getAll,
  getAllKeys,
  getByKey,
} from "../controllers/schoolProfileController.js";

const router = express.Router();

// Public routes
router.get("/", getAll); // Get all profile data as object
router.get("/keys", getAllKeys); // Get all available keys
router.get("/:key", getByKey); // Get specific key value

export default router;
