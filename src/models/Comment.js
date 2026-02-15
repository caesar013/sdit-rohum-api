import db from "../config/database.js";

class Comment {
  // Get all comments for a news article (public: approved only, admin: all)
  static async getByNewsId(newsId, showAll = false) {
    try {
      let query = `
        SELECT 
          id,
          news_id,
          author_name,
          author_email,
          comment,
          status,
          created_at,
          updated_at
        FROM news_comments
        WHERE news_id = ?
      `;

      if (showAll) {
        query += ` AND status = 'approved'`;
      }

      query += ` ORDER BY created_at DESC`;

      const [comments] = await db.query(query, [newsId]);
      return comments;
    } catch (error) {
      throw error;
    }
  }

  // Get comment by ID
  static async getById(id) {
    try {
      const [comments] = await db.query(
        "SELECT * FROM news_comments WHERE id = ?",
        [id],
      );
      return comments[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new comment
  static async create(commentData) {
    try {
      const { news_id, author_name, author_email, comment } = commentData;

      const [result] = await db.query(
        `INSERT INTO news_comments (news_id, author_name, author_email, comment)
         VALUES (?, ?, ?, ?)`,
        [news_id, author_name, author_email, comment],
      );

      return await this.getById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update comment status (admin only)
  static async updateStatus(id, status) {
    try {
      await db.query("UPDATE news_comments SET status = ? WHERE id = ?", [
        status,
        id,
      ]);

      return await this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete comment
  static async delete(id) {
    try {
      await db.query("DELETE FROM news_comments WHERE id = ?", [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get status counts for a news article
  static async getStatusCounts(newsId) {
    try {
      const [counts] = await db.query(
        `SELECT 
          status,
          COUNT(*) as count
         FROM news_comments
         WHERE news_id = ?
         GROUP BY status`,
        [newsId],
      );

      return {
        pending: counts.find((c) => c.status === "pending")?.count || 0,
        approved: counts.find((c) => c.status === "approved")?.count || 0,
        rejected: counts.find((c) => c.status === "rejected")?.count || 0,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all comments with filters (admin)
  static async getAll(filters = {}) {
    try {
      const { page = 1, limit = 20, status, news_id } = filters;
      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);
      const offset = (parsedPage - 1) * parsedLimit;

      let query = "SELECT COUNT(*) as total FROM news_comments WHERE 1=1";
      const params = [];

      if (status) {
        query += " AND status = ?";
        params.push(status);
      }

      if (news_id) {
        query += " AND news_id = ?";
        params.push(news_id);
      }

      // Get total count
      const [countResult] = await db.query(query, params);
      const total = countResult[0].total;

      // Get paginated data
      let dataQuery = `SELECT 
          nc.*,
          n.title as news_title,
          n.slug as news_slug
         FROM news_comments nc
         LEFT JOIN news n ON nc.news_id = n.id
         WHERE 1=1`;

      if (status) {
        dataQuery += " AND nc.status = ?";
      }

      if (news_id) {
        dataQuery += " AND nc.news_id = ?";
      }

      dataQuery += " ORDER BY nc.created_at DESC LIMIT ? OFFSET ?";

      const [comments] = await db.query(dataQuery, [
        ...params,
        parsedLimit,
        offset,
      ]);

      return {
        comments,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total,
          totalPages: Math.ceil(total / parsedLimit),
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export default Comment;
