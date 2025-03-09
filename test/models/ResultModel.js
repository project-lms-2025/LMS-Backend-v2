import connection from "../../config/database.js"; 
import { generateUniqueId } from '../../utils/idGenerator.js'

class ResultModel {
  static async getDetailedResult(test_id, student_id) {
    const queryStr = `
      SELECT tests.*, 
             questions.*, 
             options.*, 
             questions.image_url AS question_image_url, 
             options.image_url AS option_image_url,
             student_response2.selected_option_id, 
             student_response2.given_ans_text,
             student_scores.final_score
      FROM tests
      LEFT JOIN questions ON tests.test_id = questions.test_id
      LEFT JOIN options ON questions.question_id = options.question_id
      LEFT JOIN student_response2 
        ON questions.question_id = student_response2.question_id 
        AND student_response2.test_id = tests.test_id 
        AND student_response2.student_id = ?
      LEFT JOIN student_scores 
        ON student_scores.test_id = tests.test_id 
        AND student_scores.student_id = ?
      WHERE tests.test_id = ?;
    `;
  
    try {
      const [rows] = await connection.query(queryStr, [student_id, student_id, test_id]);
      
      const testData = {
        test_id: rows[0]?.test_id,
        teacher_id: rows[0]?.teacher_id,
        course_id: rows[0]?.course_id,
        title: rows[0]?.title,
        description: rows[0]?.description,
        schedule_date: rows[0]?.schedule_date,
        schedule_time: rows[0]?.schedule_time,
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
  
          if (row.question_type === 'nat') {
            question.given_ans_text = row.given_ans_text;
          } else if (row.question_type === 'mcq' || row.question_type === 'msq') {
            if (row.selected_option_id) {
              if (row.question_type === 'msq') {
                msqResponses[row.question_id] = row.selected_option_id.split('_');
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
  
          if (question.question_type === 'mcq' && row.selected_option_id === row.option_id) {
            option.selected = true;
          } else if (question.question_type === 'msq' && msqResponses[question.question_id]?.includes(row.option_id)) {
            option.selected = true;
          }
  
          question.options.push(option);
        }
      });
  
      return testData.questions.length > 0 ? testData : null;
    } catch (err) {
      throw new Error("Error getting test by ID");
    }
}

  
  static async generateResult(test_id) {
    const score_id = generateUniqueId();

    const queryStr = `
      INSERT INTO student_scores (score_id, test_id, student_id, final_score)
      SELECT 
          UUID(),  
          tests.test_id,
          student_response2.student_id,
          SUM(
              CASE 
                  WHEN questions.question_type = 'mcq' AND options.is_correct = 1 AND student_response2.selected_option_id = options.option_id THEN questions.positive_marks
                  WHEN questions.question_type = 'mcq' AND options.is_correct = 0 AND student_response2.selected_option_id = options.option_id THEN questions.negative_marks
                  WHEN questions.question_type = 'msq' AND student_response2.selected_option_id IS NOT NULL THEN 
                      CASE 
                          WHEN options.is_correct = 1 AND FIND_IN_SET(options.option_id, student_response2.selected_option_id) > 0 THEN questions.positive_marks
                          WHEN options.is_correct = 0 AND FIND_IN_SET(options.option_id, student_response2.selected_option_id) > 0 THEN questions.negative_marks
                          ELSE 0
                      END
                  WHEN questions.question_type = 'nat' AND student_response2.given_ans_text = options.option_text AND options.is_correct = 1 THEN questions.positive_marks
                  WHEN questions.question_type = 'nat' AND student_response2.given_ans_text != options.option_text AND options.is_correct = 0 THEN questions.negative_marks
                  ELSE 0
              END
          ) AS total_score
      FROM tests
      LEFT JOIN questions ON tests.test_id = questions.test_id
      LEFT JOIN options ON questions.question_id = options.question_id
      LEFT JOIN student_response2 
          ON questions.question_id = student_response2.question_id 
          AND student_response2.test_id = tests.test_id
      WHERE tests.test_id = ?
      GROUP BY student_response2.student_id;
    `;

    try {
      await connection.query(queryStr, [score_id, test_id]);
      return res.json({ message: "Scores calculated and stored successfully", test_id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error calculating and storing scores for all students" });
    }
}

  static async getAllResults(test_id) {
    const queryStr = `
      SELECT score_id, test_id, student_id, final_score
      FROM student_scores
      WHERE test_id = ?
      ORDER BY final_score DESC;
    `;
    
    try {
      const [rows] = await connection.query(queryStr, [test_id]);
      return rows;
    } catch (err) {
      throw new Error("Error fetching scores: " + err.message);
    }
  }
}

export default ResultModel;
