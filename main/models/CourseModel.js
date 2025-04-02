import pool from "../../config/databasePool.js";

class CourseModel {
  static async queryDatabase(query, params) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [results] = await connection.query(query, params);
      return results;
    } catch (err) {
      console.error(err.message, { stack: err.stack });
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }

  static async createCourse(course) {
    const { course_id, teacher_id, course_name, allow_notes_download, batch_id } = course;
    const query = 'INSERT INTO courses (course_id, teacher_id, course_name, allow_notes_download, batch_id) VALUES (?, ?, ?, ?, ?)';
    try {
      await this.queryDatabase(query, [course_id, teacher_id, course_name, allow_notes_download, batch_id]);
      return { success: true, message: 'Course created successfully', data: course };
    } catch (err) {
      return { success: false, message: err.message || 'Error creating course' };
    }
  }

  static async getCourseById(course_id) {
    const query = 'SELECT * FROM courses WHERE course_id = ?';
    try {
      const results = await this.queryDatabase(query, [course_id]);
      return results.length ? { success: true, data: results[0] } : { success: false, message: 'Course not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching course' };
    }
  }

  static async getAllCourses(user_data) {
    let queryStr = ` 
      SELECT * 
      FROM courses 
    `; 
    
    let conditions = [];
    let values = [];
  
    if (user_data.role === 'teacher') {
      conditions.push('teacher_id = ?');
      values.push(user_data.user_id);
    }
  
    if (conditions.length > 0) {
      queryStr += ' WHERE ' + conditions.join(' AND ');
    }
  
    try {
      const results = await this.queryDatabase(queryStr, values);
      return { success: true, data: results };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching courses' };
    }
  }

  static async getCoursesByBatchId(batch_id) {
    const query = 'SELECT * FROM courses WHERE batch_id = ?';
    try {
      const results = await this.queryDatabase(query, [batch_id]);
      return results.length ? { success: true, data: results } : { success: false, message: 'No courses found for the batch' };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching courses for batch' };
    }
  }

  static async updateCourse(course_id, updatedCourseData) {
    const updateFields = Object.keys(updatedCourseData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updatedCourseData), course_id];
    const query = `UPDATE courses SET ${updateFields} WHERE course_id = ?`;
    try {
      const results = await this.queryDatabase(query, values);
      return results.affectedRows ? { success: true, message: 'Course updated successfully', updatedCourseData } : { success: false, message: 'Course not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error updating course' };
    }
  }

  static async deleteCourse(course_id) {
    const query = 'DELETE FROM courses WHERE course_id = ?';
    try {
      const results = await this.queryDatabase(query, [course_id]);
      return results.affectedRows ? { success: true, message: 'Course deleted successfully' } : { success: false, message: 'Course not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error deleting course' };
    }
  }

  static async getCoursesByBatchIds(batch_ids) {
    const query = 'SELECT DISTINCT * FROM courses WHERE batch_id IN (?)';
    try {
      const result = await this.queryDatabase(query, [batch_ids]);
      return result; // Return the list of courses that match the batch IDs
    } catch (error) {
      console.error('Error fetching courses by batch IDs:', error);
      throw new Error('Error fetching courses');
    }
  }
}

export default CourseModel;
