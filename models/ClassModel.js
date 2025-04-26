import pool from "../config/databasePool.js";

class ClassModel {
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

  static async createClass(cls) {
    const {
      class_id,
      course_id,
      teacher_id,
      class_title,
      class_date_time,
      recording_url,
      zoom_meeting_url,
      session_passcode,
    } = cls;
    const query =
      "INSERT INTO classes (class_id, course_id, teacher_id, class_title, class_date_time, recording_url, zoom_meeting_url, session_passcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    try {
      await this.queryDatabase(query, [
        class_id,
        course_id,
        teacher_id,
        class_title,
        class_date_time,
        recording_url,
        zoom_meeting_url,
        session_passcode,
      ]);
      return {
        success: true,
        message: "Class created successfully",
        data: cls,
      };
    } catch (err) {
      return { success: false, message: err.message || "Error creating class" };
    }
  }

  static async getClassById(class_id) {
    console.log("Fetching class with ID:", class_id);
    const query = "SELECT * FROM classes WHERE class_id = ?";
    try {
      const results = await this.queryDatabase(query, [class_id]);
      return results.length
        ? { success: true, data: results[0] }
        : { success: false, message: "Class not found" };
    } catch (err) {
      return { success: false, message: err.message || "Error fetching class" };
    }
  }

  static async getClassesByCourseId(course_id) {
    const query = "SELECT * FROM classes WHERE course_id = ?";
    try {
      const results = await this.queryDatabase(query, [course_id]);
      return { success: true, data: results };
    } catch (err) {
      return {
        success: false,
        message: err.message || "Error fetching classes by course",
      };
    }
  }

  static async getAllClasses() {
    const query = "SELECT * FROM classes";
    try {
      const results = await this.queryDatabase(query);
      return { success: true, data: results };
    } catch (err) {
      return {
        success: false,
        message: err.message || "Error fetching all classes",
      };
    }
  }

  static async updateClass(class_id, updatedClassData) {
    const updateFields = Object.keys(updatedClassData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updatedClassData), class_id];
    const query = `UPDATE classes SET ${updateFields} WHERE class_id = ?`;
    try {
      const results = await this.queryDatabase(query, values);
      return results.affectedRows
        ? {
            success: true,
            message: "Class updated successfully",
            updatedClassData,
          }
        : { success: false, message: "Class not found" };
    } catch (err) {
      return { success: false, message: err.message || "Error updating class" };
    }
  }

  static async deleteClass(class_id) {
    const query = "DELETE FROM classes WHERE class_id = ?";
    console.log(query);
    try {
      const results = await this.queryDatabase(query, [class_id]);
      return results.affectedRows
        ? { success: true, message: "Class deleted successfully" }
        : { success: false, message: "Class not found" };
    } catch (err) {
      return { success: false, message: err.message || "Error deleting class" };
    }
  }
}

export default ClassModel;
