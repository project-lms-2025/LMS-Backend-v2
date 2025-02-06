import UserService from "../services/UserService.js";

class UserController {
  static async updateUser(req, res) {
    try {
      const updatedUser = await UserService.updateUserService(req.user.id, req.body);
      res.status(200).json({ success: true, data: updatedUser });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserService.deleteUserService(req.user.email);
      res.clearCookie("token");
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getUserDetails(req, res) {
    try {
      const userDetails = await UserService.getUserDataByEmail(req.email);
      return res.status(200).json(userDetails);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error fetching user details" });
    }
  }
}

export default UserController;
