import connection from "../../config/database.js"; 
import { promisify } from 'util'; 

class OptionModel {
  static async createOption({ option_id, question_id, option_text, image_url = null, is_correct }) {
    console.log(question_id)
    const queryStr = `
      INSERT INTO options (option_id, question_id, option_text, image_url, is_correct)
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      await connection.query(queryStr, [option_id, question_id, option_text, image_url, is_correct]);
      return { option_id, question_id, option_text, image_url, is_correct };
    } catch (err) {
      console.error("Error creating option:", err);
      throw new Error("Error creating option");
    }
  }

  static async getOptionById(option_id) {
    try {
      const [rows] = await connection.query("SELECT * FROM options WHERE option_id = ?", [option_id]);
      return rows[0] || null;
    } catch (err) {
      console.error("Error getting option by ID:", err);
      throw new Error("Error getting option by ID");
    }
  }

  static async getOptionsByQuestionId(question_id) {
    try {
      const [rows] = await connection.query("SELECT * FROM options WHERE question_id = ?", [question_id]);
      return rows;
    } catch (err) {
      console.error("Error getting options by question ID:", err);
      throw new Error("Error getting options by question ID");
    }
  }

  static async getCorrectOptionsByTestId(test_id) {
    try {
      const [rows] = await connection.query("SELECT * FROM options WHERE test_id = ? AND is_correct = 1", [test_id]);
      return rows;
    } catch (err) {
      console.error("Error getting correct options by test ID:", err);
      throw new Error("Error getting correct options by test ID");
    }
  }

  static async updateOption(option_id, updatedFields) {
    const setClause = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(', ');
    try {
      await connection.query(`UPDATE options SET ${setClause} WHERE option_id = ?`, [...Object.values(updatedFields), option_id]);
      return { option_id, ...updatedFields };
    } catch (err) {
      console.error("Error updating option:", err);
      throw new Error("Error updating option");
    }
  }

  static async deleteOption(option_id) {
    try {
      await connection.query("DELETE FROM options WHERE option_id = ?", [option_id]);
      return { success: true };
    } catch (err) {
      console.error("Error deleting option:", err);
      throw new Error("Error deleting option");
    }
  }
}

export default OptionModel;
