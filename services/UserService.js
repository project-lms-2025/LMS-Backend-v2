import UserModel from "../models/UserModel.js";

class UserService {
  static async updateUserService(userId, updateData) {
    try {
      const updatedUser = await UserModel.updateUser(userId, updateData);
      if (updatedUser.success) {
        return { success: true, statusCode: 200, message: "User updated successfully", data: updatedUser.data };
      } else {
        return { success: false, statusCode: 400, message: "Error updating user" };
      }
    } catch (error) {
      return { success: false, statusCode: 500, message: error.message || "An error occurred while updating user" };
    }
  }
  
  static async deleteUserService(userId) {
    try {
      await UserModel.deleteUser(userId);
      return { success: true, statusCode: 200, message: "User deleted successfully" };
    } catch (error) {
      return { success: false, statusCode: 500, message: error.message || "An error occurred while deleting the user" };
    }
  }
  

  static async getUserData(user_id) {
    try {
      const user = await UserModel.getUserData(user_id);
  
      if (!user) {
        return { success: false, statusCode: 404, message: "User not found" };
      }
  
      const authData = user.authData;
  
      return { success: true, statusCode: 200, message: "User data retrieved successfully", data: {user_id, ...authData} };
    } catch (error) {
      console.error("Error fetching user data in service:", error);
      return { success: false, statusCode: 500, message: "Error fetching user data" };
    }
  }
  
}

export default UserService;
