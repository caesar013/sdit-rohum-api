import pool from "../config/database.js";

class Class {
  /**
   * Get all classes with academic year info
   * @param {Object} options - Query options
   * @returns {Promise<Array>}
   */
  static async getAll(options = {}) {
    const { academic_year_id = null, grade = null } = options;

    let query = `
      SELECT c.*, ay.year as academic_year
      FROM classes c
      JOIN academic_years ay ON c.academic_year_id = ay.id
      WHERE 1=1
    `;
    const params = [];

    if (academic_year_id) {
      query += " AND c.academic_year_id = ?";
      params.push(academic_year_id);
    }

    if (grade) {
      query += " AND c.grade = ?";
      params.push(grade);
    }

    query += " ORDER BY ay.year DESC, c.grade ASC";

    const [rows] = await pool.query(query, params);
    return rows;
  }

  /**
   * Get class by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const [rows] = await pool.query(
      `SELECT c.*, ay.year as academic_year
       FROM classes c
       JOIN academic_years ay ON c.academic_year_id = ay.id
       WHERE c.id = ?`,
      [id],
    );
    return rows[0] || null;
  }

  /**
   * Create new class
   * @param {Object} classData
   * @returns {Promise<number>} Inserted ID
   */
  static async create(classData) {
    const { grade, academic_year_id } = classData;

    const [result] = await pool.query(
      `INSERT INTO classes (grade, academic_year_id) VALUES (?, ?)`,
      [grade, academic_year_id],
    );

    return result.insertId;
  }

  /**
   * Delete class
   * @param {number} id
   * @returns {Promise<number>} Affected rows
   */
  static async delete(id) {
    const [result] = await pool.query("DELETE FROM classes WHERE id = ?", [id]);
    return result.affectedRows;
  }

  /**
   * Get student count for a class
   * @param {number} classId
   * @returns {Promise<number>}
   */
  static async getStudentCount(classId) {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as count FROM student_enrollments WHERE class_id = ?",
      [classId],
    );
    return rows[0].count;
  }
}

export default Class;
