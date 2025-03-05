import connection from "../../config/database.js"; 
import { promisify } from 'util';

class QuestionModel {
  static async createQuestion({ question_id, test_id, question_type, question_text, image_url = null, positive_marks, negative_marks, section }) {
    const queryStr = `
      INSERT INTO questions (question_id, test_id, question_type, question_text, image_url, positive_marks, negative_marks, section)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      await connection.query(queryStr, [question_id, test_id, question_type, question_text, image_url, positive_marks, negative_marks, section]);
      return { question_id, test_id, question_type, question_text, image_url, positive_marks, negative_marks, section };
    } catch (err) {
      console.error("error creating option", err)
      throw new Error("Error creating question");
    }
  }


  static async getQuestionById(question_id) {
    const queryStr = "SELECT * FROM questions WHERE question_id = ?";
    try {
      const [rows] = await connection.query(queryStr, [question_id]);
      return rows.length ? rows[0] : null;
    } catch (err) {
      throw new Error("Error getting question by ID");
    }
  }

  static async getQuestionsByTestId(test_id) {
    const queryStr = "SELECT * FROM questions WHERE test_id = ?";
    try {
      const [rows] = await connection.query(queryStr, [test_id]);
      return rows;
    } catch (err) {
      throw new Error("Error getting questions by test ID");
    }
  }

  static async updateQuestion(question_id, updatedFields) {
    const updates = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`);
    const queryStr = `UPDATE questions SET ${updates.join(', ')} WHERE question_id = ?`;
    try {
      await connection.query(queryStr, [...Object.values(updatedFields), question_id]);
      return { question_id, ...updatedFields };
    } catch (err) {
      throw new Error("Error updating question");
    }
  }

  static async deleteQuestion(question_id) {
    const queryStr = "DELETE FROM questions WHERE question_id = ?";
    try {
      await connection.query(queryStr, [question_id]);
      return { success: true };
    } catch (err) {
      throw new Error("Error deleting question");
    }
  }
}

export default QuestionModel;
