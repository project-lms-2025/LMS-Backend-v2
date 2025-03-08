import connection from "../../config/database.js"; 
import { generateUniqueId } from "../../utils/idGenerator.js";

class StudentResponseModel {
  static async insertResponses({ test_id, student_id, responses }) {
    console.log(responses)
    for (const response of responses) {
      const { question_id, options_chosen, response_text } = response;
      
      // `${test_id}-${question_id}-${option_ids || response_text || ''}` will be used in future for test evaluation
      const option_id = options_chosen.join('_')
      const response_id = generateUniqueId();
      const queryStr = `
        INSERT INTO student_response2 (response_id, student_id, question_id, selected_option_id, given_ans_text, test_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      try {
        await connection.query(queryStr, [response_id, student_id, question_id, option_id || null, response_text || null, test_id]);
      } catch (err) {
        console.error(err)
        throw new Error("Error inserting response");
      }
    }

    return { message: 'Responses inserted successfully' };
  }

  static async getResponsesByTestId(test_id) {
    const queryStr = "SELECT * FROM student_response2 WHERE student_id = ?";
    try {
      const [rows] = await connection.query(queryStr, [test_id]);
      return rows;
    } catch (err) {
      throw new Error("Error getting responses by test ID");
    }
  }

  static async updateResponse(response_id, updatedFields) {
    const updates = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(', ');
    const queryStr = `UPDATE student_response2 SET ${updates} WHERE response_id = ?`;
    try {
      await connection.query(queryStr, [...Object.values(updatedFields), response_id]);
      return { response_id, ...updatedFields };
    } catch (err) {
      throw new Error("Error updating response");
    }
  }

  static async deleteResponse(response_id) {
    const queryStr = "DELETE FROM student_response2 WHERE response_id = ?";
    try {
      await connection.query(queryStr, [response_id]);
      return { success: true };
    } catch (err) {
      throw new Error("Error deleting response");
    }
  }
}

export default StudentResponseModel;
