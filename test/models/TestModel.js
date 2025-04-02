import connection from "../../config/database.js";

class TestModel {
  static async createTest({ test_id, teacher_id, course_id, series_id, title, description, schedule_start, schedule_end, duration, total_marks, test_type }) {
    const queryStr = `
      INSERT INTO tests (test_id, teacher_id, course_id, series_id, title, description, schedule_start, schedule_end, duration, total_marks, test_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await connection.query(queryStr, [
        test_id, teacher_id, course_id || null, series_id || null, title, description, schedule_start, schedule_end, duration, total_marks, test_type
      ]);
      return { test_id, teacher_id, course_id, series_id, title, description, schedule_start, schedule_end, duration, total_marks, test_type };
    } catch (err) {
      console.error(err);
      throw new Error("Error creating test");
    }
  }

  static async getTestById(test_id, role) {
    const queryStr = `
      SELECT 
        t.*, 
        q.*, 
        o.*, 
        q.image_url AS question_image_url, 
        o.image_url AS option_image_url
      FROM tests t
      LEFT JOIN questions q ON t.test_id = q.test_id
      LEFT JOIN options o ON q.question_id = o.question_id
      WHERE t.test_id = ?;
    `;
    
    try {
      const [rows] = await connection.query(queryStr, [test_id]);
      if (rows.length === 0) return null;

      const testData = {
        test_id: rows[0]?.test_id,
        teacher_id: rows[0]?.teacher_id,
        course_id: rows[0]?.course_id,
        series_id: rows[0]?.series_id,
        test_type: rows[0]?.test_type,
        title: rows[0]?.title,
        description: rows[0]?.description,
        schedule_start: rows[0]?.schedule_start,
        schedule_end: rows[0]?.schedule_end,
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

      return testData;
    } catch (err) {
      console.error(err);
      throw new Error("Error fetching test by ID");
    }
  }

  static async getAttemptedTests(studentId) {
    const queryStr = `
      SELECT DISTINCT
        sr.test_id,
        t.schedule_start,
        t.schedule_end,
        t.title,
        t.description,
        t.test_type
      FROM student_responses sr
      JOIN tests t ON sr.test_id = t.test_id
      WHERE sr.student_id = ?;
    `;

    try {
      const [rows] = await connection.query(queryStr, [studentId]);
      return rows;
    } catch (err) {
      console.error(err);
      throw new Error("Error fetching attempted tests");
    }
  }

  static async getAllTests({ test_type, user_data }) {
    let queryStr = `
      SELECT t.*, 
             c.course_name, 
             s.title AS series_title
      FROM tests t
      LEFT JOIN courses c ON t.course_id = c.course_id
      LEFT JOIN test_series s ON t.series_id = s.series_id
    `;
  
    let conditions = [];
    let values = [];
  
    if (test_type) {
      conditions.push('t.test_type = ?');
      values.push(test_type);
    }
  
    if (user_data.role === 'teacher') {
      conditions.push('t.teacher_id = ?');
      values.push(user_data.user_id);
    }
  
    if (conditions.length > 0) {
      queryStr += ' WHERE ' + conditions.join(' AND ');
    }
  
    try {
      const [rows] = await connection.query(queryStr, values);
      return rows;
    } catch (err) {
      console.error(err);
      throw new Error("Error fetching all tests");
    }
  }
  
  static async getTestsInEntity({ series_id, course_id }) {
    let queryStr = `
      SELECT t.*, 
             c.course_name, 
             s.title AS series_title
      FROM tests t
      LEFT JOIN courses c ON t.course_id = c.course_id
      LEFT JOIN test_series s ON t.series_id = s.series_id
    `;
  
    let conditions = [];
    let values = [];
  
    if (series_id) {
      conditions.push('t.series_id = ?');
      values.push(series_id);
    }
    if (course_id) {
      conditions.push('t.course_id = ?');
      values.push(course_id);
    }
  
    if (!series_id && !course_id) {
      throw new Error("You must provide either series_id or course_id.");
    }
  
    if (conditions.length > 0) {
      queryStr += ' WHERE ' + conditions.join(' AND ');
    }
  
    try {
      const [rows] = await connection.query(queryStr, values);
      return rows;
    } catch (err) {
      console.error(err);
      throw new Error("Error fetching tests.");
    }
  }

  static async updateTest(test_id, updatedFields) {
    const updates = Object.entries(updatedFields).map(([key, value]) => `${key} = ?`).join(", ");
    const queryStr = `UPDATE tests SET ${updates} WHERE test_id = ?`;

    try {
      await connection.query(queryStr, [...Object.values(updatedFields), test_id]);
      return { test_id, ...updatedFields };
    } catch (err) {
      console.error(err);
      throw new Error("Error updating test");
    }
  }

  static async deleteTest(test_id) {
    const queryStr = `DELETE FROM tests WHERE test_id = ?`;

    try {
      await connection.query(queryStr, [test_id]);
      return { success: true };
    } catch (err) {
      console.error(err);
      throw new Error("Error deleting test");
    }
  }

  static async getEnrolledTests(user_id) {
    const query = `
      SELECT DISTINCT t.*
      FROM tests t
      LEFT JOIN courses c ON t.course_id = c.course_id
      LEFT JOIN test_series s ON t.series_id = s.series_id
      WHERE (c.batch_id IN (
          SELECT b.batch_id
          FROM enrollments be
          JOIN batches b ON be.entity_id = b.batch_id
          WHERE be.user_id = ?
      ) OR s.series_id IS NOT NULL);
    `;

    try {
      const [result] = await connection.query(query, [user_id]);
      return result;
    } catch (error) {
      console.error("Error fetching enrolled tests:", error);
      throw new Error("Error fetching enrolled tests");
    }
  }
}

export default TestModel;
