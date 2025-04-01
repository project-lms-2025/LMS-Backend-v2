import pool from '../../config/databasePool.js';

class BatchModel {
  static async queryDatabase(query, params) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [results] = await connection.query(query, params);
      return results;
    } catch (err) {
      console.error(err.message, { stack: err.stack });
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }

  // Create a new batch
  static async createBatch(batch) {
    const query = 'INSERT INTO batches (batch_id, batch_name, description, start_date, end_date) VALUES (?, ?, ?, ?, ?)';
    try {
      await this.queryDatabase(query, [batch.batch_id, batch.batch_name, batch.description, batch.start_date, batch.end_date]);
      return { success: true, message: 'Batch created successfully', data: batch };
    } catch (err) {
      return { success: false, message: err.message || 'Error creating batch' };
    }
  }

  // Get batch by ID
  static async getBatchById(batch_id) {
    const query = 'SELECT * FROM batches WHERE batch_id = ?';
    try {
      const results = await this.queryDatabase(query, [batch_id]);
      return results.length ? { success: true, data: results[0] } : { success: false, message: 'Batch not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching batch' };
    }
  }

  // Get all batches
  static async getAllBatches() {
    const query = 'SELECT * FROM batches';
    try {
      const results = await this.queryDatabase(query);
      return { success: true, data: results };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching batches' };
    }
  }

  // Update batch details
  static async updateBatch(batch_id, updatedBatchData) {
    if (Object.keys(updatedBatchData).length === 0) {
      return { success: false, message: 'No data provided for update' };
    }

    const updateFields = Object.keys(updatedBatchData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updatedBatchData), batch_id];
    const query = `UPDATE batches SET ${updateFields} WHERE batch_id = ?`;

    try {
      const results = await this.queryDatabase(query, values);
      return results.affectedRows ? { success: true, message: 'Batch updated successfully', updatedBatchData } : { success: false, message: 'Batch not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error updating batch' };
    }
  }

  // Delete batch
  static async deleteBatch(batch_id) {
    const query = 'DELETE FROM batches WHERE batch_id = ?';
    try {
      const results = await this.queryDatabase(query, [batch_id]);
      return results.affectedRows ? { success: true, message: 'Batch deleted successfully' } : { success: false, message: 'Batch not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error deleting batch' };
    }
  }

  // Get batches where the user is enrolled
  static async getUserBatches(user_id) {
    const query = `
      SELECT b.batch_id, b.batch_name, b.description, b.start_date, b.end_date 
      FROM enrollments e
      JOIN batches b ON e.entity_id = b.batch_id
      WHERE e.user_id = ? AND e.entity_type = 'BATCH' AND e.status = 'ACTIVE'
    `;
  
    try {
      const [results] = await connection.query(query, [user_id]);
      return results.length ? { success: true, data: results } : { success: false, message: 'No enrolled batches found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching enrolled batches' };
    }
  }  
}

export default BatchModel;
