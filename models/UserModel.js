import { generateUniqueId } from "../utils/idGenerator.js";
import pool from "../config/databasePool.js";

class UserModel {
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

  static async createUser({
    name,
    email,
    phoneNumber,
    role = "student",
    address,
    state,
    city,
    pincode,
    class: userClass,
    dob,
    selected_exam,
    tenth_marksheet_url,
    twelfth_marksheet_url,
    graduation_url,
    prev_year_grade_card_url
  }) {
    const user_id = generateUniqueId();
    const userQuery = 'INSERT INTO users (user_id, name, email, phoneNumber, role) VALUES (?, ?, ?, ?, ?)';
    const userDetailsQuery = `
      INSERT INTO user_details (
        user_id, address, state, city, pincode, class, dob, selected_exam,
        tenth_marksheet_url, twelfth_marksheet_url, graduation_url, prev_year_grade_card_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      await this.queryDatabase(userQuery, [user_id, name, email, phoneNumber, role]);
      await this.queryDatabase(userDetailsQuery, [
        user_id,
        address,
        state,
        city,
        pincode,
        userClass || null,
        dob,
        selected_exam,
        tenth_marksheet_url || null,
        twelfth_marksheet_url || null,
        graduation_url || null,
        prev_year_grade_card_url || null
      ]);

      await connection.commit();
      return { success: true, message: "User and user details created successfully", data: user_id };
    } catch (err) {
      if (connection) await connection.rollback();
      console.error(err.message);
      return { success: false, message: err.message || 'Error creating user and user details' };
    } finally {
      if (connection) connection.release();
    }
  }

  static async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    try {
      const results = await this.queryDatabase(query, [email]);
      return results.length ? { success: true, data: results[0] } : { success: false, message: "User not found" };
    } catch (err) {
      console.error(err.message);
      return { success: false, message: err.message || 'Error fetching user' };
    }
  }

  static async getUserById(user_id) {
    const query = 'SELECT * FROM users WHERE user_id = ?';
    try {
      const results = await this.queryDatabase(query, [user_id]);
      return results.length ? { success: true, data: results[0] } : { success: false, message: "User not found" };
    } catch (err) {
      console.error(err.message);
      return { success: false, message: err.message || 'Error fetching user' };
    }
  }

  static async getUserPhoneNumber(phoneNumber) {
    const query = 'SELECT * FROM users WHERE phoneNumber = ?';
    try {
      const results = await this.queryDatabase(query, [phoneNumber]);
      return results.length ? { success: true, data: results[0] } : { success: false, message: "User not found" };
    } catch (err) {
      console.error(err.message);
      return { success: false, message: err.message || 'Error fetching user' };
    }
  }

  static async updateUser(userId, updatedFields) {
    const updateFields = Object.keys(updatedFields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updatedFields), userId];
    const query = `UPDATE users SET ${updateFields} WHERE user_id = ?`;
    try {
      const results = await this.queryDatabase(query, values);
      return results.affectedRows ? { success: true, message: 'User updated successfully' } : { success: false, message: 'User not found' };
    } catch (err) {
      console.error(err.message);
      return { success: false, message: err.message || 'Error updating user' };
    }
  }

  static async deleteUser(userId) {
    const query = 'DELETE FROM users WHERE user_id = ?';
    try {
      const results = await this.queryDatabase(query, [userId]);
      return results.affectedRows ? { success: true, message: "User deleted successfully" } : { success: false, message: 'User not found' };
    } catch (err) {
      console.error(err.message);
      return { success: false, message: err.message || 'Error deleting user' };
    }
  }

  static async updatePassword(email, newPassword) {
    const query = 'UPDATE users SET password = ? WHERE email = ?';
    try {
      const results = await this.queryDatabase(query, [newPassword, email]);
      return results.affectedRows ? { success: true, message: "Password updated successfully" } : { success: false, message: 'User not found' };
    } catch (err) {
      console.error(err.message);
      return { success: false, message: err.message || 'Error updating password' };
    }
  }

  static async getUserData(user_id) {
    const query = 'SELECT * FROM users WHERE user_id = ?';
    try {
      const results = await this.queryDatabase(query, [user_id]);
      return results.length ? { authData: results[0] } : { success: false, message: "User not found" };
    } catch (err) {
      console.error(err.message);
      return { success: false, message: err.message || 'Error fetching user details' };
    }
  }
}

export default UserModel;
