import pool from "../config/database.js";

class StudentEnrollment {
  /**
   * Get all enrollments for a class
   * @param {number} classId
   * @returns {Promise<Array>}
   */
  static async getByClassId(classId) {
    const [rows] = await pool.query(
      `SELECT se.*, s.nisn, s.nis, s.name, s.photo_url, s.gender, s.status
       FROM student_enrollments se
       JOIN students s ON se.student_id = s.id
       WHERE se.class_id = ?
       ORDER BY s.name ASC`,
      [classId],
    );
    return rows;
  }

  /**
   * Create new enrollment
   * @param {Object} enrollmentData
   * @returns {Promise<number>} Inserted ID
   */
  static async create(enrollmentData) {
    const { student_id, class_id } = enrollmentData;

    const [result] = await pool.query(
      `INSERT INTO student_enrollments (student_id, class_id) VALUES (?, ?)`,
      [student_id, class_id],
    );

    return result.insertId;
  }

  /**
   * Delete enrollment
   * @param {number} id
   * @returns {Promise<number>} Affected rows
   */
  static async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM student_enrollments WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }

  /**
   * Delete enrollment by student and class
   * @param {number} studentId
   * @param {number} classId
   * @returns {Promise<number>} Affected rows
   */
  static async deleteByStudentAndClass(studentId, classId) {
    const [result] = await pool.query(
      "DELETE FROM student_enrollments WHERE student_id = ? AND class_id = ?",
      [studentId, classId],
    );
    return result.affectedRows;
  }

  /**
   * Check if enrollment exists
   * @param {number} studentId
   * @param {number} classId
   * @returns {Promise<boolean>}
   */
  static async exists(studentId, classId) {
    const [rows] = await pool.query(
      "SELECT id FROM student_enrollments WHERE student_id = ? AND class_id = ?",
      [studentId, classId],
    );
    return rows.length > 0;
  }
}

export default StudentEnrollment;
