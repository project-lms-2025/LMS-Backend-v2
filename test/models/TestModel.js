import connection from "../../config/database.js"; 
import { promisify } from 'util'; 
const query = promisify(connection.query).bind(connection);

class TestModel {
  static async createTest({ test_id, teacher_id, course_id, title, description, scheduled_date_time, time_duration }) {
    const queryStr = `
      INSERT INTO tests (test_id, teacher_id, course_id, title, description, scheduled_date_time, time_duration)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      await query(queryStr, [test_id, teacher_id, course_id, title, description, scheduled_date_time, time_duration]);
      return { test_id, teacher_id, course_id, title, description, scheduled_date_time, time_duration };
    } catch (err) {
      throw new Error("Error creating test");
    }
  }

  static async getTestById(test_id) {
    const queryStr = "SELECT * FROM tests WHERE test_id = ?";
    try {
      const [rows] = await query(queryStr, [test_id]);
      return rows[0] || null;
    } catch (err) {
      throw new Error("Error getting test by ID");
    }
  }

  static async getAllTests() {
    const queryStr = "SELECT * FROM tests";
    try {
      const [rows] = await query(queryStr);
      return rows;
    } catch (err) {
      throw new Error("Error getting all tests");
    }
  }

  static async updateTest(test_id, updatedFields) {
    const updates = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(', ');
    const queryStr = `UPDATE tests SET ${updates} WHERE test_id = ?`;
    try {
      await query(queryStr, [...Object.values(updatedFields), test_id]);
      return { test_id, ...updatedFields };
    } catch (err) {
      throw new Error("Error updating test");
    }
  }

  static async deleteTest(test_id) {
    const queryStr = "DELETE FROM tests WHERE test_id = ?";
    try {
      await query(queryStr, [test_id]);
      return { success: true };
    } catch (err) {
      throw new Error("Error deleting test");
    }
  }
}

export default TestModel;
