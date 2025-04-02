import databasePool from "../../config/databasePool.js";

class ResultModel {
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

  // Method to fetch detailed result for a specific student and test
  static async getDetailedResult(test_id, student_id) {
    const queryStr = `
      SELECT 
          tests.*, 
          questions.*, 
          options.*, 
          questions.image_url AS question_image_url, 
          options.image_url AS option_image_url,
          student_responses.selected_option_ids, 
          student_responses.given_answer AS given_ans_text,
          student_scores.raw_score AS final_score
      FROM tests
      LEFT JOIN questions ON tests.test_id = questions.test_id
      LEFT JOIN options ON questions.question_id = options.question_id
      LEFT JOIN student_responses ON student_responses.question_id = questions.question_id AND student_responses.test_id = tests.test_id
      LEFT JOIN student_scores ON student_scores.student_id = student_responses.student_id AND student_scores.test_id = tests.test_id
      WHERE tests.test_id = ? AND student_responses.student_id = ?
      GROUP BY 
          tests.test_id, 
          questions.question_id, 
          options.option_id, 
          student_responses.student_id;
    `;

    try {
      const rows = await ResultModel.queryDatabase(queryStr, [test_id, student_id]);

      const testData = {
        test_id: rows[0]?.test_id,
        teacher_id: rows[0]?.teacher_id,
        course_id: rows[0]?.course_id,
        title: rows[0]?.title,
        description: rows[0]?.description,
        schedule_start: rows[0]?.schedule_start,
        schedule_end: rows[0]?.schedule_end,
        duration: rows[0]?.duration,
        total_marks: rows[0]?.total_marks,
        created_at: rows[0]?.created_at,
        score: rows[0]?.final_score,
        questions: []
      };

      const msqResponses = {};

      rows.forEach(row => {
        let question = testData.questions.find(q => q.question_id === row.question_id);
        if (!question && row.question_id) {
          question = {
            question_id: row.question_id,
            question_text: row.question_text,
            image_url: row.question_image_url,
            question_type: row.question_type,
            section: row.section,
            positive_marks: row.positive_marks,
            negative_marks: row.negative_marks,
            options: [],
            given_ans_text: null
          };

          if (row.question_type === 'NAT') {
            question.given_ans_text = row.given_ans_text;
          } else if (row.question_type === 'MCQ' || row.question_type === 'MSQ') {
            if (row.selected_option_ids) {
              if (row.question_type === 'MSQ') {
                msqResponses[row.question_id] = row.selected_option_ids.split('_');
              }
            }
          }

          testData.questions.push(question);
        }

        if (row.option_id && question) {
          const option = {
            option_id: row.option_id,
            option_text: row.option_text,
            image_url: row.option_image_url,
            is_correct: row.is_correct
          };
          if (question.question_type === 'MCQ' && row.selected_option_ids === row.option_id) {
            option.selected = true;
          } else if (question.question_type === 'MSQ' && msqResponses[question.question_id]?.includes(row.option_id)) {
            option.selected = true;
          }

          question.options.push(option);
        }
      });

      return testData.questions.length > 0 ? testData : null;
    } catch (err) {
      console.error("Error fetching detailed result:", err);
      throw new Error("Error getting detailed result");
    }
  }

  // Method to fetch all results for a specific test
  static async getAllResults(test_id) {
    const queryStr = `
      SELECT 
        ss.score_id AS score_id, 
        ss.test_id AS test_id, 
        ss.student_id AS student_id, 
        ss.raw_score AS final_score,  
        u.name AS student_name
      FROM student_scores ss
      JOIN users u ON ss.student_id = u.user_id
      WHERE ss.test_id = ?
      ORDER BY ss.raw_score DESC;  
    `;
    
    try {
      return await ResultModel.queryDatabase(queryStr, [test_id]);
    } catch (err) {
      console.error("Error fetching scores:", err);
      throw new Error("Error fetching scores: " + err.message);
    }
  }
}

export default ResultModel;
