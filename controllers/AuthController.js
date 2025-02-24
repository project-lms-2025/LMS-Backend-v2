import AuthService from "../services/AuthService.js"
import EmailService from "../services/EmailService.js";
import UserSession from "../models/UserSession.js";

class authController {
  static async register(req, res) {
    try {
      const response = await AuthService.registerUserService(req.body);
  
      if (response.success) {
        if (response.headers) { Object.entries(response.headers).forEach(([key, value]) => { res.setHeader(key, value); }); }
        return res.status(response.statusCode).json({ success: true, message: response.message, data: response.data });
      } else {
        if (response.headers) { Object.entries(response.headers).forEach(([key, value]) => { res.setHeader(key, value); }); }
        return res.status(response.statusCode).json({ success: false, message: response.message });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message || "An error occurred while registering the user" });
    }
  }

  static async createUserWithRole(req, res){
    const role = req.body.role;
    try { 
      const validRoles = ['sub-admin', 'owner', 'teacher'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }
      const response = await AuthService.registerUserWithRole(req.body);
  
      if (response.success) {
        return res.status(response.statusCode).json({ success: true, message: response.message, data: response.data });
      } else {
        return res.status(response.statusCode).json({ success: false, message: response.message });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message || "An error occurred while registering the user" });
    }
  }
  
  static async sendLoginOtp(req, res) {
    const { phoneNumber } = req.body;
    try {
      const result = await AuthService.generateEmailOtpService(phoneNumber);
      return res.status(result.statusCode).json({ success: result.success, message: result.message, email: result.email });
    } catch (error) {
      console.error('Error sending OTP:', error);
      return res.status(500).json({ success: false, message: 'Something went wrong while sending OTP' });
    }
  }
  
  static async loginWithEmailOtp(req, res) {
    const { email, otp, deviceType } = req.body;
    try {
      const result = await AuthService.loginWitEmailService(email, deviceType, otp);
      // if(result.success)res.cookie("token", result.authToken, { httpOnly: true });
      return res.status(result.statusCode).json({ success: result.success, message: result.message, authToken: result.authToken, role: result.role });
    } catch (error) {
      console.error('Error during login with OTP:', error);
      return res.status(500).json({ success: false, message: 'Something went wrong while logging in' });
    }
  }
  
  static async logout(req, res) {
    const { email, deviceType } = req.body;
    try {
      await UserSession.deleteSession(email, deviceType);
      res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Logout failed" });
    }
  }  
}

export default authController;
