import express from "express";
import {
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addPhoto,
  updatePhoto,
  deletePhoto,
  reorderPhotos,
} from "../../controllers/galleryController.js";
import { authenticateToken, isAdmin } from "../../middleware/auth.js";
import { uploadPhoto } from "../../middleware/upload.js";

const router = express.Router();

// Admin routes - Albums
router.get("/albums/:id", authenticateToken, isAdmin, getAlbumById); // Get album by ID
router.post(
  "/albums",
  authenticateToken,
  isAdmin,
  uploadPhoto.single("cover_photo"),
  createAlbum,
);
router.put(
  "/albums/:id",
  authenticateToken,
  isAdmin,
  uploadPhoto.single("cover_photo"),
  updateAlbum,
);
router.delete("/albums/:id", authenticateToken, isAdmin, deleteAlbum);

// Admin routes - Photos
router.post(
  "/albums/:albumId/photos",
  authenticateToken,
  isAdmin,
  uploadPhoto.single("photo"),
  addPhoto,
);
router.put(
  "/photos/:id",
  authenticateToken,
  isAdmin,
  uploadPhoto.single("photo"),
  updatePhoto,
);
router.delete("/photos/:id", authenticateToken, isAdmin, deletePhoto);
router.put(
  "/albums/:albumId/photos/reorder",
  authenticateToken,
  isAdmin,
  reorderPhotos,
);

export default router;
