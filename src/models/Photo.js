import pool from "../config/database.js";

class Photo {
  /**
   * Get all photos for an album
   * @param {number} albumId
   * @returns {Promise<Array>}
   */
  static async getByAlbumId(albumId) {
    const [rows] = await pool.query(
      "SELECT * FROM photos WHERE album_id = ? ORDER BY display_order ASC, created_at ASC",
      [albumId],
    );
    return rows;
  }

  /**
   * Get photo by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM photos WHERE id = ?", [id]);
    return rows[0] || null;
  }

  /**
   * Create new photo
   * @param {Object} photoData
   * @returns {Promise<number>} Inserted ID
   */
  static async create(photoData) {
    const { album_id, photo_url, caption, display_order = 0 } = photoData;

    const [result] = await pool.query(
      `INSERT INTO photos 
       (album_id, photo_url, caption, display_order) 
       VALUES (?, ?, ?, ?)`,
      [album_id, photo_url, caption, display_order],
    );

    return result.insertId;
  }

  /**
   * Update photo
   * @param {number} id
   * @param {Object} photoData
   * @returns {Promise<number>} Affected rows
   */
  static async update(id, photoData) {
    const { photo_url, caption, display_order } = photoData;

    const fields = [];
    const values = [];

    if (photo_url !== undefined) {
      fields.push("photo_url = ?");
      values.push(photo_url);
    }
    if (caption !== undefined) {
      fields.push("caption = ?");
      values.push(caption);
    }
    if (display_order !== undefined) {
      fields.push("display_order = ?");
      values.push(display_order);
    }

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);
    const [result] = await pool.query(
      `UPDATE photos SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows;
  }

  /**
   * Delete photo
   * @param {number} id
   * @returns {Promise<number>} Affected rows
   */
  static async delete(id) {
    const [result] = await pool.query("DELETE FROM photos WHERE id = ?", [id]);
    return result.affectedRows;
  }

  /**
   * Update display order for multiple photos
   * @param {Array} updates - Array of {id, display_order}
   * @returns {Promise<void>}
   */
  static async updateOrder(updates) {
    const promises = updates.map(({ id, display_order }) =>
      this.update(id, { display_order }),
    );
    await Promise.all(promises);
  }
}

export default Photo;
