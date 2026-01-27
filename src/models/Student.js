import pool from "../config/database.js";

class Student {
  /**
   * Get all students with filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Students list with pagination
   */
  static async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      status = null,
      gender = null,
      academic_year = null,
      grade = null,
    } = options;

    const offset = (page - 1) * limit;
    let query = `
      SELECT DISTINCT s.*
      FROM students s
    `;
    const params = [];
    const conditions = [];

    // If filtering by academic_year or grade, join with enrollments
    if (academic_year || grade) {
      query += `
        JOIN student_enrollments se ON s.id = se.student_id
        JOIN classes c ON se.class_id = c.id
        JOIN academic_years ay ON c.academic_year_id = ay.id
      `;

      if (academic_year) {
        conditions.push("ay.year = ?");
        params.push(academic_year);
      }

      if (grade) {
        conditions.push("c.grade = ?");
        params.push(grade);
      }
    }

    // Filter by status
    if (status) {
      conditions.push("s.status = ?");
      params.push(status);
    }

    // Filter by gender
    if (gender) {
      conditions.push("s.gender = ?");
      params.push(gender);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Count total
    const countQuery = query.replace(
      /SELECT DISTINCT s\.\*/,
      "SELECT COUNT(DISTINCT s.id) as total",
    );
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    // Get paginated data
    query += " ORDER BY s.name ASC LIMIT ? OFFSET ?";
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
   * Get student by ID with current enrollment
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return null;
    }

    const student = rows[0];

    // Get current enrollment
    const [enrollments] = await pool.query(
      `SELECT c.grade, ay.year as academic_year, ay.is_active
       FROM student_enrollments se
       JOIN classes c ON se.class_id = c.id
       JOIN academic_years ay ON c.academic_year_id = ay.id
       WHERE se.student_id = ?
       ORDER BY ay.is_active DESC, ay.year DESC
       LIMIT 1`,
      [id],
    );

    student.current_enrollment = enrollments[0] || null;

    return student;
  }

  /**
   * Create new student
   * @param {Object} studentData
   * @returns {Promise<number>} Inserted ID
   */
  static async create(studentData) {
    const {
      nisn,
      nis,
      name,
      photo_url,
      gender,
      birth_place,
      birth_date,
      status = "active",
      parent_name,
      parent_phone,
      address,
    } = studentData;

    const [result] = await pool.query(
      `INSERT INTO students 
       (nisn, nis, name, photo_url, gender, birth_place, birth_date, status, parent_name, parent_phone, address) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nisn,
        nis,
        name,
        photo_url,
        gender,
        birth_place,
        birth_date,
        status,
        parent_name,
        parent_phone,
        address,
      ],
    );

    return result.insertId;
  }

  /**
   * Update student
   * @param {number} id
   * @param {Object} studentData
   * @returns {Promise<number>} Affected rows
   */
  static async update(id, studentData) {
    const fields = [];
    const values = [];

    // Define allowed fields for update
    const allowedFields = [
      "nisn",
      "nis",
      "name",
      "photo_url",
      "gender",
      "birth_place",
      "birth_date",
      "status",
      "parent_name",
      "parent_phone",
      "address",
    ];

    // Loop through allowed fields and build query
    allowedFields.forEach((field) => {
      if (studentData[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(studentData[field]);
      }
    });

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);
    const [result] = await pool.query(
      `UPDATE students SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows;
  }

  /**
   * Delete student
   * @param {number} id
   * @returns {Promise<number>} Affected rows
   */
  static async delete(id) {
    const [result] = await pool.query("DELETE FROM students WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  }

  /**
   * Get student enrollment history
   * @param {number} studentId
   * @returns {Promise<Array>}
   */
  static async getEnrollmentHistory(studentId) {
    const [rows] = await pool.query(
      `SELECT c.grade, ay.year as academic_year, ay.is_active, se.enrolled_at
       FROM student_enrollments se
       JOIN classes c ON se.class_id = c.id
       JOIN academic_years ay ON c.academic_year_id = ay.id
       WHERE se.student_id = ?
       ORDER BY ay.year DESC`,
      [studentId],
    );
    return rows;
  }
}

export default Student;
