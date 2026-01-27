import pool from "../config/database.js";

class AcademicYear {
  /**
   * Get all academic years
   * @returns {Promise<Array>}
   */
  static async getAll() {
    const [rows] = await pool.query(
      "SELECT * FROM academic_years ORDER BY year DESC",
    );
    return rows;
  }

  /**
   * Get active academic year
   * @returns {Promise<Object|null>}
   */
  static async getActive() {
    const [rows] = await pool.query(
      "SELECT * FROM academic_years WHERE is_active = TRUE LIMIT 1",
    );
    return rows[0] || null;
  }

  /**
   * Get academic year by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM academic_years WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  }

  /**
   * Get academic year by year string
   * @param {string} year
   * @returns {Promise<Object|null>}
   */
  static async getByYear(year) {
    const [rows] = await pool.query(
      "SELECT * FROM academic_years WHERE year = ?",
      [year],
    );
    return rows[0] || null;
  }

  /**
   * Create new academic year
   * @param {Object} yearData
   * @returns {Promise<number>} Inserted ID
   */
  static async create(yearData) {
    const { year, is_active = false } = yearData;

    const [result] = await pool.query(
      `INSERT INTO academic_years (year, is_active) VALUES (?, ?)`,
      [year, is_active],
    );

    return result.insertId;
  }

  /**
   * Set active academic year (deactivates all others)
   * @param {number} id
   * @returns {Promise<void>}
   */
  static async setActive(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Deactivate all
      await connection.query("UPDATE academic_years SET is_active = FALSE");

      // Activate the selected one
      await connection.query(
        "UPDATE academic_years SET is_active = TRUE WHERE id = ?",
        [id],
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Delete academic year
   * @param {number} id
   * @returns {Promise<number>} Affected rows
   */
  static async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM academic_years WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }
}

export default AcademicYear;
