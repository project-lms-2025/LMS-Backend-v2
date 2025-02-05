import UserModel from "../models/UserModel.js";

class UserService {
  static async updateUserService(userId, updateData) {
    const updatedUser = await UserModel.updateUser(userId, updateData);
    return updatedUser;
  }

  static async deleteUserService(userId) {
    await UserModel.deleteUser(userId);
    return { message: "User deleted successfully" };
  }

  static async getUserDataByEmail(email) {
    try {
      const user = await UserModel.getUserDataByEmail(email);

      if (!user) {
        throw new Error("User not found");
      }

      const authData = user.authData;
      const userData = user.userData;
      const userDocs = user.userDocs;

      return { email, authData, userData, userDocs };
    } catch (error) {
      console.error("Error fetching user data in service:", error);
      throw error;
    }
  }
}

export default UserService;
