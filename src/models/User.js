import pool from "../config/database.js";

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?",
      [id],
    );
    return rows[0];
  }

  static async create(userData) {
    const { name, email, password, role = "admin" } = userData;
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, role],
    );
    return result.insertId;
  }

  static async updateLastLogin(id) {
    await pool.query("UPDATE users SET updated_at = NOW() WHERE id = ?", [id]);
  }
}

export default User;
