import pool from '../config/databasePool.js';

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

  static async createBatch(batch) {
    const query = 'INSERT INTO batches (batch_id, batch_name,description, start_date, end_date) VALUES (?, ?, ?, ?, ?)';
    try {
      await this.queryDatabase(query, [batch.batch_id, batch.batch_name, batch.description,  batch.start_date, batch.end_date]);
      return { success: true, message: 'Batch created successfully', data: batch };
    } catch (err) {
      return { success: false, message: err.message || 'Error creating batch' };
    }
  }

  static async getBatchById(batch_id) {
    const query = 'SELECT * FROM batches WHERE batch_id = ?';
    try {
      const results = await this.queryDatabase(query, [batch_id]);
      return results.length ? { success: true, data: results[0] } : { success: false, message: 'Batch not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching batch' };
    }
  }

  static async getAllBatches() {
    const query = 'SELECT * FROM batches';
    try {
      const results = await this.queryDatabase(query);
      return { success: true, data: results };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching batches' };
    }
  }

  static async updateBatch(batch_id, updatedBatchData) {
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

  static async deleteBatch(batch_id) {
    const query = 'DELETE FROM batches WHERE batch_id = ?';
    try {
      const results = await this.queryDatabase(query, [batch_id]);
      return results.affectedRows ? { success: true, message: 'Batch deleted successfully' } : { success: false, message: 'Batch not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error deleting batch' };
    }
  }
}

export default BatchModel;
