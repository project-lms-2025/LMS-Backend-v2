import AuthService from "../services/AuthService.js"
import EmailService from "../services/EmailService.js";
import UserSession from "../models/UserSession.js";

class authController {
  static async register(req, res) {
    try {
      const response = await AuthService.registerUserService(req.body, req.files);
  
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
  
  static async login(req, res) {
    try {
      const response = await AuthService.loginUserService(req.body.email, req.body.deviceType, req.body.password);
      if (response.success) {
        res.cookie("token", response.token, { httpOnly: true });
        return res.status(response.statusCode).json({ success: true, token: response.token });
      } else {
        return res.status(response.statusCode).json({ success: false, message: response.message });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message || "An error occurred during login" });
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
      return res.status(result.statusCode).json({ success: result.success, message: result.message, authToken: result.authToken });
    } catch (error) {
      console.error('Error during login with OTP:', error);
      return res.status(500).json({ success: false, message: 'Something went wrong while logging in' });
    }
  }
  
  static async logout(req, res) {
    const { userId, deviceType } = req;
    try {
      await UserSession.deleteSession(userId, deviceType);
      res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Logout failed" });
    }
  }


  static async forgotPassword(req, res) {
    try {
      const email = req.body.email;
      const resetToken = await AuthService.getResetTokenService(email);
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      await EmailService.sendEmailService(email, "passwordReset", resetLink);
      res.status(200).json({ success: true, resetToken });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { resetToken, newPassword } = req.body;
  
      if (!resetToken || !newPassword) {
        return res.status(400).json({ success: false, message: "Missing reset token or new password" });
      }
  
      const result = await AuthService.resetPasswordService(resetToken, newPassword);
  
      if (result.success) {
        res.status(200).json({ success: true, message: result.message });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }  
}

export default authController;
