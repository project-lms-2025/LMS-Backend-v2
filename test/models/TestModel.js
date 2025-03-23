import connection from "../../config/database.js"; 

class TestModel {
  static async createTest({table_name, test_id, teacher_id, course_id, series_id, title, description, schedule_date, schedule_time, duration, total_marks }) {
    const queryStr = `
      INSERT INTO ${table_name}tests (test_id, teacher_id, ${table_name == "" ? "course_id": "series_id"}, title, description, schedule_date, schedule_time, duration, total_marks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      await connection.query(queryStr, [test_id, teacher_id,table_name == "" ? course_id: series_id, title, description, schedule_date, schedule_time, duration, total_marks]);
      return { test_id, teacher_id, course_id, series_id, title, description, schedule_date, schedule_time, duration, total_marks };
    } catch (err) {
      console.error(err)
      throw new Error(`Error creating test`);
    }
  }

  static async getTestById(table_name, test_id, role) {
    const queryStr = `
      SELECT ${table_name}tests.*, 
       ${table_name}questions.*, 
       ${table_name}options.*, 
       ${table_name}questions.image_url AS question_image_url, 
       ${table_name}options.image_url AS option_image_url
      FROM ${table_name}tests
      LEFT JOIN ${table_name}questions ON ${table_name}tests.test_id = ${table_name}questions.test_id
      LEFT JOIN ${table_name}options ON ${table_name}questions.question_id = ${table_name}options.question_id
      WHERE ${table_name}tests.test_id = ?;
    `;

    try {
      const [rows] = await connection.query(queryStr, [test_id]);
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

  static async getAttemptedTests(table_name, studentId) {
    const queryStr = `
      SELECT 
          DISTINCT
          sr.test_id,
          t.schedule_date,
          t.schedule_time,
          t.title,
          t.description
      FROM 
          ${table_name}student_response2 sr
      JOIN 
          ${table_name}tests t ON sr.test_id = t.test_id
      WHERE 
          sr.student_id = ?
      `;
      try {
        const [rows] = await connection.query(queryStr, [studentId]);
        return rows;
      } catch (err) {
        throw new Error(`Error getting all ${table_name}tests`);
      }
  }

  static async getAllTests(table_name) {
    const queryStr = `
      SELECT ${table_name}tests.*, courses.course_name
      FROM ${table_name}tests
      JOIN courses ON ${table_name}tests.course_id = courses.course_id;
    `;
    try {
      const [rows] = await connection.query(queryStr);
      return rows;
    } catch (err) {
      throw new Error(`Error getting all ${table_name}tests`);
    }
  }

  static async updateTest(table_name, test_id, updatedFields) {
    const updates = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(', ');
    const queryStr = `UPDATE ${table_name}tests SET ${updates} WHERE test_id = ?`;
    try {
      await connection.query(queryStr, [...Object.values(updatedFields), test_id]);
      return { test_id, ...updatedFields };
    } catch (err) {
      throw new Error(`Error updating test`);
    }
  }

  static async deleteTest(table_name, test_id) {
    const queryStr = `DELETE FROM ${table_name}tests WHERE test_id = ?`;
    try {
      await connection.query(queryStr, [test_id]);
      return { success: true };
    } catch (err) {
      throw new Error(`Error deleting test`);
    }
  }
}

export default TestModel;