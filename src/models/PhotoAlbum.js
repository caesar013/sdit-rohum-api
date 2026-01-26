import pool from "../config/database.js";
import { generateSlug, makeUniqueSlug } from "../utils/newsHelper.js";

class PhotoAlbum {
  /**
   * Get all albums with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Albums list with pagination
   */
  static async getAll(options = {}) {
    const { page = 1, limit = 10 } = options;

    const offset = (page - 1) * limit;

    // Count total
    const [countResult] = await pool.query(
      "SELECT COUNT(*) as total FROM photo_albums"
    );
    const total = countResult[0].total;

    // Get paginated data with photo count
    const [rows] = await pool.query(
      `SELECT pa.*, 
        (SELECT COUNT(*) FROM photos WHERE album_id = pa.id) as photo_count
       FROM photo_albums pa
       ORDER BY pa.album_date DESC, pa.created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

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
   * Get album by ID with photos
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const [albums] = await pool.query(
      "SELECT * FROM photo_albums WHERE id = ?",
      [id]
    );

    if (albums.length === 0) {
      return null;
    }

    const album = albums[0];

    // Get photos for this album
    const [photos] = await pool.query(
      "SELECT * FROM photos WHERE album_id = ? ORDER BY display_order ASC, created_at ASC",
      [id]
    );

    album.photos = photos;
    album.photo_count = photos.length;

    return album;
  }

  /**
   * Get album by slug with photos
   * @param {string} slug
   * @returns {Promise<Object|null>}
   */
  static async getBySlug(slug) {
    const [albums] = await pool.query(
      "SELECT * FROM photo_albums WHERE slug = ?",
      [slug]
    );

    if (albums.length === 0) {
      return null;
    }

    const album = albums[0];

    // Get photos for this album
    const [photos] = await pool.query(
      "SELECT * FROM photos WHERE album_id = ? ORDER BY display_order ASC, created_at ASC",
      [album.id]
    );

    album.photos = photos;
    album.photo_count = photos.length;

    return album;
  }

  /**
   * Create new album
   * @param {Object} albumData
   * @returns {Promise<number>} Inserted ID
   */
  static async create(albumData) {
    const { title, description, cover_photo, album_date } = albumData;

    // Auto-generate slug
    let slug = generateSlug(title);

    // Check if slug exists
    const existing = await this.getBySlug(slug);
    if (existing) {
      slug = makeUniqueSlug(slug);
    }

    const [result] = await pool.query(
      `INSERT INTO photo_albums 
       (title, slug, description, cover_photo, album_date) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, slug, description, cover_photo, album_date]
    );

    return result.insertId;
  }

  /**
   * Update album
   * @param {number} id
   * @param {Object} albumData
   * @returns {Promise<number>} Affected rows
   */
  static async update(id, albumData) {
    const { title, description, cover_photo, album_date } = albumData;

    const existing = await this.getById(id);
    if (!existing) {
      throw new Error("Album not found");
    }

    let slug = existing.slug;

    // Regenerate slug if title changed
    if (title && title !== existing.title) {
      slug = generateSlug(title);

      // Check if new slug exists (excluding current album)
      const [duplicates] = await pool.query(
        "SELECT id FROM photo_albums WHERE slug = ? AND id != ?",
        [slug, id]
      );

      if (duplicates.length > 0) {
        slug = makeUniqueSlug(slug);
      }
    }

    const fields = [];
    const values = [];

    if (title) {
      fields.push("title = ?");
      values.push(title);
    }
    if (slug !== existing.slug) {
      fields.push("slug = ?");
      values.push(slug);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (cover_photo !== undefined) {
      fields.push("cover_photo = ?");
      values.push(cover_photo);
    }
    if (album_date !== undefined) {
      fields.push("album_date = ?");
      values.push(album_date);
    }

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);
    const [result] = await pool.query(
      `UPDATE photo_albums SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return result.affectedRows;
  }

  /**
   * Delete album (cascade deletes photos)
   * @param {number} id
   * @returns {Promise<number>} Affected rows
   */
  static async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM photo_albums WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  }
}

export default PhotoAlbum;
