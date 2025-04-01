import connection from "../config/database.js";
import { generateUniqueId } from "../utils/idGenerator.js";

class BatchEnrollmentModel {
  static async enrollUser({ user_id, batch_id, enrollment_type }) {
    const enrollment_id = generateUniqueId(); // Assuming you have a function for generating unique IDs
    const status="ACTIVE";
    const query = `
      INSERT INTO enrollments (enrollment_id, user_id, entity_id, entity_type, status) 
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      await connection.query(query, [enrollment_id, user_id, batch_id, enrollment_type, status]);
      return { success: true, message: 'User enrolled successfully' };
    } catch (err) {
      console.error('Error enrolling user:', err);
      return { success: false, message: err.message || 'Error enrolling user' };
    }
  }

  static async enrollBatchUsers(items) {
    const query = `
      INSERT INTO enrollments (enrollment_id, user_id, batch_id, enrollment_date) 
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
    try {
      const result = await connection.query(
        `
        SELECT b.*
        FROM enrollments be
        JOIN batches b ON be.entity_id = b.batch_id
        WHERE be.user_id = ?
        `,
        [user_id]
      );
      ('Enrolled batches:', result[0]);
      return { success: true, data: result[0] };  // Returning the result as an array of batches
    } catch (error) {
      console.error('Error fetching enrolled batches:', error);
      return { success: false, message: 'Error fetching enrolled batches' };
    }
  }

  static async getEnrollmentByBatchId(batch_id) {
    const query = `SELECT * FROM enrollments WHERE batch_id = ?`;
    try {
      const [results] = await connection.query(query, [batch_id]);
      return results.length ? { success: true, data: results } : { success: false, message: 'No enrollments found for this batch' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching enrollment details' };
    }
  }

  static async getEnrollmentByEnrollmentId(enrollment_id) {
    const query = `SELECT * FROM enrollments WHERE enrollment_id = ?`;
    try {
      const [results] = await connection.query(query, [enrollment_id]);
      return results.length ? { success: true, data: results[0] } : { success: false, message: 'Enrollment not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching enrollment details' };
    }
  }
}

export default BatchEnrollmentModel;
