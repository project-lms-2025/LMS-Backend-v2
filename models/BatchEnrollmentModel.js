import pool from "../config/databasePool.js"; 
import { generateUniqueId } from "../utils/idGenerator.js";

class BatchEnrollmentModel {
  static async enrollUser({ user_id, entity_id, enrollment_type }) {
    const enrollment_id = generateUniqueId(); // Assuming you have a function for generating unique IDs
    const status = "ACTIVE";
    const query = `
      INSERT INTO enrollments (enrollment_id, user_id, entity_id, entity_type, status) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const connection = await pool.getConnection();  // Get a connection from the pool
    try {
      await connection.beginTransaction();  // Start a transaction
      
      await connection.query(query, [enrollment_id, user_id, entity_id, enrollment_type, status]);
      
      await connection.commit();  // Commit the transaction
      return { success: true, message: 'User enrolled successfully' };
    } catch (err) {
      await connection.rollback();  // Rollback the transaction on error
      console.error('Error enrolling user:', err);
      return { success: false, message: err.message || 'Error enrolling user' };
    } finally {
      connection.release();  // Release the connection back to the pool
    }
  }

  static async enrollBatchUsers(items) {
    const query = `
      INSERT INTO enrollments (enrollment_id, user_id, batch_id, enrollment_date) 
      VALUES ?
    `;
    const values = items.map(item => [generateUniqueId(), item.user_id, item.batch_id, new Date()]);
    
    const connection = await pool.getConnection();  // Get a connection from the pool
    try {
      await connection.beginTransaction();  // Start a transaction
      
      await connection.query(query, [values]);
      
      await connection.commit();  // Commit the transaction
      return { success: true, message: 'Batch users enrolled successfully' };
    } catch (err) {
      await connection.rollback();  // Rollback the transaction on error
      return { success: false, message: err.message || 'Error enrolling batch users' };
    } finally {
      connection.release();  // Release the connection back to the pool
    }
  }

  static async getEnrollmentByUserId(user_id) {
    const query = `
      SELECT b.*
      FROM enrollments be
      JOIN batches b ON be.entity_id = b.batch_id
      WHERE be.user_id = ?
    `;
    
    const connection = await pool.getConnection();  // Get a connection from the pool
    try {
      const [result] = await connection.query(query, [user_id]);
      return { success: true, data: result };  // Returning the result as an array of batches
    } catch (error) {
      console.error('Error fetching enrolled batches:', error);
      return { success: false, message: 'Error fetching enrolled batches' };
    } finally {
      connection.release();  // Release the connection back to the pool
    }
  }

  static async getEnrollmentByBatchId(batch_id) {
    const query = `SELECT * FROM enrollments WHERE batch_id = ?`;

    const connection = await pool.getConnection();  // Get a connection from the pool
    try {
      const [results] = await connection.query(query, [batch_id]);
      return results.length
        ? { success: true, data: results }
        : { success: false, message: 'No enrollments found for this batch' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching enrollment details' };
    } finally {
      connection.release();  // Release the connection back to the pool
    }
  }

  static async getEnrollmentByEnrollmentId(enrollment_id) {
    const query = `SELECT * FROM enrollments WHERE enrollment_id = ?`;

    const connection = await pool.getConnection();  // Get a connection from the pool
    try {
      const [results] = await connection.query(query, [enrollment_id]);
      return results.length
        ? { success: true, data: results[0] }
        : { success: false, message: 'Enrollment not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching enrollment details' };
    } finally {
      connection.release();  // Release the connection back to the pool
    }
  }
}

export default BatchEnrollmentModel;
