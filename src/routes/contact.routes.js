import express from "express";
import { createMessage } from "../controllers/contactController.js";

const router = express.Router();

// Public route - Submit contact form
router.post("/", createMessage);

export default router;
