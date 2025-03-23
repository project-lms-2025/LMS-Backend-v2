import connection from "../../config/database.js"; 

class QuestionModel {
  static async createQuestion({table_name, question_id, test_id, question_type, question_text, image_url = null, positive_marks, negative_marks, section, correct_option_id }) {
    const queryStr = `
      INSERT INTO ${table_name}questions (question_id, test_id, question_type, question_text, image_url, positive_marks, negative_marks, section, correct_option_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      await connection.query(queryStr, [question_id, test_id, question_type, question_text, image_url, positive_marks, negative_marks, section, correct_option_id]);
      return { question_id, test_id, question_type, question_text, image_url, positive_marks, negative_marks, section, correct_option_id };
    } catch (err) {
      console.error(`error creating option`, err)
      throw new Error(`Error creating question`);
    }
  }


  static async getQuestionById(table_name, question_id) {
    const queryStr = `SELECT * FROM ${table_name}questions WHERE question_id = ?`;
    try {
      const [rows] = await connection.query(queryStr, [question_id]);
      return rows.length ? rows[0] : null;
    } catch (err) {
      throw new Error(`Error getting question by ID`);
    }
  }

  static async getQuestionsByTestId(table_name, test_id) {
    const queryStr = `SELECT * FROM ${table_name}questions WHERE test_id = ?`;
    try {
      const [rows] = await connection.query(queryStr, [test_id]);
      return rows;
    } catch (err) {
      throw new Error(`Error getting ${table_name}questions by test ID`);
    }
  }

  static async updateQuestion(table_name, question_id, updatedFields) {
    const updates = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`);
    const queryStr = `UPDATE ${table_name}questions SET ${updates.join(', ')} WHERE question_id = ?`;
    try {
      await connection.query(queryStr, [...Object.values(updatedFields), question_id]);
      return { question_id, ...updatedFields };
    } catch (err) {
      throw new Error(`Error updating question`);
    }
  }

  static async deleteQuestion(table_name, question_id) {
    const queryStr = `DELETE FROM ${table_name}questions WHERE question_id = ?`;
    try {
      await connection.query(queryStr, [question_id]);
      return { success: true };
    } catch (err) {
      throw new Error(`Error deleting question`);
    }
  }
}

export default QuestionModel;
