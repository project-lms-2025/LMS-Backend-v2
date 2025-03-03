import connection from "../../config/database.js"; 
import { promisify } from 'util'; 

class TestModel {
  static async createTest({ test_id, teacher_id, course_id, title, description, schedule_date, schedule_time, duration, total_marks }) {
    const queryStr = `
      INSERT INTO tests (test_id, teacher_id, course_id, title, description, schedule_date, schedule_time, duration, total_marks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      await connection.query(queryStr, [test_id, teacher_id, course_id, title, description, schedule_date, schedule_time, duration, total_marks]);
      console.log("queried the db");
      return { test_id, teacher_id, course_id, title, description, schedule_date, schedule_time, duration, total_marks };
    } catch (err) {
      console.error(err)
      throw new Error("Error creating test");
    }
}


  static async getTestById(test_id) {
    const queryStr = "SELECT * FROM tests WHERE test_id = ?";
    try {
      const [rows] = await connection.query(queryStr, [test_id]);
      return rows[0] || null;
    } catch (err) {
      throw new Error("Error getting test by ID");
    }
  }

  static async getAllTests() {
    const queryStr = "SELECT * FROM tests";
    try {
      const [rows] = await connection.query(queryStr);
      return rows;
    } catch (err) {
      throw new Error("Error getting all tests");
    }
  }

  static async updateTest(test_id, updatedFields) {
    const updates = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(', ');
    const queryStr = `UPDATE tests SET ${updates} WHERE test_id = ?`;
    try {
      await connection.query(queryStr, [...Object.values(updatedFields), test_id]);
      return { test_id, ...updatedFields };
    } catch (err) {
      throw new Error("Error updating test");
    }
  }

  static async deleteTest(test_id) {
    const queryStr = "DELETE FROM tests WHERE test_id = ?";
    try {
      await connection.query(queryStr, [test_id]);
      return { success: true };
    } catch (err) {
      throw new Error("Error deleting test");
    }
  }
}

export default TestModel;
