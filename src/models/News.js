import pool from "../config/database.js";
import { NEWS_STATUS } from "../constants/newsStatus.js";
import {
  generateSlug,
  makeUniqueSlug,
  generateExcerpt,
} from "../utils/newsHelper.js";

class News {
  /**
   * Get all news with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} News list with pagination
   */
  static async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      status = NEWS_STATUS.PUBLISHED,
      category = null,
      search = null,
    } = options;

    const offset = (page - 1) * limit;
    let query = "SELECT * FROM news WHERE 1=1";
    const params = [];

    // Filter by status
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    // Filter by category
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    // Search in title and content
    if (search) {
      query += " AND (title LIKE ? OR content LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // Count total
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    // Get paginated data
    query += " ORDER BY published_at DESC, created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);
    const [rows] = await pool.query(query, params);

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get news by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM news WHERE id = ?", [id]);
    return rows[0] || null;
  }

  /**
   * Get news by slug
   * @param {string} slug
   * @returns {Promise<Object|null>}
   */
  static async getBySlug(slug) {
    const [rows] = await pool.query("SELECT * FROM news WHERE slug = ?", [
      slug,
    ]);
    return rows[0] || null;
  }

  /**
   * Create new news
   * @param {Object} newsData
   * @returns {Promise<number>} Inserted ID
   */
  static async create(newsData) {
    const {
      title,
      content,
      excerpt,
      featured_image,
      category,
      status = NEWS_STATUS.DRAFT,
    } = newsData;

    // Auto-generate slug
    let slug = generateSlug(title);

    // Check if slug exists
    const existing = await this.getBySlug(slug);
    if (existing) {
      slug = makeUniqueSlug(slug);
    }

    // Auto-generate excerpt if not provided
    const finalExcerpt = excerpt || generateExcerpt(content);

    // Set published_at if status is published
    const published_at = status === NEWS_STATUS.PUBLISHED ? new Date() : null;

    const [result] = await pool.query(
      `INSERT INTO news 
       (title, slug, content, excerpt, featured_image, category, status, published_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        content,
        finalExcerpt,
        featured_image,
        category,
        status,
        published_at,
      ],
    );

    return result.insertId;
  }

  /**
   * Update news
   * @param {number} id
   * @param {Object} newsData
   * @returns {Promise<number>} Affected rows
   */
  static async update(id, newsData) {
    const { title, content, excerpt, featured_image, category, status } =
      newsData;

    const existing = await this.getById(id);
    if (!existing) {
      throw new Error("News not found");
    }

    let slug = existing.slug;

    // Regenerate slug if title changed
    if (title && title !== existing.title) {
      slug = generateSlug(title);

      // Check if new slug exists (excluding current news)
      const [duplicates] = await pool.query(
        "SELECT id FROM news WHERE slug = ? AND id != ?",
        [slug, id],
      );

      if (duplicates.length > 0) {
        slug = makeUniqueSlug(slug);
      }
    }

    // Auto-generate excerpt if content changed but excerpt not provided
    let finalExcerpt = excerpt;
    if (content && !excerpt) {
      finalExcerpt = generateExcerpt(content);
    }

    // Update published_at if status changes to published
    let published_at = existing.published_at;
    if (
      status === NEWS_STATUS.PUBLISHED &&
      existing.status !== NEWS_STATUS.PUBLISHED
    ) {
      published_at = new Date();
    }

    const fields = [];
    const values = [];

    if (title) {
      fields.push("title = ?");
      values.push(title);
    }
    if (slug !== existing.slug) {
      fields.push("slug = ?");
      values.push(slug);
    }
    if (content !== undefined) {
      fields.push("content = ?");
      values.push(content);
    }
    if (finalExcerpt) {
      fields.push("excerpt = ?");
      values.push(finalExcerpt);
    }
    if (featured_image !== undefined) {
      fields.push("featured_image = ?");
      values.push(featured_image);
    }
    if (category) {
      fields.push("category = ?");
      values.push(category);
    }
    if (status) {
      fields.push("status = ?");
      values.push(status);
    }
    if (published_at !== existing.published_at) {
      fields.push("published_at = ?");
      values.push(published_at);
    }

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);
    const [result] = await pool.query(
      `UPDATE news SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows;
  }

  /**
   * Delete news
   * @param {number} id
   * @returns {Promise<number>} Affected rows
   */
  static async delete(id) {
    const [result] = await pool.query("DELETE FROM news WHERE id = ?", [id]);
    return result.affectedRows;
  }

  /**
   * Increment view count
   * @param {number} id
   * @returns {Promise<void>}
   */
  static async incrementViews(id) {
    await pool.query("UPDATE news SET views = views + 1 WHERE id = ?", [id]);
  }

  /**
   * Check if slug exists (excluding specific ID)
   * @param {string} slug
   * @param {number} excludeId
   * @returns {Promise<boolean>}
   */
  static async slugExists(slug, excludeId = null) {
    let query = "SELECT COUNT(*) as count FROM news WHERE slug = ?";
    const params = [slug];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].count > 0;
  }
}

export default News;
