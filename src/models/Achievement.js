import pool from "../config/database.js";

class Achievement {
  /**
   * Get all achievements with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Achievements list with pagination
   */
  static async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      category = null,
      level = null,
      year = null,
    } = options;

    const offset = (page - 1) * limit;
    let query = "SELECT * FROM achievements WHERE 1=1";
    const params = [];

    // Filter by category
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    // Filter by level
    if (level) {
      query += " AND level = ?";
      params.push(level);
    }

    // Filter by year
    if (year) {
      query += " AND achievement_year = ?";
      params.push(year);
    }

    // Count total
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    // Get paginated data
    query +=
      " ORDER BY achievement_year DESC, created_at DESC LIMIT ? OFFSET ?";
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
   * Get achievement by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM achievements WHERE id = ?", [
      id,
    ]);
    return rows[0] || null;
  }

  /**
   * Create new achievement
   * @param {Object} achievementData
   * @returns {Promise<number>} Inserted ID
   */
  static async create(achievementData) {
    const {
      title,
      description,
      achievement_year,
      category = "other",
      level = "school",
      certification_image = null,
    } = achievementData;

    const [result] = await pool.query(
      `INSERT INTO achievements 
       (title, description, achievement_year, category, level, certification_image) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, achievement_year, category, level, certification_image],
    );

    return result.insertId;
  }

  /**
   * Update achievement
   * @param {number} id
   * @param {Object} achievementData
   * @returns {Promise<number>} Affected rows
   */
  static async update(id, achievementData) {
    const fields = [];
    const values = [];

    // Define allowed fields for update
    const allowedFields = [
      "title",
      "description",
      "achievement_year",
      "category",
      "level",
      "certification_image",
    ];

    // Loop through allowed fields and build query
    allowedFields.forEach((field) => {
      if (achievementData[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(achievementData[field]);
      }
    });

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);
    const [result] = await pool.query(
      `UPDATE achievements SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows;
  }

  /**
   * Delete achievement
   * @param {number} id
   * @returns {Promise<number>} Affected rows
   */
  static async delete(id) {
    const [result] = await pool.query("DELETE FROM achievements WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  }

  /**
   * Get achievement count by category
   * @returns {Promise<Object>}
   */
  static async getCategoryCounts() {
    const [rows] = await pool.query(
      `SELECT 
        category,
        COUNT(*) as count
       FROM achievements
       GROUP BY category`,
    );

    const counts = {
      academic: 0,
      sport: 0,
      art: 0,
      other: 0,
      total: 0,
    };

    rows.forEach((row) => {
      counts[row.category] = row.count;
      counts.total += row.count;
    });

    return counts;
  }

  /**
   * Get achievement count by level
   * @returns {Promise<Object>}
   */
  static async getLevelCounts() {
    const [rows] = await pool.query(
      `SELECT 
        level,
        COUNT(*) as count
       FROM achievements
       GROUP BY level`,
    );

    const counts = {
      school: 0,
      district: 0,
      city: 0,
      province: 0,
      national: 0,
      international: 0,
      total: 0,
    };

    rows.forEach((row) => {
      counts[row.level] = row.count;
      counts.total += row.count;
    });

    return counts;
  }

  /**
   * Get available years
   * @returns {Promise<Array>}
   */
  static async getAvailableYears() {
    const [rows] = await pool.query(
      `SELECT DISTINCT achievement_year as year 
       FROM achievements 
       ORDER BY achievement_year DESC`,
    );
    return rows.map((row) => row.year);
  }
}

export default Achievement;
