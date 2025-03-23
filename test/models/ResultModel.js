import connection from "../../config/database.js"; 

class ResultModel {
  static async getDetailedResult(table_name, test_id, student_id) {
    const queryStr = `
      SELECT 
          ${table_name}tests.*, 
          ${table_name}questions.*, 
          ${table_name}options.*, 
          ${table_name}questions.image_url AS question_image_url, 
          ${table_name}options.image_url AS option_image_url,
          ${table_name}student_response2.selected_option_id, 
          ${table_name}student_response2.given_ans_text,
          ${table_name}student_scores.final_score
      FROM ${table_name}tests
      LEFT JOIN ${table_name}questions ON ${table_name}tests.test_id = ${table_name}questions.test_id
      LEFT JOIN ${table_name}options ON ${table_name}questions.question_id = ${table_name}options.question_id
      LEFT JOIN ${table_name}student_response2 ON ${table_name}student_response2.question_id = ${table_name}questions.question_id AND ${table_name}student_response2.test_id = ${table_name}tests.test_id
      LEFT JOIN ${table_name}student_scores ON ${table_name}student_scores.student_id = ${table_name}student_response2.student_id AND ${table_name}student_scores.test_id = ${table_name}tests.test_id
      WHERE ${table_name}tests.test_id = ? AND ${table_name}student_response2.student_id = ?
      GROUP BY 
          ${table_name}tests.test_id, 
          ${table_name}questions.question_id, 
          ${table_name}options.option_id, 
          ${table_name}student_response2.student_id;

    `;
  
    try {
      const [rows] = await connection.query(queryStr, [test_id, student_id]);
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
  
          if (row.question_type === 'NAT') {
            question.given_ans_text = row.given_ans_text;
          } else if (row.question_type === 'MCQ' || row.question_type === 'MSQ') {
            if (row.selected_option_id) {
              if (row.question_type === 'MSQ') {
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
          if (question.question_type === 'MCQ' && row.selected_option_id === row.option_id) {
            option.selected = true;
          } else if (question.question_type === 'MSQ' && msqResponses[question.question_id]?.includes(row.option_id)) {
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

  static async getAllResults(table_name, test_id) {
    const queryStr = `
      SELECT 
        ss.score_id AS score_id, 
        ss.test_id AS test_id, 
        ss.student_id AS student_id, 
        ss.final_score AS final_score, 
        u.name AS student_name
      FROM ${table_name}student_scores ss
      JOIN users u ON ss.student_id = u.user_id
      WHERE ss.test_id = ?
      ORDER BY ss.final_score DESC;
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
