import express from "express";
import {
  getAll,
  getBySlug,
  getCategories,
  getStatuses,
} from "../controllers/newsController.js";

const router = express.Router();

// Public routes
router.get("/", getAll); // Get published news with pagination
router.get("/categories", getCategories); // Get available categories
router.get("/statuses", getStatuses); // Get available statuses
router.get("/slug/:slug", getBySlug); // Get single news by slug (increments views)

export default router;
