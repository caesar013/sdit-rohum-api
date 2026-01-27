import pool from "../config/database.js";

class Alumni {
  /**
   * Get all alumni with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Alumni list with pagination
   */
  static async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      registration_status = null,
      graduation_year = null,
      gender = null,
    } = options;

    const offset = (page - 1) * limit;
    let query = "SELECT * FROM alumni WHERE 1=1";
    const params = [];

    // Filter by registration status
    if (registration_status) {
      query += " AND registration_status = ?";
      params.push(registration_status);
    }

    // Filter by graduation year
    if (graduation_year) {
      query += " AND graduation_year = ?";
      params.push(graduation_year);
    }

    // Filter by gender
    if (gender) {
      query += " AND gender = ?";
      params.push(gender);
    }

    // Count total
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    // Get paginated data
    query += " ORDER BY graduation_year DESC, name ASC LIMIT ? OFFSET ?";
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
   * Get alumni by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM alumni WHERE id = ?", [id]);
    return rows[0] || null;
  }

  /**
   * Create new alumni
   * @param {Object} alumniData
   * @returns {Promise<number>} Inserted ID
   */
  static async create(alumniData) {
    const {
      nisn,
      name,
      photo_url,
      gender,
      graduation_year,
      current_school,
      current_occupation,
      phone,
      email,
      address,
      registration_status = "pending",
    } = alumniData;

    const [result] = await pool.query(
      `INSERT INTO alumni 
       (nisn, name, photo_url, gender, graduation_year, current_school, current_occupation, phone, email, address, registration_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nisn,
        name,
        photo_url,
        gender,
        graduation_year,
        current_school,
        current_occupation,
        phone,
        email,
        address,
        registration_status,
      ],
    );

    return result.insertId;
  }

  /**
   * Update alumni
   * @param {number} id
   * @param {Object} alumniData
   * @returns {Promise<number>} Affected rows
   */
  static async update(id, alumniData) {
    const fields = [];
    const values = [];

    // Define allowed fields for update
    const allowedFields = [
      "nisn",
      "name",
      "photo_url",
      "gender",
      "graduation_year",
      "current_school",
      "current_occupation",
      "phone",
      "email",
      "address",
      "registration_status",
    ];

    // Loop through allowed fields and build query
    allowedFields.forEach((field) => {
      if (alumniData[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(alumniData[field]);
      }
    });

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);
    const [result] = await pool.query(
      `UPDATE alumni SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows;
  }

  /**
   * Delete alumni
   * @param {number} id
   * @returns {Promise<number>} Affected rows
   */
  static async delete(id) {
    const [result] = await pool.query("DELETE FROM alumni WHERE id = ?", [id]);
    return result.affectedRows;
  }

  /**
   * Get available graduation years
   * @returns {Promise<Array>}
   */
  static async getAvailableYears() {
    const [rows] = await pool.query(
      `SELECT DISTINCT graduation_year as year 
       FROM alumni 
       ORDER BY graduation_year DESC`,
    );
    return rows.map((row) => row.year);
  }

  /**
   * Get registration status counts
   * @returns {Promise<Object>}
   */
  static async getStatusCounts() {
    const [rows] = await pool.query(
      `SELECT 
        registration_status,
        COUNT(*) as count
       FROM alumni
       GROUP BY registration_status`,
    );

    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0,
    };

    rows.forEach((row) => {
      counts[row.registration_status] = row.count;
      counts.total += row.count;
    });

    return counts;
  }
}

export default Alumni;
