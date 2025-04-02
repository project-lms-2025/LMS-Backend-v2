import connection from "../../config/database.js";

class TestSeriesModel {
  // Create a new test series
  static async createTestSeries({ series_id, teacher_id, title, description }) {
    const queryStr = `
      INSERT INTO test_series (series_id, teacher_id, title, description, total_tests)
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      await connection.query(queryStr, [series_id, teacher_id, title, description, 0]);
      return { series_id, teacher_id, title, description, total_tests: 0 };
    } catch (err) {
      console.error(err);
      throw new Error("Error creating test series");
    }
  }

  // Get a test series by its ID
  static async getTestSeriesById(series_id) {
    const queryStr = `
      SELECT * FROM test_series WHERE series_id = ?;
    `;
    try {
      const [rows] = await connection.query(queryStr, [series_id]);
      return rows[0] || null;
    } catch (err) {
      throw new Error("Error getting test series by ID");
    }
  }

  // Get all test series
  static async getAllTestSeries() {
    const queryStr = `
      SELECT * FROM test_series;
    `;
    try {
      const [rows] = await connection.query(queryStr);
      return rows;
    } catch (err) {
      throw new Error("Error getting all test series");
    }
  }

  // Update a test series
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

  // Delete a test series
  static async deleteTestSeries(series_id) {
    const queryStr = "DELETE FROM test_series WHERE series_id = ?";
    try {
      await connection.query(queryStr, [series_id]);
      return { success: true };
    } catch (err) {
      throw new Error("Error deleting test series");
    }
  }

  // Get the test series that a user is enrolled in
  static async getUserEnrolledTestSeries(user_id) {
    const queryStr = `
      SELECT ts.series_id, ts.title, ts.description, ts.total_tests
      FROM enrollments e
      JOIN test_series ts ON e.entity_id = ts.series_id
      WHERE e.user_id = ? AND e.entity_type = 'TEST_SERIES' AND e.status = 'ACTIVE'
    `;
    try {
      const [rows] = await connection.query(queryStr, [user_id]);
      return rows;
    } catch (err) {
      throw new Error("Error fetching enrolled test series");
    }
  }
}

export default TestSeriesModel;
