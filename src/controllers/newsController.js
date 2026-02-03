import News from "../models/News.js";
import {
  NEWS_STATUS,
  NEWS_STATUS_VALUES,
  NEWS_STATUS_LABELS,
  isValidNewsStatus,
} from "../constants/newsStatus.js";
import {
  NEWS_CATEGORY,
  NEWS_CATEGORY_VALUES,
  NEWS_CATEGORY_LABELS,
  isValidNewsCategory,
} from "../constants/newsCategory.js";
import { deleteFile } from "../utils/fileHelper.js";
import { handleImageUpdate } from "../utils/imageHelper.js";
import {
  transformImageUrls,
  transformImageUrlsArray,
} from "../utils/urlHelper.js";

/**
 * Get all available news categories
 * Public endpoint - for dropdowns/selects
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = NEWS_CATEGORY_VALUES.map((value) => ({
      value,
      label: NEWS_CATEGORY_LABELS[value],
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
 * Get all available news statuses
 * Public endpoint - for dropdowns/selects
 */
export const getStatuses = async (req, res, next) => {
  try {
    const statuses = NEWS_STATUS_VALUES.map((value) => ({
      value,
      label: NEWS_STATUS_LABELS[value],
    }));

    res.json({
      success: true,
      data: statuses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all news (public - only published)
 */
export const getAll = async (req, res, next) => {
  try {
    const { page, limit, category, search } = req.query;

    const result = await News.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status: NEWS_STATUS.PUBLISHED,
      category: category || null,
      search: search || null,
    });

    // Transform image URLs to full URLs
    const transformedData = transformImageUrlsArray(result.data, [
      "featured_image",
    ]);

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
 * Get all news for admin (includes drafts and archived)
 */
export const getAllAdmin = async (req, res, next) => {
  try {
    const { page, limit, status, category, search } = req.query;

    const result = await News.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status: status || null, // Allow all statuses
      category: category || null,
      search: search || null,
    });

    // Transform image URLs to full URLs
    const transformedData = transformImageUrlsArray(result.data, [
      "featured_image",
    ]);

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
 * Get single news by slug (public)
 * Increments view count
 */
export const getBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const news = await News.getBySlug(slug);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    // Only show published news to public
    if (news.status !== NEWS_STATUS.PUBLISHED) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    // Increment view count
    await News.incrementViews(news.id);
    news.views += 1;

    // Transform image URL to full URL
    const transformedNews = transformImageUrls(news, ["featured_image"]);

    res.json({
      success: true,
      data: transformedNews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single news by ID (admin)
 * Does not increment view count
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await News.getById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    // Transform image URL to full URL
    const transformedNews = transformImageUrls(news, ["featured_image"]);

    res.json({
      success: true,
      data: transformedNews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new news (admin)
 */
export const create = async (req, res, next) => {
  try {
    const { title, content, excerpt, category, status } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title dan content harus diisi",
      });
    }

    if (category && !isValidNewsCategory(category)) {
      return res.status(400).json({
        success: false,
        message: "Category tidak valid",
      });
    }

    if (status && !isValidNewsStatus(status)) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid",
      });
    }

    // Get featured image from upload if exists
    const featured_image = req.file
      ? `/uploads/photos/${req.file.filename}`
      : null;

    const newsId = await News.create({
      title,
      content,
      excerpt,
      featured_image,
      category: category || NEWS_CATEGORY.GENERAL,
      status: status || NEWS_STATUS.DRAFT,
    });

    const news = await News.getById(newsId);

    // Transform image URL to full URL
    const transformedNews = transformImageUrls(news, ["featured_image"]);

    res.status(201).json({
      success: true,
      message: "Berita berhasil dibuat",
      data: transformedNews,
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
 * Update news (admin)
 */
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, category, status } = req.body;

    const existing = await News.getById(id);
    if (!existing) {
      // Clean up uploaded file if exists
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    // Validation
    if (category && !isValidNewsCategory(category)) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Category tidak valid",
      });
    }

    if (status && !isValidNewsStatus(status)) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Status tidak valid",
      });
    }

    // Handle new featured image with smart comparison
    let featured_image = existing.featured_image;
    if (req.file) {
      const newImagePath = req.file.path;
      const oldImagePath = existing.featured_image
        ? `.${existing.featured_image}`
        : null;

      const result = await handleImageUpdate({
        newImagePath,
        oldImagePath,
      });

      // Use the resolved image path (either old or new)
      featured_image = result.imagePath.startsWith("/uploads")
        ? result.imagePath
        : `/uploads/photos/${req.file.filename}`;

      console.log(`📸 Image update: ${result.message}`);
    }

    await News.update(id, {
      title,
      content,
      excerpt,
      featured_image,
      category,
      status,
    });

    const updated = await News.getById(id);

    // Transform image URL to full URL
    const transformedNews = transformImageUrls(updated, ["featured_image"]);

    res.json({
      success: true,
      message: "Berita berhasil diupdate",
      data: transformedNews,
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
 * Delete news (admin)
 */
export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.getById(id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    // Delete featured image if exists
    if (news.featured_image) {
      deleteFile(`.${news.featured_image}`);
    }

    await News.delete(id);

    res.json({
      success: true,
      message: "Berita berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
