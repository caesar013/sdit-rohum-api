import pool from "../config/database.js";

class SchoolProfile {
  // Valid types for school profile fields
  static VALID_TYPES = ["text", "longtext", "email", "phone", "url", "image"];

  /**
   * Validate field type
   * @param {string} type - The type to validate
   * @returns {boolean} True if valid
   */
  static isValidType(type) {
    return this.VALID_TYPES.includes(type);
  }

  /**
   * Get all school profile keys and values
   * @returns {Promise<Array>} Array of all key-value pairs
   */
  static async getAll() {
    const [rows] = await pool.query(
      "SELECT id, `key`, `value`, `type`, created_at, updated_at FROM school_profile ORDER BY `key` ASC",
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
      "SELECT id, `key`, `value`, `type`, created_at, updated_at FROM school_profile WHERE `key` = ?",
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
      `SELECT \`key\`, \`value\`, \`type\` FROM school_profile WHERE \`key\` IN (${placeholders})`,
      keys,
    );

    // Convert array to object for easier access
    return rows.reduce((acc, row) => {
      acc[row.key] = { value: row.value, type: row.type };
      return acc;
    }, {});
  }

  /**
   * Update or insert a key-value pair
   * @param {string} key - The key to update/insert
   * @param {string} value - The new value
   * @param {string} type - The type of the field (optional, defaults to 'text')
   * @returns {Promise<number>} The affected row ID
   */
  static async update(key, value, type = null) {
    let query, params;

    if (type) {
      // Validate type if provided
      if (!this.isValidType(type)) {
        throw new Error(
          `Invalid type '${type}'. Must be one of: ${this.VALID_TYPES.join(", ")}`,
        );
      }
      query = `INSERT INTO school_profile (\`key\`, \`value\`, \`type\`) 
               VALUES (?, ?, ?) 
               ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), \`type\` = VALUES(\`type\`), updated_at = CURRENT_TIMESTAMP`;
      params = [key, value, type];
    } else {
      // Don't update type if not provided
      query = `INSERT INTO school_profile (\`key\`, \`value\`) 
               VALUES (?, ?) 
               ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), updated_at = CURRENT_TIMESTAMP`;
      params = [key, value];
    }

    const [result] = await pool.query(query, params);
    return result.insertId || result.affectedRows;
  }

  /**
   * Create a new key-value pair
   * @param {string} key - The key to create
   * @param {string} value - The value
   * @param {string} type - The type of the field (optional, defaults to 'text')
   * @returns {Promise<number>} The inserted row ID
   */
  static async create(key, value, type = "text") {
    // Validate type
    if (!this.isValidType(type)) {
      throw new Error(
        `Invalid type '${type}'. Must be one of: ${this.VALID_TYPES.join(", ")}`,
      );
    }

    const [result] = await pool.query(
      `INSERT INTO school_profile (\`key\`, \`value\`, \`type\`) VALUES (?, ?, ?)`,
      [key, value, type],
    );
    return result.insertId;
  }

  /**
   * Update multiple key-value pairs at once
   * @param {Object} data - Object with key-value pairs to update
   * @returns {Promise<number>} Number of affected rows
   */
  static async updateMultiple(data) {
    const entries = Object.entries(data);
    if (entries.length === 0) return 0;

    const promises = entries.map(([key, item]) => {
      // Support both simple values and objects with value/type
      if (typeof item === "object" && item !== null && "value" in item) {
        return this.update(key, item.value, item.type || null);
      }
      return this.update(key, item, null);
    });
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
