import pool from "../config/database.js";

class Facility {
  /**
   * Get all facilities with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Facilities list with pagination
   */
  static async getAll(options = {}) {
    const { page = 1, limit = 10, category = null, condition_status = null } =
      options;

    const offset = (page - 1) * limit;
    let query = "SELECT * FROM facilities WHERE 1=1";
    const params = [];

    // Filter by category
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    // Filter by condition status
    if (condition_status) {
      query += " AND condition_status = ?";
      params.push(condition_status);
    }

    // Count total
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    // Get paginated data
    query += " ORDER BY category ASC, name ASC LIMIT ? OFFSET ?";
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
   * Get facility by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM facilities WHERE id = ?", [
      id,
    ]);
    return rows[0] || null;
  }

  /**
   * Create new facility
   * @param {Object} facilityData
   * @returns {Promise<number>} Inserted ID
   */
  static async create(facilityData) {
    const {
      name,
      description,
      photo_url,
      category = "other",
      quantity = 1,
      condition_status = "good",
    } = facilityData;

    const [result] = await pool.query(
      `INSERT INTO facilities 
       (name, description, photo_url, category, quantity, condition_status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, photo_url, category, quantity, condition_status],
    );

    return result.insertId;
  }

  /**
   * Update facility
   * @param {number} id
   * @param {Object} facilityData
   * @returns {Promise<number>} Affected rows
   */
  static async update(id, facilityData) {
    const fields = [];
    const values = [];

    // Define allowed fields for update
    const allowedFields = [
      "name",
      "description",
      "photo_url",
      "category",
      "quantity",
      "condition_status",
    ];

    // Loop through allowed fields and build query
    allowedFields.forEach((field) => {
      if (facilityData[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(facilityData[field]);
      }
    });

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);
    const [result] = await pool.query(
      `UPDATE facilities SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows;
  }

  /**
   * Delete facility
   * @param {number} id
   * @returns {Promise<number>} Affected rows
   */
  static async delete(id) {
    const [result] = await pool.query("DELETE FROM facilities WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  }

  /**
   * Get facility count by category
   * @returns {Promise<Object>}
   */
  static async getCategoryCounts() {
    const [rows] = await pool.query(
      `SELECT 
        category,
        COUNT(*) as count
       FROM facilities
       GROUP BY category`,
    );

    const counts = {
      classroom: 0,
      laboratory: 0,
      library: 0,
      sports: 0,
      mosque: 0,
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
   * Get facility count by condition status
   * @returns {Promise<Object>}
   */
  static async getConditionCounts() {
    const [rows] = await pool.query(
      `SELECT 
        condition_status,
        COUNT(*) as count
       FROM facilities
       GROUP BY condition_status`,
    );

    const counts = {
      good: 0,
      fair: 0,
      needs_repair: 0,
      total: 0,
    };

    rows.forEach((row) => {
      counts[row.condition_status] = row.count;
      counts.total += row.count;
    });

    return counts;
  }
}

export default Facility;
