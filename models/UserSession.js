import pool from '../config/databasePool.js';
import { generateUniqueId } from "../utils/idGenerator.js";

class UserSession {
  static async queryDatabase(query, params) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [results] = await connection.query(query, params);
      return results;
    } catch (err) {
      console.error("DB error: ", err);
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }

  static async createOrUpdateSession(email, deviceType, token) {
    const sessionId = generateUniqueId();
    const createdAt = Date.now(); // You might want to use this field later for more session tracking
    const query = `
      INSERT INTO user_sessions (session_id, email, device_type, token)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE token = ?;
    `;
    try {
      await this.queryDatabase(query, [sessionId, email, deviceType, token, token]);
      return { success: true, message: 'Session created or updated successfully' };
    } catch (err) {
      return { success: false, message: err.message || 'Error creating/updating session' };
    }
  }

  static async getSessionByUserAndDevice(email, deviceType) {
    const query = 'SELECT * FROM user_sessions WHERE email = ? AND device_type = ?';
    try {
      const results = await this.queryDatabase(query, [email, deviceType]);
      return results.length ? { success: true, data: results[0] } : { success: false, message: 'Session not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching session' };
    }
  }

  static async deleteSession(email, deviceType) {
    const query = 'DELETE FROM user_sessions WHERE email = ? AND device_type = ?';
    try {
      const results = await this.queryDatabase(query, [email, deviceType]);
      return results.affectedRows ? { success: true, message: 'Session deleted successfully' } : { success: false, message: 'Session not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error deleting session' };
    }
  }
}

export default UserSession;
