import SchoolProfile from "../models/SchoolProfile.js";

/**
 * Get all school profile data
 * Public endpoint
 */
export const getAll = async (req, res, next) => {
  try {
    const data = await SchoolProfile.getAll();

    // Convert to object format for easier frontend consumption
    const profile = data.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    res.json({
      success: true,
      data: profile,
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

    res.json({
      success: true,
      data: {
        key: data.key,
        value: data.value,
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
    const { value } = req.body;

    if (value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        message: "Value harus diisi",
      });
    }

    await SchoolProfile.update(key, value);

    res.json({
      success: true,
      message: `Data '${key}' berhasil diupdate`,
      data: {
        key,
        value,
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
