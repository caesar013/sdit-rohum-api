import Achievement from "../models/Achievement.js";
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

    res.json({
      success: true,
      ...result,
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

    res.json({
      success: true,
      data: achievement,
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
      return res.status(400).json({
        success: false,
        message: "Judul dan tahun prestasi harus diisi",
      });
    }

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

    const achievementId = await Achievement.create({
      title,
      description,
      achievement_year: parseInt(achievement_year),
      category,
      level,
    });

    const achievement = await Achievement.getById(achievementId);

    res.status(201).json({
      success: true,
      message: "Prestasi berhasil ditambahkan",
      data: achievement,
    });
  } catch (error) {
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
      return res.status(404).json({
        success: false,
        message: "Prestasi tidak ditemukan",
      });
    }

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

    await Achievement.update(id, {
      title,
      description,
      achievement_year: achievement_year
        ? parseInt(achievement_year)
        : undefined,
      category,
      level,
    });

    const updated = await Achievement.getById(id);

    res.json({
      success: true,
      message: "Prestasi berhasil diupdate",
      data: updated,
    });
  } catch (error) {
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

    await Achievement.delete(id);

    res.json({
      success: true,
      message: "Prestasi berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
