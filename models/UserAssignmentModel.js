import connection from "../config/database.js";
import { generateUniqueId } from "../utils/idGenerator.js";

class UserAssignmentModel {
  static async assignUser(tableName, { user_id, course_id, batch_id, role }) {
    const query = `
      INSERT INTO ${tableName} (user_id, course_id, batch_id, role) 
      VALUES (?, ?, ?, ?)
    `;
    try {
      await connection.query(query, [user_id, course_id, batch_id, role]);
      return { success: true, message: 'User assigned successfully' };
    } catch (err) {
      return { success: false, message: err.message || 'Error assigning user' };
    }
  }

  static async assignBatchUsers(tableName, items) {
    const query = `
      INSERT INTO ${tableName} (user_id, course_id, batch_id, role) 
      VALUES ?
    `;
    const values = items.map(item => [item.user_id, item.course_id, item.batch_id, item.role]);
    try {
      await connection.query(query, [values]);
      return { success: true, message: 'Batch users assigned successfully' };
    } catch (err) {
      return { success: false, message: err.message || 'Error assigning batch users' };
    }
  }

  static async getItem(tableName, key) {
    const query = `SELECT * FROM ${tableName} WHERE user_id = ?`;
    try {
      const [results] = await connection.query(query, [key]);
      return results.length ? { success: true, data: results[0] } : { success: false, message: 'Item not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching item' };
    }
  }

  static async getItemByUserId(tableName, user_id) {
    const query = `SELECT * FROM ${tableName} WHERE user_id = ?`;
    try {
      const [results] = await connection.query(query, [user_id]);
      return results.length ? { success: true, data: results } : { success: false, message: 'Item not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching items' };
    }
  }
}

export default UserAssignmentModel;
