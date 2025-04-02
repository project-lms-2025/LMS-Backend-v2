import databasePool from "../../config/databasePool.js";

class QuestionModel {
  // Helper function to handle database queries
  static async queryDatabase(queryStr, params = [], transaction = false) {
    const connection = await databasePool.getConnection();
    try {
      if (transaction) {
        await connection.beginTransaction();
      }

      const [rows] = await connection.query(queryStr, params);

      if (transaction) {
        await connection.commit();
      }

      return rows;
    } catch (err) {
      if (transaction) {
        await connection.rollback();
      }
      console.error(`Error executing query:`, err);
      throw new Error(`Error executing query`);
    } finally {
      connection.release();
    }
  }

  static async createQuestion({ question_id, test_id, question_type, question_text, image_url = null, positive_marks, negative_marks, section, correct_option_id }) {
    const queryStr = `
      INSERT INTO questions (question_id, test_id, question_type, question_text, image_url, positive_marks, negative_marks, section, correct_option_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await QuestionModel.queryDatabase(queryStr, [question_id, test_id, question_type, question_text, image_url, positive_marks, negative_marks, section, correct_option_id], true);
    return { question_id, test_id, question_type, question_text, image_url, positive_marks, negative_marks, section, correct_option_id };
  }

  static async getQuestionById(question_id) {
    const queryStr = `SELECT * FROM questions WHERE question_id = ?`;
    const rows = await QuestionModel.queryDatabase(queryStr, [question_id]);
    return rows.length ? rows[0] : null;
  }

  static async getQuestionsByTestId(test_id) {
    const queryStr = `SELECT * FROM questions WHERE test_id = ?`;
    return await QuestionModel.queryDatabase(queryStr, [test_id]);
  }

  static async updateQuestion(question_id, updatedFields) {
    const setClause = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(', ');
    const queryStr = `UPDATE questions SET ${setClause} WHERE question_id = ?`;
    await QuestionModel.queryDatabase(queryStr, [...Object.values(updatedFields), question_id], true);
    return { question_id, ...updatedFields };
  }

  static async deleteQuestion(question_id) {
    const queryStr = `DELETE FROM questions WHERE question_id = ?`;
    await QuestionModel.queryDatabase(queryStr, [question_id], true);
    return { success: true };
  }
}

export default QuestionModel;
