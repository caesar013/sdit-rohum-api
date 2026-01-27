import express from "express";
import {
  getAllAlbums,
  getAlbumBySlug,
} from "../controllers/galleryController.js";

const router = express.Router();

// Public routes - Albums
router.get("/albums", getAllAlbums); // Get all albums with photo count
router.get("/albums/slug/:slug", getAlbumBySlug); // Get album by slug with photos

export default router;
