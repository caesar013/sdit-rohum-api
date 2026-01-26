import PhotoAlbum from "../models/PhotoAlbum.js";
import Photo from "../models/Photo.js";
import { deleteFile } from "../utils/fileHelper.js";

/**
 * Get all albums (public)
 */
export const getAllAlbums = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const result = await PhotoAlbum.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get album by slug with photos (public)
 */
export const getAlbumBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const album = await PhotoAlbum.getBySlug(slug);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: album,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get album by ID with photos (admin)
 */
export const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await PhotoAlbum.getById(id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: album,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new album (admin)
 */
export const createAlbum = async (req, res, next) => {
  try {
    const { title, description, album_date } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title harus diisi",
      });
    }

    // Get cover photo from upload if exists
    const cover_photo = req.file
      ? `/uploads/photos/${req.file.filename}`
      : null;

    const albumId = await PhotoAlbum.create({
      title,
      description,
      cover_photo,
      album_date,
    });

    const album = await PhotoAlbum.getById(albumId);

    res.status(201).json({
      success: true,
      message: "Album berhasil dibuat",
      data: album,
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      deleteFile(req.file.path);
    }
    next(error);
  }
};

/**
 * Update album (admin)
 */
export const updateAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, album_date } = req.body;

    const existing = await PhotoAlbum.getById(id);
    if (!existing) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Album tidak ditemukan",
      });
    }

    // Handle new cover photo
    let cover_photo = existing.cover_photo;
    if (req.file) {
      cover_photo = `/uploads/photos/${req.file.filename}`;
      // Delete old cover photo if exists
      if (existing.cover_photo) {
        deleteFile(`.${existing.cover_photo}`);
      }
    }

    await PhotoAlbum.update(id, {
      title,
      description,
      cover_photo,
      album_date,
    });

    const updated = await PhotoAlbum.getById(id);

    res.json({
      success: true,
      message: "Album berhasil diupdate",
      data: updated,
    });
  } catch (error) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    next(error);
  }
};

/**
 * Delete album (admin)
 */
export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    const album = await PhotoAlbum.getById(id);
    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album tidak ditemukan",
      });
    }

    // Delete cover photo if exists
    if (album.cover_photo) {
      deleteFile(`.${album.cover_photo}`);
    }

    // Delete all photos in album
    for (const photo of album.photos) {
      if (photo.photo_url) {
        deleteFile(`.${photo.photo_url}`);
      }
    }

    await PhotoAlbum.delete(id);

    res.json({
      success: true,
      message: "Album dan semua foto berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add photo to album (admin)
 */
export const addPhoto = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const { caption, display_order } = req.body;

    // Check if album exists
    const album = await PhotoAlbum.getById(albumId);
    if (!album) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Album tidak ditemukan",
      });
    }

    // Photo upload is required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File foto harus diupload",
      });
    }

    const photo_url = `/uploads/photos/${req.file.filename}`;

    const photoId = await Photo.create({
      album_id: albumId,
      photo_url,
      caption,
      display_order: display_order ? parseInt(display_order) : 0,
    });

    const photo = await Photo.getById(photoId);

    res.status(201).json({
      success: true,
      message: "Foto berhasil ditambahkan",
      data: photo,
    });
  } catch (error) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    next(error);
  }
};

/**
 * Update photo (admin)
 */
export const updatePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { caption, display_order } = req.body;

    const existing = await Photo.getById(id);
    if (!existing) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Foto tidak ditemukan",
      });
    }

    // Handle new photo upload
    let photo_url = existing.photo_url;
    if (req.file) {
      photo_url = `/uploads/photos/${req.file.filename}`;
      // Delete old photo
      if (existing.photo_url) {
        deleteFile(`.${existing.photo_url}`);
      }
    }

    await Photo.update(id, {
      photo_url,
      caption,
      display_order: display_order ? parseInt(display_order) : undefined,
    });

    const updated = await Photo.getById(id);

    res.json({
      success: true,
      message: "Foto berhasil diupdate",
      data: updated,
    });
  } catch (error) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    next(error);
  }
};

/**
 * Delete photo (admin)
 */
export const deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;

    const photo = await Photo.getById(id);
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Foto tidak ditemukan",
      });
    }

    // Delete photo file
    if (photo.photo_url) {
      deleteFile(`.${photo.photo_url}`);
    }

    await Photo.delete(id);

    res.json({
      success: true,
      message: "Foto berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder photos in album (admin)
 */
export const reorderPhotos = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const { photos } = req.body; // Array of {id, display_order}

    // Check if album exists
    const album = await PhotoAlbum.getById(albumId);
    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album tidak ditemukan",
      });
    }

    if (!Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Data photos harus berupa array dengan format {id, display_order}",
      });
    }

    await Photo.updateOrder(photos);

    res.json({
      success: true,
      message: "Urutan foto berhasil diupdate",
    });
  } catch (error) {
    next(error);
  }
};
