import UserService from "../services/UserService.js";

class UserController {
  static async updateUser(req, res) {
    try {
      const response = await UserService.updateUserService(req.user.id, req.body);
  
      if (response.success) {
        return res.status(response.statusCode).json({ success: true, statusCode: response.statusCode, message: response.message, data: response.data });
      } else {
        return res.status(response.statusCode).json({ success: false, statusCode: response.statusCode, message: response.message });
      }
    } catch (err) {
      res.status(500).json({ success: false, statusCode: 500, message: "Internal server error" });
    }
  }
  
  static async deleteUser(req, res) {
    try {
      const response = await UserService.deleteUserService(req.user.email);
  
      if (response.success) {
        res.clearCookie("token");
        return res.status(response.statusCode).json({ success: true, statusCode: response.statusCode, message: response.message });
      } else {
        return res.status(response.statusCode).json({ success: false, statusCode: response.statusCode, message: response.message });
      }
    } catch (err) {
      res.status(500).json({ success: false, statusCode: 500, message: "Internal server error" });
    }
  }  

  static async getUserDetails(req, res) {
    try {
      const response = await UserService.getUserDataByEmail(req.email);
  
      if (response.success) {
        return res.status(response.statusCode).json({ success: true, statusCode: response.statusCode, message: response.message, data: response.data });
      } else {
        return res.status(response.statusCode).json({ success: false, statusCode: response.statusCode, message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ success: false, statusCode: 500, message: "Error fetching user details" });
    }
  }
  
}

export default UserController;
