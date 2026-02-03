import Facility from "../models/Facility.js";
import {
  FACILITY_CATEGORY_VALUES,
  FACILITY_CATEGORY_LABELS,
  FACILITY_CONDITION_VALUES,
  FACILITY_CONDITION_LABELS,
} from "../constants/index.js";
import { deleteFile } from "../utils/fileHelper.js";
import { handleImageUpdate } from "../utils/imageHelper.js";
import {
  transformImageUrls,
  transformImageUrlsArray,
} from "../utils/urlHelper.js";

/**
 * Get all facilities (public)
 */
export const getAllFacilities = async (req, res, next) => {
  try {
    const { page, limit, category, condition_status } = req.query;

    // Validate category if provided
    if (category && !FACILITY_CATEGORY_VALUES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Kategori tidak valid",
      });
    }

    // Validate condition status if provided
    if (
      condition_status &&
      !FACILITY_CONDITION_VALUES.includes(condition_status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Status kondisi tidak valid",
      });
    }

    const result = await Facility.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      category,
      condition_status,
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
 * Get facility by ID (public)
 */
export const getFacilityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const facility = await Facility.getById(id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Fasilitas tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: facility,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get facility categories (public)
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = FACILITY_CATEGORY_VALUES.map((value) => ({
      value,
      label: FACILITY_CATEGORY_LABELS[value],
    }));

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get facility conditions (public)
 */
export const getConditions = async (req, res, next) => {
  try {
    const conditions = FACILITY_CONDITION_VALUES.map((value) => ({
      value,
      label: FACILITY_CONDITION_LABELS[value],
    }));

    res.json({
      success: true,
      data: conditions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get category counts (admin)
 */
export const getCategoryCounts = async (req, res, next) => {
  try {
    const counts = await Facility.getCategoryCounts();

    res.json({
      success: true,
      data: counts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get condition counts (admin)
 */
export const getConditionCounts = async (req, res, next) => {
  try {
    const counts = await Facility.getConditionCounts();

    res.json({
      success: true,
      data: counts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new facility (admin)
 */
export const createFacility = async (req, res, next) => {
  try {
    const { name, description, category, quantity, condition_status } =
      req.body;

    // Validation
    if (!name) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Nama fasilitas harus diisi",
      });
    }

    // Validate category if provided
    if (category && !FACILITY_CATEGORY_VALUES.includes(category)) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Kategori tidak valid",
      });
    }

    // Validate condition status if provided
    if (
      condition_status &&
      !FACILITY_CONDITION_VALUES.includes(condition_status)
    ) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Status kondisi tidak valid",
      });
    }

    // Get photo from upload if exists
    const photo_url = req.file ? `/uploads/photos/${req.file.filename}` : null;

    const facilityId = await Facility.create({
      name,
      description,
      photo_url,
      category,
      quantity: quantity ? parseInt(quantity) : 1,
      condition_status,
    });

    const facility = await Facility.getById(facilityId);

    res.status(201).json({
      success: true,
      message: "Fasilitas berhasil ditambahkan",
      data: facility,
    });
  } catch (error) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    next(error);
  }
};

/**
 * Update facility (admin)
 */
export const updateFacility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, category, quantity, condition_status } =
      req.body;

    const existing = await Facility.getById(id);
    if (!existing) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Fasilitas tidak ditemukan",
      });
    }

    // Validate category if provided
    if (category && !FACILITY_CATEGORY_VALUES.includes(category)) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Kategori tidak valid",
      });
    }

    // Validate condition status if provided
    if (
      condition_status &&
      !FACILITY_CONDITION_VALUES.includes(condition_status)
    ) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Status kondisi tidak valid",
      });
    }

    // Handle new photo with smart comparison
    let photo_url = existing.photo_url;
    if (req.file) {
      const newImagePath = req.file.path;
      const oldImagePath = existing.photo_url ? `.${existing.photo_url}` : null;

      const result = await handleImageUpdate({
        newImagePath,
        oldImagePath,
      });

      // Use the resolved image path (either old or new)
      photo_url = result.imagePath.startsWith("/uploads")
        ? result.imagePath
        : `/uploads/photos/${req.file.filename}`;

      console.log(`📸 Facility photo update: ${result.message}`);
    }

    await Facility.update(id, {
      name,
      description,
      photo_url,
      category,
      quantity: quantity ? parseInt(quantity) : undefined,
      condition_status,
    });

    const updated = await Facility.getById(id);

    res.json({
      success: true,
      message: "Fasilitas berhasil diupdate",
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
 * Delete facility (admin)
 */
export const deleteFacility = async (req, res, next) => {
  try {
    const { id } = req.params;

    const facility = await Facility.getById(id);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Fasilitas tidak ditemukan",
      });
    }

    // Delete photo if exists
    if (facility.photo_url) {
      deleteFile(`.${facility.photo_url}`);
    }

    await Facility.delete(id);

    res.json({
      success: true,
      message: "Fasilitas berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
