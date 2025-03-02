import connection from "../../config/database.js"; 
import { promisify } from 'util'; 
const query = promisify(connection.query).bind(connection);

class ResultModel {
  static async createResult({ result_id, test_id, student_id, student_score, student_rank, total_marks, correct_count, wrong_count }) {
    const queryStr = `
      INSERT INTO results (result_id, test_id, student_id, student_score, student_rank, total_marks, correct_count, wrong_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      await query(queryStr, [result_id, test_id, student_id, student_score, student_rank, total_marks, correct_count, wrong_count]);
      return { result_id, test_id, student_id, student_score, student_rank, total_marks, correct_count, wrong_count };
    } catch (err) {
      throw new Error("Error creating result");
    }
  }

  static async getResultById(result_id) {
    const queryStr = "SELECT * FROM results WHERE result_id = ?";
    try {
      const [rows] = await query(queryStr, [result_id]);
      return rows[0] || null;
    } catch (err) {
      throw new Error("Error getting result by ID");
    }
  }

  static async getResultsByTestId(test_id) {
    const queryStr = "SELECT * FROM results WHERE test_id = ?";
    try {
      const [rows] = await query(queryStr, [test_id]);
      return rows;
    } catch (err) {
      throw new Error("Error getting results by test ID");
    }
  }

  static async updateResult(result_id, updatedFields) {
    const updates = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(', ');
    const queryStr = `UPDATE results SET ${updates} WHERE result_id = ?`;
    try {
      await query(queryStr, [...Object.values(updatedFields), result_id]);
      return { result_id, ...updatedFields };
    } catch (err) {
      throw new Error("Error updating result");
    }
  }

  static async deleteResult(result_id) {
    const queryStr = "DELETE FROM results WHERE result_id = ?";
    try {
      await query(queryStr, [result_id]);
      return { success: true };
    } catch (err) {
      throw new Error("Error deleting result");
    }
  }
}

export default ResultModel;
