import pool from "../config/database.js";
import { CONTACT_STATUS } from "../constants/contactStatus.js";

class ContactMessage {
  /**
   * Get all contact messages with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Messages list with pagination
   */
  static async getAll(options = {}) {
    const { page = 1, limit = 10, status = null } = options;

    const offset = (page - 1) * limit;
    let query = "SELECT * FROM contact_messages WHERE 1=1";
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
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
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
   * Get message by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM contact_messages WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  }

  /**
   * Create new contact message
   * @param {Object} messageData
   * @returns {Promise<number>} Inserted ID
   */
  static async create(messageData) {
    const { name, email, phone, subject, message } = messageData;

    const [result] = await pool.query(
      `INSERT INTO contact_messages 
       (name, email, phone, subject, message) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, subject, message],
    );

    return result.insertId;
  }

  /**
   * Update message status
   * @param {number} id
   * @param {string} status - 'unread', 'read', 'replied'
   * @returns {Promise<number>} Affected rows
   */
  static async updateStatus(id, status) {
    const [result] = await pool.query(
      "UPDATE contact_messages SET status = ? WHERE id = ?",
      [status, id],
    );
    return result.affectedRows;
  }

  /**
   * Delete message
   * @param {number} id
   * @returns {Promise<number>} Affected rows
   */
  static async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM contact_messages WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }

  /**
   * Get message counts by status
   * @returns {Promise<Object>}
   */
  static async getStatusCounts() {
    const [rows] = await pool.query(
      `SELECT 
        status,
        COUNT(*) as count
       FROM contact_messages
       GROUP BY status`,
    );

    const counts = {
      [CONTACT_STATUS.UNREAD]: 0,
      [CONTACT_STATUS.READ]: 0,
      [CONTACT_STATUS.REPLIED]: 0,
      total: 0,
    };

    rows.forEach((row) => {
      counts[row.status] = row.count;
      counts.total += row.count;
    });

    return counts;
  }
}

export default ContactMessage;
