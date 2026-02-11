import Achievement from "../models/Achievement.js";
import { deleteFile } from "../utils/fileHelper.js";
import { handleImageUpdate } from "../utils/imageHelper.js";
import {
  transformImageUrls,
  transformImageUrlsArray,
} from "../utils/urlHelper.js";
import {
  ACHIEVEMENT_CATEGORY_VALUES,
  ACHIEVEMENT_CATEGORY_LABELS,
  ACHIEVEMENT_LEVEL_VALUES,
  ACHIEVEMENT_LEVEL_LABELS,
} from "../constants/index.js";

/**
 * Get all achievements (public)
 */
export const getAllAchievements = async (req, res, next) => {
  try {
    const { page, limit, category, level, year } = req.query;

    // Validate category if provided
    if (category && !ACHIEVEMENT_CATEGORY_VALUES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Kategori tidak valid",
      });
    }

    // Validate level if provided
    if (level && !ACHIEVEMENT_LEVEL_VALUES.includes(level)) {
      return res.status(400).json({
        success: false,
        message: "Level tidak valid",
      });
    }

    const result = await Achievement.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      category,
      level,
      year: year ? parseInt(year) : null,
    });

    // Transform certification_image URLs
    const transformedData = transformImageUrlsArray(result.data, ['certification_image']);

    res.json({
      success: true,
      data: transformedData,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get achievement by ID (public)
 */
export const getAchievementById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.getById(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Prestasi tidak ditemukan",
      });
    }

    // Transform certification_image URL
    const transformedAchievement = transformImageUrls(achievement, ['certification_image']);

    res.json({
      success: true,
      data: transformedAchievement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get achievement categories (public)
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = ACHIEVEMENT_CATEGORY_VALUES.map((value) => ({
      value,
      label: ACHIEVEMENT_CATEGORY_LABELS[value],
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
 * Get achievement levels (public)
 */
export const getLevels = async (req, res, next) => {
  try {
    const levels = ACHIEVEMENT_LEVEL_VALUES.map((value) => ({
      value,
      label: ACHIEVEMENT_LEVEL_LABELS[value],
    }));

    res.json({
      success: true,
      data: levels,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get available years (public)
 */
export const getAvailableYears = async (req, res, next) => {
  try {
    const years = await Achievement.getAvailableYears();

    res.json({
      success: true,
      data: years,
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
    const counts = await Achievement.getCategoryCounts();

    res.json({
      success: true,
      data: counts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get level counts (admin)
 */
export const getLevelCounts = async (req, res, next) => {
  try {
    const counts = await Achievement.getLevelCounts();

    res.json({
      success: true,
      data: counts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new achievement (admin)
 */
export const createAchievement = async (req, res, next) => {
  try {
    const { title, description, achievement_year, category, level } = req.body;

    // Validation
    if (!title || !achievement_year) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Judul dan tahun prestasi harus diisi",
      });
    }

    // Validate category if provided
    if (category && !ACHIEVEMENT_CATEGORY_VALUES.includes(category)) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Kategori tidak valid",
      });
    }

    // Validate level if provided
    if (level && !ACHIEVEMENT_LEVEL_VALUES.includes(level)) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Level tidak valid",
      });
    }

    // Handle certification image upload
    const certification_image = req.file ? `/uploads/photos/${req.file.filename}` : null;

    const achievementId = await Achievement.create({
      title,
      description,
      achievement_year: parseInt(achievement_year),
      category,
      level,
      certification_image,
    });

    const achievement = await Achievement.getById(achievementId);
    const transformedAchievement = transformImageUrls(achievement, ['certification_image']);

    res.status(201).json({
      success: true,
      message: "Prestasi berhasil ditambahkan",
      data: transformedAchievement,
    });
  } catch (error) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    next(error);
  }
};

/**
 * Update achievement (admin)
 */
export const updateAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, achievement_year, category, level } = req.body;

    const existing = await Achievement.getById(id);
    if (!existing) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Prestasi tidak ditemukan",
      });
    }

    // Validate category if provided
    if (category && !ACHIEVEMENT_CATEGORY_VALUES.includes(category)) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Kategori tidak valid",
      });
    }

    // Validate level if provided
    if (level && !ACHIEVEMENT_LEVEL_VALUES.includes(level)) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Level tidak valid",
      });
    }

    // Handle certification image update
    let certification_image = existing.certification_image;
    if (req.file) {
      const result = await handleImageUpdate({
        newImagePath: req.file.path,
        oldImagePath: existing.certification_image,
      });
      certification_image = result.imagePath;
    }

    await Achievement.update(id, {
      title,
      description,
      achievement_year: achievement_year
        ? parseInt(achievement_year)
        : undefined,
      category,
      level,
      certification_image,
    });

    const updated = await Achievement.getById(id);
    const transformedAchievement = transformImageUrls(updated, ['certification_image']);

    res.json({
      success: true,
      message: "Prestasi berhasil diupdate",
      data: transformedAchievement,
    });
  } catch (error) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    next(error);
  }
};

/**
 * Delete achievement (admin)
 */
export const deleteAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;

    const achievement = await Achievement.getById(id);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Prestasi tidak ditemukan",
      });
    }

    // Delete certification image if exists
    if (achievement.certification_image) {
      deleteFile(`.${achievement.certification_image}`);
    }

    await Achievement.delete(id);

    res.json({
      success: true,
      message: "Prestasi berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
