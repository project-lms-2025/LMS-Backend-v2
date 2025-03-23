import connection from "../../config/database.js"; 

class TSTestModel {
  static async createTSTest({ test_id, teacher_id, series_id, title, description, schedule_date, schedule_time, duration, total_marks }) {
    const queryStr = `
      INSERT INTO ts_test (test_id, teacher_id, series_id, title, description, schedule_date, schedule_time, duration, total_marks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      await connection.query(queryStr, [test_id, teacher_id, series_id, title, description, schedule_date, schedule_time, duration, total_marks]);
      return { test_id, teacher_id, series_id, title, description, schedule_date, schedule_time, duration, total_marks };
    } catch (err) {
      console.error(err)
      throw new Error("Error creating test series test");
    }
  }

  static async getTSTestById(test_id, role) {
    const queryStr = `
      SELECT ts_test.*, 
       questions.*, 
       options.*, 
       questions.image_url AS question_image_url, 
       options.image_url AS option_image_url
      FROM ts_test
      LEFT JOIN questions ON ts_test.test_id = questions.test_id
      LEFT JOIN options ON questions.question_id = options.question_id
      WHERE ts_test.test_id = ?;
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
      throw new Error("Error getting test series test by ID");
    }
  }

  static async getAllTSTests() {
    const queryStr = `
      SELECT ts_test.*, test_series.title as series_title
      FROM ts_test
      JOIN test_series ON ts_test.series_id = test_series.series_id;
    `;
    try {
      const [rows] = await connection.query(queryStr);
      return rows;
    } catch (err) {
      throw new Error("Error getting all test series tests");
    }
  }

  static async updateTSTest(test_id, updatedFields) {
    const updates = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(', ');
    const queryStr = `UPDATE ts_test SET ${updates} WHERE test_id = ?`;
    try {
      await connection.query(queryStr, [...Object.values(updatedFields), test_id]);
      return { test_id, ...updatedFields };
    } catch (err) {
      throw new Error("Error updating test series test");
    }
  }

  static async deleteTSTest(test_id) {
    const queryStr = "DELETE FROM ts_test WHERE test_id = ?";
    try {
      await connection.query(queryStr, [test_id]);
      return { success: true };
    } catch (err) {
      throw new Error("Error deleting test series test");
    }
  }
}

export default TSTestModel; 