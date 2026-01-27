import pool from "../config/database.js";

class Teacher {
  /**
   * Get all teachers with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Teachers list with pagination
   */
  static async getAll(options = {}) {
    const { page = 1, limit = 10, status = null } = options;

    const offset = (page - 1) * limit;
    let query = "SELECT * FROM teachers WHERE 1=1";
    const params = [];

    // Filter by status
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    // Count total
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    // Get paginated data
    query += " ORDER BY name ASC LIMIT ? OFFSET ?";
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
   * Get teacher by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM teachers WHERE id = ?", [
      id,
    ]);
    return rows[0] || null;
  }

  /**
   * Create new teacher
   * @param {Object} teacherData
   * @returns {Promise<number>} Inserted ID
   */
  static async create(teacherData) {
    const {
      nip,
      name,
      photo_url,
      position,
      subject,
      status = "active",
      education_level,
      phone,
      email,
      joined_date,
      bio,
    } = teacherData;

    const [result] = await pool.query(
      `INSERT INTO teachers 
       (nip, name, photo_url, position, subject, status, education_level, phone, email, joined_date, bio) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nip,
        name,
        photo_url,
        position,
        subject,
        status,
        education_level,
        phone,
        email,
        joined_date,
        bio,
      ],
    );

    return result.insertId;
  }

  /**
   * Update teacher
   * @param {number} id
   * @param {Object} teacherData
   * @returns {Promise<number>} Affected rows
   */
  static async update(id, teacherData) {
    const fields = [];
    const values = [];

    // Define allowed fields for update
    const allowedFields = [
      "nip",
      "name",
      "photo_url",
      "position",
      "subject",
      "status",
      "education_level",
      "phone",
      "email",
      "joined_date",
      "bio",
    ];

    // Loop through allowed fields and build query
    allowedFields.forEach((field) => {
      if (teacherData[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(teacherData[field]);
      }
    });

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);
    const [result] = await pool.query(
      `UPDATE teachers SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows;
  }

  /**
   * Delete teacher
   * @param {number} id
   * @returns {Promise<number>} Affected rows
   */
  static async delete(id) {
    const [result] = await pool.query("DELETE FROM teachers WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  }

  /**
   * Get teacher count by status
   * @returns {Promise<Object>}
   */
  static async getStatusCounts() {
    const [rows] = await pool.query(
      `SELECT 
        status,
        COUNT(*) as count
       FROM teachers
       GROUP BY status`,
    );

    const counts = {
      active: 0,
      inactive: 0,
      retired: 0,
      total: 0,
    };

    rows.forEach((row) => {
      counts[row.status] = row.count;
      counts.total += row.count;
    });

    return counts;
  }
}

export default Teacher;
