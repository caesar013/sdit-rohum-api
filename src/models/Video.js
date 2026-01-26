import pool from "../config/database.js";

class Video {
  /**
   * Get all videos with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Videos list with pagination
   */
  static async getAll(options = {}) {
    const { page = 1, limit = 10, platform = null } = options;

    const offset = (page - 1) * limit;
    let query = "SELECT * FROM videos WHERE 1=1";
    const params = [];

    // Filter by platform
    if (platform) {
      query += " AND platform = ?";
      params.push(platform);
    }

    // Count total
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    // Get paginated data
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
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
   * Get video by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM videos WHERE id = ?", [id]);
    return rows[0] || null;
  }

  /**
   * Create new video
   * @param {Object} videoData
   * @returns {Promise<number>} Inserted ID
   */
  static async create(videoData) {
    const {
      title,
      description,
      video_url,
      thumbnail_url,
      platform = "youtube",
      duration,
    } = videoData;

    const [result] = await pool.query(
      `INSERT INTO videos 
       (title, description, video_url, thumbnail_url, platform, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, video_url, thumbnail_url, platform, duration],
    );

    return result.insertId;
  }

  /**
   * Update video
   * @param {number} id
   * @param {Object} videoData
   * @returns {Promise<number>} Affected rows
   */
  static async update(id, videoData) {
    const { title, description, video_url, thumbnail_url, platform, duration } =
      videoData;

    const fields = [];
    const values = [];

    if (title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (video_url !== undefined) {
      fields.push("video_url = ?");
      values.push(video_url);
    }
    if (thumbnail_url !== undefined) {
      fields.push("thumbnail_url = ?");
      values.push(thumbnail_url);
    }
    if (platform !== undefined) {
      fields.push("platform = ?");
      values.push(platform);
    }
    if (duration !== undefined) {
      fields.push("duration = ?");
      values.push(duration);
    }

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);
    const [result] = await pool.query(
      `UPDATE videos SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows;
  }

  /**
   * Delete video
   * @param {number} id
   * @returns {Promise<number>} Affected rows
   */
  static async delete(id) {
    const [result] = await pool.query("DELETE FROM videos WHERE id = ?", [id]);
    return result.affectedRows;
  }

  /**
   * Increment view count
   * @param {number} id
   * @returns {Promise<void>}
   */
  static async incrementViews(id) {
    await pool.query("UPDATE videos SET views = views + 1 WHERE id = ?", [id]);
  }
}

export default Video;
