import pool from "../../config/databasePool.js";

class TestSeriesModel {
  static async createTestSeries({ series_id, teacher_id, title, description, cost }) {
    const queryStr = `
      INSERT INTO test_series (series_id, teacher_id, title, description, total_tests, cost)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(queryStr, [series_id, teacher_id, title, description, 0, cost]);
      await connection.commit();
      return { series_id, teacher_id, title, description, total_tests: 0 , cost};
    } catch (err) {
      await connection.rollback();
      console.error(err);
      throw new Error("Error creating test series");
    } finally {
      connection.release();
    }
  }

  static async getTestSeriesById(series_id) {
    const queryStr = `
      SELECT * FROM test_series WHERE series_id = ?;
    `;
    
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(queryStr, [series_id]);
      return rows[0] || null;
    } catch (err) {
      throw new Error("Error getting test series by ID");
    } finally {
      connection.release();
    }
  }

  static async getAllTestSeries() {
    const queryStr = `
      SELECT * FROM test_series;
    `;
    
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(queryStr);
      return rows;
    } catch (err) {
      throw new Error("Error getting all test series");
    } finally {
      connection.release();
    }
  }

  static async updateTestSeries(series_id, updatedFields) {
    const updates = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(', ');
    const queryStr = `UPDATE test_series SET ${updates} WHERE series_id = ?`;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(queryStr, [...Object.values(updatedFields), series_id]);
      await connection.commit();
      return { series_id, ...updatedFields };
    } catch (err) {
      await connection.rollback();
      throw new Error("Error updating test series");
    } finally {
      connection.release();
    }
  }

  static async deleteTestSeries(series_id) {
    const queryStr = "DELETE FROM test_series WHERE series_id = ?";
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(queryStr, [series_id]);
      await connection.commit();
      return { success: true };
    } catch (err) {
      await connection.rollback();
      throw new Error("Error deleting test series");
    } finally {
      connection.release();
    }
  }

  static async getUserEnrolledTestSeries(user_id) {
    const queryStr = `
      SELECT ts.series_id, ts.title, ts.description, ts.total_tests
      FROM enrollments e
      JOIN test_series ts ON e.entity_id = ts.series_id
      WHERE e.user_id = ? AND e.entity_type = 'TEST_SERIES' AND e.status = 'ACTIVE'
    `;
    
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(queryStr, [user_id]);
      return rows;
    } catch (err) {
      throw new Error("Error fetching enrolled test series");
    } finally {
      connection.release();
    }
  }
}

export default TestSeriesModel;
