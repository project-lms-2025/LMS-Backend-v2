import connection from "../../config/database.js"; 
import { generateUniqueId } from "../../utils/idGenerator.js";

class StudentResponseModel {
  static async submitResponse({ test_id, student_id, responses }) {
    console.log("user responses: ", responses)
    let totalScore = 0;

    for (const response of responses) {
      const { question_id, options_chosen, response_text } = response;
      
      const option_id = options_chosen.sort().join('_');
      const response_id = generateUniqueId();
      const queryStr = `
        INSERT INTO student_response2 (response_id, student_id, question_id, selected_option_id, given_ans_text, test_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      try {
        await connection.query(queryStr, [response_id, student_id, question_id, option_id || null, response_text || null, test_id]);

        const [question] = await connection.query(`
          SELECT q.question_type, 
                q.question_text, 
                q.correct_option_id, 
                q.positive_marks, 
                q.negative_marks, 
                o.option_text
          FROM questions q
          LEFT JOIN options o ON q.question_id = o.question_id
          WHERE q.question_id = ?;

          `, [question_id]);
        const { question_type,option_text, correct_option_id, positive_marks, negative_marks } = question[0];
        console.log({question_type,option_text, correct_option_id, positive_marks, negative_marks})
        if (question_type === 'NAT') {
          if (response_text === option_text) {
            totalScore += positive_marks;
          } else {
            totalScore -= negative_marks;
          }
        } else if (question_type === 'MCQ' || question_type === 'MSQ') {
          if (option_id === correct_option_id) {
            totalScore += positive_marks;
          } else {
            totalScore -= negative_marks;
          }
        }
      } catch (err) {
        console.error(err);
        throw new Error("Error inserting response");
      }
    }

    const score_id = generateUniqueId();
    const scoreQueryStr = `
      INSERT INTO student_scores (score_id, test_id, student_id, final_score)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE final_score = ?
    `;
    try {
      await connection.query(scoreQueryStr, [score_id, test_id, student_id, totalScore, totalScore]);
    } catch (err) {
      console.error(err);
      throw new Error("Error updating student score");
    }

    return { message: 'Responses inserted and score updated successfully' };
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
