import connection from "../../config/database.js";

class TestSeriesModel {
  static async createTestSeries({ series_id, teacher_id, title, description, total_tests }) {
    const queryStr = `
      INSERT INTO test_series (series_id, teacher_id, title, description, total_tests)
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      await connection.query(queryStr, [series_id, teacher_id, title, description, total_tests]);
      return { series_id, teacher_id, title, description, total_tests };
    } catch (err) {
      console.error(err);
      throw new Error("Error creating test series");
    }
  }

  static async getTestSeriesById(series_id) {
    const queryStr = `
      SELECT * FROM test_series WHERE series_id = ?
    `;
    try {
      const [rows] = await connection.query(queryStr, [series_id]);
      return rows[0] || null;
    } catch (err) {
      throw new Error("Error getting test series by ID");
    }
  }

  static async getAllTestSeries() {
    const queryStr = `
      SELECT * FROM test_series
    `;
    try {
      const [rows] = await connection.query(queryStr);
      return rows;
    } catch (err) {
      throw new Error("Error getting all test series");
    }
  }

  static async updateTestSeries(series_id, updatedFields) {
    const updates = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(', ');
    const queryStr = `UPDATE test_series SET ${updates} WHERE series_id = ?`;
    try {
      await connection.query(queryStr, [...Object.values(updatedFields), series_id]);
      return { series_id, ...updatedFields };
    } catch (err) {
      throw new Error("Error updating test series");
    }
  }

  static async deleteTestSeries(series_id) {
    const queryStr = "DELETE FROM test_series WHERE series_id = ?";
    try {
      await connection.query(queryStr, [series_id]);
      return { success: true };
    } catch (err) {
      throw new Error("Error deleting test series");
    }
  }
}

export default TestSeriesModel;