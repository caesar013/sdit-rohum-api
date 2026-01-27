import express from "express";
import {
  getAllFacilities,
  getFacilityById,
  getCategories,
  getConditions,
} from "../controllers/facilityController.js";

const router = express.Router();

// Public routes
router.get("/", getAllFacilities); // Get all facilities with filters
router.get("/categories", getCategories); // Get available categories
router.get("/conditions", getConditions); // Get available conditions
router.get("/:id", getFacilityById); // Get facility by ID

export default router;
