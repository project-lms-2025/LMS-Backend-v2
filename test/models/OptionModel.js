import databasePool from "../../config/databasePool.js";

class OptionModel {

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

  static async createOption({ option_id, question_id, option_text, image_url = null, is_correct }) {
    const queryStr = `
      INSERT INTO options (option_id, question_id, option_text, image_url, is_correct)
      VALUES (?, ?, ?, ?, ?)
    `;
    await OptionModel.queryDatabase(queryStr, [option_id, question_id, option_text, image_url, is_correct], true);
    return { option_id, question_id, option_text, image_url, is_correct };
  }

  static async getOptionById(option_id) {
    const queryStr = `SELECT * FROM options WHERE option_id = ?`;
    const rows = await OptionModel.queryDatabase(queryStr, [option_id]);
    return rows[0] || null;
  }

  static async getOptionsByQuestionId(question_id) {
    const queryStr = `SELECT * FROM options WHERE question_id = ?`;
    return await OptionModel.queryDatabase(queryStr, [question_id]);
  }

  static async getCorrectOptionsByTestId(test_id) {
    const queryStr = `SELECT * FROM options WHERE test_id = ? AND is_correct = 1`;
    return await OptionModel.queryDatabase(queryStr, [test_id]);
  }

  static async updateOption(option_id, updatedFields) {
    const setClause = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(', ');
    const queryStr = `UPDATE options SET ${setClause} WHERE option_id = ?`;
    await OptionModel.queryDatabase(queryStr, [...Object.values(updatedFields), option_id], true);
    return { option_id, ...updatedFields };
  }

  static async deleteOption(option_id) {
    const queryStr = `DELETE FROM options WHERE option_id = ?`;
    await OptionModel.queryDatabase(queryStr, [option_id], true);
    return { success: true };
  }
}

export default OptionModel;
