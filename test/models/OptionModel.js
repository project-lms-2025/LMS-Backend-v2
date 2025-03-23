import connection from "../../config/database.js"; 

class OptionModel {
  static async createOption({table_name, option_id, question_id, option_text, image_url = null, is_correct }) {
    const queryStr = `
      INSERT INTO ${table_name}options (option_id, question_id, option_text, image_url, is_correct)
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      await connection.query(queryStr, [option_id, question_id, option_text, image_url, is_correct]);
      return { option_id, question_id, option_text, image_url, is_correct };
    } catch (err) {
      console.error(`Error creating option:`, err);
      throw new Error(`Error creating option`);
    }
  }

  static async getOptionById(table_name, option_id) {
    try {
      const [rows] = await connection.query(`SELECT * FROM ${table_name}options WHERE option_id = ?`, [option_id]);
      return rows[0] || null;
    } catch (err) {
      console.error(`Error getting option by ID:`, err);
      throw new Error(`Error getting option by ID`);
    }
  }

  static async getOptionsByQuestionId(table_name, question_id) {
    try {
      const [rows] = await connection.query(`SELECT * FROM ${table_name}options WHERE question_id = ?`, [question_id]);
      return rows;
    } catch (err) {
      console.error(`Error getting ${table_name}options by question ID:`, err);
      throw new Error(`Error getting ${table_name}options by question ID`);
    }
  }

  static async getCorrectOptionsByTestId(table_name, test_id) {
    try {
      const [rows] = await connection.query(`SELECT * FROM ${table_name}options WHERE test_id = ? AND is_correct = 1`, [test_id]);
      return rows;
    } catch (err) {
      console.error(`Error getting correct ${table_name}options by test ID:`, err);
      throw new Error(`Error getting correct ${table_name}options by test ID`);
    }
  }

  static async updateOption(table_name, option_id, updatedFields) {
    const setClause = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(', ');
    try {
      await connection.query(`UPDATE ${table_name}options SET ${setClause} WHERE option_id = ?`, [...Object.values(updatedFields), option_id]);
      return { option_id, ...updatedFields };
    } catch (err) {
      console.error(`Error updating option:`, err);
      throw new Error(`Error updating option`);
    }
  }

  static async deleteOption(table_name, option_id) {
    try {
      await connection.query(`DELETE FROM ${table_name}options WHERE option_id = ?`, [option_id]);
      return { success: true };
    } catch (err) {
      console.error(`Error deleting option:`, err);
      throw new Error(`Error deleting option`);
    }
  }
}

export default OptionModel;
