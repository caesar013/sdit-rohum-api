import SchoolProfile from "../models/SchoolProfile.js";
import { getImageUrl, getRelativePath } from "../utils/urlHelper.js";

/**
 * Get all school profile data
 * Public endpoint
 */
export const getAll = async (req, res, next) => {
  try {
    const data = await SchoolProfile.getAll();

    // Convert to object format for easier frontend consumption
    const profile = {};
    const metadata = {};

    data.forEach((item) => {
      // Transform photo URLs for image type fields
      if (item.type === "image" && item.value) {
        profile[item.key] = getImageUrl(item.value);
      } else {
        profile[item.key] = item.value;
      }

      // Add metadata for each field
      metadata[item.key] = {
        type: item.type || "text",
      };
    });

    res.json({
      success: true,
      data: profile,
      metadata: metadata,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all available keys
 * Public endpoint
 */
export const getAllKeys = async (req, res, next) => {
  try {
    const keys = await SchoolProfile.getAllKeys();

    res.json({
      success: true,
      data: keys,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get value by specific key
 * Public endpoint
 */
export const getByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const data = await SchoolProfile.getByKey(key);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: `Key '${key}' tidak ditemukan`,
      });
    }

    // Transform photo URLs for image type fields
    const value =
      data.type === "image" && data.value
        ? getImageUrl(data.value)
        : data.value;

    res.json({
      success: true,
      data: {
        key: data.key,
        value: value,
        type: data.type || "text",
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a single key-value pair
 * Protected endpoint - Admin only
 */
export const updateByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value, type } = req.body;

    if (value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        message: "Value harus diisi",
      });
    }

    // Validate type if provided
    if (type && !SchoolProfile.isValidType(type)) {
      return res.status(400).json({
        success: false,
        message: `Type tidak valid. Harus salah satu dari: ${SchoolProfile.VALID_TYPES.join(", ")}`,
      });
    }

    await SchoolProfile.update(key, value, type);

    res.json({
      success: true,
      message: `Data '${key}' berhasil diupdate`,
      data: {
        key,
        value,
        ...(type && { type }),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new key-value pair
 * Protected endpoint - Admin only
 */
export const create = async (req, res, next) => {
  try {
    const { key, value, type = "text" } = req.body;

    // Validate required fields
    if (!key || key.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Key harus diisi",
      });
    }

    if (value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        message: "Value harus diisi",
      });
    }

    // Validate type
    if (!SchoolProfile.isValidType(type)) {
      return res.status(400).json({
        success: false,
        message: `Type tidak valid. Harus salah satu dari: ${SchoolProfile.VALID_TYPES.join(", ")}`,
      });
    }

    // Check if key already exists
    const exists = await SchoolProfile.exists(key);
    if (exists) {
      return res.status(409).json({
        success: false,
        message: `Key '${key}' sudah ada. Gunakan endpoint PUT untuk update.`,
      });
    }

    // Create new key-value pair
    await SchoolProfile.create(key, value, type);

    res.status(201).json({
      success: true,
      message: `Data '${key}' berhasil dibuat`,
      data: {
        key,
        value,
        type,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update multiple key-value pairs at once
 * Protected endpoint - Admin only
 */
export const updateMultiple = async (req, res, next) => {
  try {
    const data = req.body;

    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Data tidak valid. Kirim object dengan key-value pairs",
      });
    }

    const count = await SchoolProfile.updateMultiple(data);

    res.json({
      success: true,
      message: `${count} data berhasil diupdate`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a key-value pair
 * Protected endpoint - Admin only
 */
export const deleteByKey = async (req, res, next) => {
  try {
    const { key } = req.params;

    const exists = await SchoolProfile.exists(key);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: `Key '${key}' tidak ditemukan`,
      });
    }

    await SchoolProfile.delete(key);

    res.json({
      success: true,
      message: `Data '${key}' berhasil dihapus`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload image for school profile
 * Protected endpoint - Admin only
 */
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada file yang diupload",
      });
    }

    // Get the relative path for storage in database
    const relativePath = getRelativePath(req.file.path);

    // Get the accessible URL
    const imageUrl = getImageUrl(relativePath);

    res.status(200).json({
      success: true,
      message: "Image berhasil diupload",
      data: {
        url: imageUrl,
        relativePath: relativePath,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    next(error);
  }
};
