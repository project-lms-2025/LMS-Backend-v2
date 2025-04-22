import pool from "../../config/databasePool.js";
import { generateUniqueId } from "../../utils/idGenerator.js";
import markingSchemes from "../../utils/markingSchemes.js";

class StudentResponseModel {
  static async submitResponse({ test_id, student_id, responses }) {
    let totalScore = 0;

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      const [testInfo] = await conn.query(
        `
        SELECT selected_exam FROM test WHERE test_id = ?
      `,
        [test_id]
      );

      if (testInfo.length === 0) {
        throw new Error("Test not found");
      }

      const selected_exam = testInfo[0].selected_exam;

      for (const response of responses) {
        const { question_id, options_chosen, response_text, response_time } =
          response;

        const selected_option_ids = options_chosen.sort().join("_");
        const response_id = generateUniqueId();
        const queryStr = `
          INSERT INTO student_responses (response_id, student_id, question_id, selected_option_ids, given_answer, test_id, response_time)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await conn.query(queryStr, [
          response_id,
          student_id,
          question_id,
          selected_option_ids || null,
          response_text || null,
          test_id,
          response_time,
        ]);

        const [question] = await conn.query(
          `
          SELECT q.question_type, 
                q.question_text, 
                q.correct_option_id, 
                q.positive_marks, 
                q.negative_marks, 
                o.option_text
          FROM questions q
          LEFT JOIN options o ON q.question_id = o.question_id
          WHERE q.question_id = ?;
        `,
          [question_id]
        );

        const {
          question_type,
          option_text,
          correct_option_id,
          positive_marks,
          negative_marks,
        } = question[0];

        const markingFunction = this.getMarkingFunction(
          selected_exam,
          question_type
        );

        if (markingFunction) {
          totalScore += markingFunction({
            selected_option_ids,
            correct_option_id,
            response_text,
            option_text,
            positive_marks,
            negative_marks,
          });
        }
      }

      const score_id = generateUniqueId();
      const scoreQueryStr = `
        INSERT INTO student_scores (score_id, student_id, test_id, raw_score)
        VALUES (?, ?, ?, ?);
      `;

      await conn.query(scoreQueryStr, [
        score_id,
        student_id,
        test_id,
        totalScore,
      ]);

      await conn.commit();
      return { message: "Responses inserted and score updated successfully" };
    } catch (err) {
      console.error("Error during transaction:", err);
      await conn.rollback();
      throw new Error(
        "Error during transaction. Changes have been rolled back"
      );
    } finally {
      conn.release();
    }
  }

  static async getResponsesByTestId(test_id) {
    const conn = await pool.getConnection();
    try {
      const queryStr = `SELECT * FROM student_responses WHERE test_id = ?`;
      const [rows] = await conn.query(queryStr, [test_id]);
      return rows;
    } catch (err) {
      throw new Error(`Error getting responses by test ID: ${err.message}`);
    } finally {
      conn.release();
    }
  }

  static async updateResponse(response_id, updatedFields) {
    const conn = await pool.getConnection();
    const updates = Object.entries(updatedFields)
      .map(([key, value]) => `${key} = ?`)
      .join(", ");
    const queryStr = `UPDATE student_responses SET ${updates} WHERE response_id = ?`;

    try {
      await conn.query(queryStr, [
        ...Object.values(updatedFields),
        response_id,
      ]);
      return { response_id, ...updatedFields };
    } catch (err) {
      throw new Error(`Error updating response: ${err.message}`);
    } finally {
      conn.release();
    }
  }

  static async deleteResponse(response_id) {
    const conn = await pool.getConnection();
    const queryStr = `DELETE FROM student_responses WHERE response_id = ?`;

    try {
      await conn.query(queryStr, [response_id]);
      return { success: true };
    } catch (err) {
      throw new Error(`Error deleting response: ${err.message}`);
    } finally {
      conn.release();
    }
  }

  static getMarkingFunction(selected_exam, questionType) {
    if (
      markingSchemes[selected_exam] &&
      markingSchemes[selected_exam][questionType]
    ) {
      return markingSchemes[selected_exam][questionType];
    } else {
      throw new Error(
        `Marking scheme for ${selected_exam} and ${questionType} not found`
      );
    }
  }
}

export default StudentResponseModel;
