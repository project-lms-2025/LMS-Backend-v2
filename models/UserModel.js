import { generateUniqueId } from "../utils/idGenerator.js";
import connection from "../config/database.js";

class UserModel {
  static async createUser({ name, email, phoneNumber, role }) {
    const user_id = generateUniqueId();
    const query = 'INSERT INTO users (user_id, name, email, phoneNumber, role) VALUES (?, ?, ?, ?, ?)';
    try {
      await connection.query(query, [user_id, name, email, phoneNumber, role]);
      return { success: true, message: "User created successfully", data: user_id };
    } catch (err) {
      return { success: false, message: err.message || 'Error creating user' };
    }
  }

  static async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    try {
      const [results] = await connection.query(query, [email]);
      return results.length ? { success: true, data: results[0] } : { success: false, message: "User not found" };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching user' };
    }
  }

  static async getUserPhoneNumber(phoneNumber) {
    const query = 'SELECT * FROM users WHERE phoneNumber = ?';
    try {
      const [results] = await connection.query(query, [phoneNumber]);
      return results.length ? { success: true, ...results[0] } : { success: false, message: "User not found" };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching user' };
    }
  }

  static async updateUser(userId, updatedFields) {
    const updateFields = Object.keys(updatedFields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updatedFields), userId];
    const query = `UPDATE users SET ${updateFields} WHERE user_id = ?`;
    try {
      const [results] = await connection.query(query, values);
      return results.affectedRows ? { success: true, message: 'User updated successfully' } : { success: false, message: 'User not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error updating user' };
    }
  }

  static async deleteUser(userId) {
    const query = 'DELETE FROM users WHERE user_id = ?';
    try {
      const [results] = await connection.query(query, [userId]);
      return results.affectedRows ? { success: true, message: "User deleted successfully" } : { success: false, message: 'User not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error deleting user' };
    }
  }

  static async updatePassword(email, newPassword) {
    const query = 'UPDATE users SET password = ? WHERE email = ?';
    try {
      const [results] = await connection.query(query, [newPassword, email]);
      return results.affectedRows ? { success: true, message: "Password updated successfully" } : { success: false, message: 'User not found' };
    } catch (err) {
      return { success: false, message: err.message || 'Error updating password' };
    }
  }

  static async getUserData(user_id) {
    const query = 'SELECT * FROM users WHERE user_id = ?';
    try {
      const [results] = await connection.query(query, [user_id]);
      return results.length ? { authData: results[0] } : { success: false, message: "User not found" };
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching user details' };
    }
  }
}

export default UserModel;
