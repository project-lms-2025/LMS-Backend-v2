import connection from "../../config/databasePool.js"; 
import { generateUniqueId } from "../../utils/idGenerator.js";
import markingSchemes from "../../utils/markingSchemes.js";

class StudentResponseModel {
  static async submitResponse({ table_name, test_id, student_id, responses }) {
    let totalScore = 0;

    const conn = await connection.getConnection();  // Get connection from the pool
    await conn.beginTransaction();  // Start transaction

    try {
      for (const response of responses) {
        const { question_id, options_chosen, response_text } = response;
        
        const option_id = options_chosen.sort().join('_');
        const response_id = generateUniqueId();
        const queryStr = `
          INSERT INTO ${table_name}student_response2 (response_id, student_id, question_id, selected_option_id, given_ans_text, test_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        // Insert the student response
        await conn.query(queryStr, [response_id, student_id, question_id, option_id || null, response_text || null, test_id]);

        const [question] = await conn.query(`
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

        const { question_type, option_text, correct_option_id, positive_marks, negative_marks } = question[0];

        const testType = 'GATE';
        const markingFunction = this.getMarkingFunction(testType, question_type);

        if (markingFunction) {
          totalScore += markingFunction({option_id, correct_option_id, response_text, option_text, positive_marks, negative_marks});
        }
      }

      // throw new Error('Simulated error for testing rollback');

      const score_id = generateUniqueId();
      const scoreQueryStr = `
        INSERT INTO student_scores (score_id, test_id, student_id, final_score)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE final_score = ?;
      `;

      // Insert or update the student's score
      await conn.query(scoreQueryStr, [score_id, test_id, student_id, totalScore, totalScore]);

      // Commit the transaction if everything goes well
      await conn.commit();
      return { message: 'Responses inserted and score updated successfully' };

    } catch (err) {
      console.error('Error during transaction:', err);
      await conn.rollback();  // Rollback transaction in case of error
      throw new Error('Error during transaction. Changes have been rolled back');
    } finally {
      conn.release();  // Release the connection back to the pool
    }
  }

  static async getResponsesByTestId(table_name, test_id) {
    const conn = await connection.getConnection();
    try {
      const queryStr = `SELECT * FROM ${table_name}student_response2 WHERE test_id = ?`;
      const [rows] = await conn.query(queryStr, [test_id]);
      return rows;
    } catch (err) {
      throw new Error(`Error getting responses by test ID: ${err.message}`);
    } finally {
      conn.release();
    }
  }

  static async updateResponse(table_name, response_id, updatedFields) {
    const conn = await connection.getConnection();
    const updates = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(', ');
    const queryStr = `UPDATE ${table_name}student_response2 SET ${updates} WHERE response_id = ?`;

    try {
      await conn.query(queryStr, [...Object.values(updatedFields), response_id]);
      return { response_id, ...updatedFields };
    } catch (err) {
      throw new Error(`Error updating response: ${err.message}`);
    } finally {
      conn.release();
    }
  }

  static async deleteResponse(table_name, response_id) {
    const conn = await connection.getConnection();
    const queryStr = `DELETE FROM ${table_name}student_response2 WHERE response_id = ?`;

    try {
      await conn.query(queryStr, [response_id]);
      return { success: true };
    } catch (err) {
      throw new Error(`Error deleting response: ${err.message}`);
    } finally {
      conn.release();
    }
  }

  static getMarkingFunction(testType, questionType) {
    if (markingSchemes[testType] && markingSchemes[testType][questionType]) {
      return markingSchemes[testType][questionType];
    } else {
      throw new Error(`Marking scheme for ${testType} and ${questionType} not found`);
    }
  }
}

export default StudentResponseModel;
