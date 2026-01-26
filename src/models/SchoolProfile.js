import pool from "../config/database.js";

class SchoolProfile {
  /**
   * Get all school profile keys and values
   * @returns {Promise<Array>} Array of all key-value pairs
   */
  static async getAll() {
    const [rows] = await pool.query(
      "SELECT id, `key`, `value`, created_at, updated_at FROM school_profile ORDER BY `key` ASC",
    );
    return rows;
  }

  /**
   * Get all keys only (without values)
   * @returns {Promise<Array>} Array of all keys
   */
  static async getAllKeys() {
    const [rows] = await pool.query(
      "SELECT `key` FROM school_profile ORDER BY `key` ASC",
    );
    return rows.map((row) => row.key);
  }

  /**
   * Get value by specific key
   * @param {string} key - The key to search for
   * @returns {Promise<Object|null>} The key-value pair or null if not found
   */
  static async getByKey(key) {
    const [rows] = await pool.query(
      "SELECT id, `key`, `value`, created_at, updated_at FROM school_profile WHERE `key` = ?",
      [key],
    );
    return rows[0] || null;
  }

  /**
   * Get multiple values by keys
   * @param {Array<string>} keys - Array of keys to fetch
   * @returns {Promise<Object>} Object with key-value pairs
   */
  static async getByKeys(keys) {
    if (!keys || keys.length === 0) return {};

    const placeholders = keys.map(() => "?").join(",");
    const [rows] = await pool.query(
      `SELECT \`key\`, \`value\` FROM school_profile WHERE \`key\` IN (${placeholders})`,
      keys,
    );

    // Convert array to object for easier access
    return rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  }

  /**
   * Update or insert a key-value pair
   * @param {string} key - The key to update/insert
   * @param {string} value - The new value
   * @returns {Promise<number>} The affected row ID
   */
  static async update(key, value) {
    const [result] = await pool.query(
      `INSERT INTO school_profile (\`key\`, \`value\`) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), updated_at = CURRENT_TIMESTAMP`,
      [key, value],
    );
    return result.insertId || result.affectedRows;
  }

  /**
   * Update multiple key-value pairs at once
   * @param {Object} data - Object with key-value pairs to update
   * @returns {Promise<number>} Number of affected rows
   */
  static async updateMultiple(data) {
    const entries = Object.entries(data);
    if (entries.length === 0) return 0;

    const promises = entries.map(([key, value]) => this.update(key, value));
    await Promise.all(promises);
    return entries.length;
  }

  /**
   * Delete a key-value pair
   * @param {string} key - The key to delete
   * @returns {Promise<number>} Number of affected rows
   */
  static async delete(key) {
    const [result] = await pool.query(
      "DELETE FROM school_profile WHERE `key` = ?",
      [key],
    );
    return result.affectedRows;
  }

  /**
   * Check if a key exists
   * @param {string} key - The key to check
   * @returns {Promise<boolean>} True if key exists
   */
  static async exists(key) {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as count FROM school_profile WHERE `key` = ?",
      [key],
    );
    return rows[0].count > 0;
  }
}

export default SchoolProfile;
