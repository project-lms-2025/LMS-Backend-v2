import connection from "../../config/database.js"; 

class TestModel {
  static async createTSTest({test_id, teacher_id, course_id, series_id, title, description, schedule_date, schedule_time, duration, total_marks }) {
    const queryStr = `
      INSERT INTO ts_tests (test_id, teacher_id, ts_== "" ? "course_id": "series_id"}, title, description, schedule_date, schedule_time, duration, total_marks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      await connection.query(queryStr, [test_id, teacher_idts_== "" ? course_id: series_id, title, description, schedule_date, schedule_time, duration, total_marks]);
      return { test_id, teacher_id, course_id, series_id, title, description, schedule_date, schedule_time, duration, total_marks };
    } catch (err) {
      console.error(err)
      throw new Error(`Error creating test`);
    }
  }

  static async getTSTestById(test_id, role) {
    const queryStr = `
      SELECT ts_tests.*, 
       ts_questions.*, 
       ts_options.*, 
       ts_questions.image_url AS question_image_url, 
       ts_options.image_url AS option_image_url
      FROM ts_tests
      LEFT JOIN ts_questions ON ts_tests.test_id = ts_questions.test_id
      LEFT JOIN ts_options ON ts_questions.question_id = ts_options.question_id
      WHERE ts_tests.test_id = ?;
    `;
    try {
      const [rows] = await connection.query(queryStr, [test_id]);
      const testData = {
        test_id: rows[0]?.test_id,
        teacher_id: rows[0]?.teacher_id,
        series_id: rows[0]?.series_id,
        title: rows[0]?.title,
        description: rows[0]?.description,
        schedule_date: rows[0]?.schedule_date,
        schedule_time: rows[0]?.schedule_time,
        duration: rows[0]?.duration,
        total_marks: rows[0]?.total_marks,
        created_at: rows[0]?.created_at,
        questions: []
      };

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
            options: []
          };
          testData.questions.push(question);
        }

        if (row.option_id && question) {
          question.options.push({
            option_id: row.option_id,
            option_text: row.option_text,
            image_url: row.option_image_url,
            ...(role !== 'student' ? { is_correct: row.is_correct } : {})
          });
        }        
      });
      return testData.questions.length > 0 ? testData : null;
    } catch (err) {
      throw new Error(`Error getting test by ID`);
    }
  }

  static async getAttemptedTests(studentId) {
    const queryStr = `
      SELECT 
          DISTINCT
          sr.test_id,
          t.schedule_date,
          t.schedule_time,
          t.title,
          t.description
      FROM 
          ts_student_response2 sr
      JOIN 
          ts_tests t ON sr.test_id = t.test_id
      WHERE 
          sr.student_id = ?
      `;
      try {
        const [rows] = await connection.query(queryStr, [studentId]);
        return rows;
      } catch (err) {
        throw new Error(`Error getting all ts_tests`);
      }
  }

  static async getAllTSTests() {
    const queryStr = `
      SELECT ts_tests.*, test_series.title
      FROM ts_tests
      JOIN test_series ON ts_tests.series_id = test_series.series_id;
    `;
    try {
      const [rows] = await connection.query(queryStr);
      return rows;
    } catch (err) {
      console.error(err);
      throw new Error(`Error getting all ts_tests`);
    }
  }

  static async updateTSTest(test_id, updatedFields) {
    const updates = Object.entries(updatedFields).map(([key, value]) => `{key} = ?`).join(', ');
    const queryStr = `UPDATE ts_tests SET {updates} WHERE test_id = ?`;
    try {
      await connection.query(queryStr, [...Object.values(updatedFields), test_id]);
      return { test_id, ...updatedFields };
    } catch (err) {
      throw new Error(`Error updating test`);
    }
  }

  static async deleteTDTest(test_id) {
    const queryStr = `DELETE FROM ts_tests WHERE test_id = ?`;
    try {
      await connection.query(queryStr, [test_id]);
      return { success: true };
    } catch (err) {
      throw new Error(`Error deleting test`);
    }
  }
}

export default TestModel;