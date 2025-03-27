import connection from "../config/database.js";
import { generateUniqueId } from "../utils/idGenerator.js";

class BatchEnrollmentModel {
  static async enrollUser({ user_id, batch_id, enrollment_type }) {
    const enrollment_id = generateUniqueId(); // Assuming you have a function for generating unique IDs
    const query = `
      INSERT INTO batch_enrollments (enrollment_id, user_id, batch_id, enrollment_type) 
      VALUES (?, ?, ?, ?)
    `;
    try {
      await connection.query(query, [enrollment_id, user_id, batch_id, enrollment_type]);
      return { success: true, message: 'User enrolled successfully' };
    } catch (err) {
      return { success: false, message: err.message || 'Error enrolling user' };
    }
  }

  static async enrollBatchUsers(items) {
    const query = `
      INSERT INTO batch_enrollments (enrollment_id, user_id, batch_id, enrollment_date) 
      VALUES ?
    `;
    const values = items.map(item => [generateUniqueId(), item.user_id, item.batch_id, new Date()]);
    try {
      await connection.query(query, [values]);
      return { success: true, message: 'Batch users enrolled successfully' };
    } catch (err) {
      return { success: false, message: err.message || 'Error enrolling batch users' };
    }
  }

  static async getEnrollmentByUserId(user_id) {
    const query = `SELECT * FROM batch_enrollments WHERE user_id = ?`;
    try {
      const [results] = await connection.query(query, [user_id]);
      return results.length ? { success: true, data: results } : { success: false, message: 'No enrollments found for this user' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching enrollment details' };
    }
  }

  static async getEnrollmentByBatchId(batch_id) {
    const query = `SELECT * FROM batch_enrollments WHERE batch_id = ?`;
    try {
      const [results] = await connection.query(query, [batch_id]);
      return results.length ? { success: true, data: results } : { success: false, message: 'No enrollments found for this batch' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching enrollment details' };
    }
  }

  static async getEnrollmentByEnrollmentId(enrollment_id) {
    const query = `SELECT * FROM batch_enrollments WHERE enrollment_id = ?`;
    try {
      const [results] = await connection.query(query, [enrollment_id]);
      return results.length ? { success: true, data: results[0] } : { success: false, message: 'Enrollment not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching enrollment details' };
    }
  }
}

export default BatchEnrollmentModel;
