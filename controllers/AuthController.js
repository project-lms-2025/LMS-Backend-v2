import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";
import UserSession from "../models/UserSession.js";
import OtpService from "../services/OtpService.js";
import EmailService from "../services/EmailService.js";

class authController {
  static async register(req, res) {
    const { name, email, phoneNumber } = req.body;
    try {
      const existingUser = await UserModel.getUserByEmail(email);
      if (existingUser.success) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }
  
      const existingPhoneUser = await UserModel.getUserPhoneNumber(phoneNumber);
      if (existingPhoneUser.success) {
        return res.status(400).json({ success: false, message: "User with this phone number already exists" });
      }

      const response = await UserModel.createUser(req.body);
  
      if (response.success) {
        return res.status(201).json({ success: true, message: response.message, data: response.data });
      } else {
        return res.status(400).json({ success: false, message: response.message });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message || "An error occurred while registering the user" });
    }
  }

  static async createUserWithRole(req, res) {
    const { role } = req.body;
    const validRoles = ['sub-admin', 'owner', 'teacher'];

    try {
      if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }

      const existingUser = await UserModel.getUserByEmail(req.body.email);
      if (existingUser.success) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }

      const response = await UserModel.createUser(req.body);
  
      if (response.success) {
        return res.status(201).json({ success: true, message: response.message, data: response.data });
      } else {
        return res.status(400).json({ success: false, message: response.message });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message || "An error occurred while registering the user" });
    }
  }

  static async sendLoginOtp(req, res) {
    const { phoneNumber } = req.body;
    try {
      const userResponse = await UserModel.getUserPhoneNumber(phoneNumber);
      if (!userResponse.success) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const email = userResponse.data.email;
  
      const otp = OtpService.generateOtp();
      const otpExpiry = Date.now() + 5 * 60 * 1000;
  
      OtpService.saveOtp(email, otp, otpExpiry);
  
      // await EmailService.sendEmailService(email, "emailLogin", otp);
      console.log("Generated OTP:", otp);
  
      return res.status(200).json({ success: true, message: "OTP sent to your email", email: email });
    } catch (error) {
      console.error('Error sending OTP:', error);
      return res.status(500).json({ success: false, message: 'Something went wrong while sending OTP' });
    }
  }

  static async loginWithEmailOtp(req, res) {
    const { email, otp, deviceType } = req.body;
    try {
      const otpResponse = OtpService.getOtp(email);
      if (!otpResponse.success) {
        return res.status(400).json({ success: false, message: "OTP not found or expired" });
      }

      const otpData = otpResponse.otp;
      if (otpData.otpExpiry < Date.now()) {
        OtpService.deleteOtp(email);
        return res.status(400).json({ success: false, message: "OTP has expired" });
      }
      if (otpData.storedOtp !== otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }

      OtpService.deleteOtp(email);
  
      const userResponse = await UserModel.getUserByEmail(email);
      if (!userResponse.success) {
        return res.status(400).json({ success: false, message: "User not found" });
      }

      const sessionResult = await authController.createSessionService(userResponse.data.user_id, email, deviceType, userResponse.data.role);
  
      if (sessionResult.statusCode === 200) {
        return res.status(200).json({ success: true, message: "Login successful", authToken: sessionResult.token, role: userResponse.data.role });
      }
  
      return res.status(sessionResult.statusCode).json({ success: false, message: sessionResult.message });
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

  static async createSessionService(user_id, email, deviceType, role) {
    try {
      const token = jwt.sign({ user_id, email, deviceType, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
  
      await UserSession.createOrUpdateSession(email, deviceType, token);
  
      return { success: true, statusCode: 200, message: "Session created successfully", token: token };
    } catch (error) {
      console.error("Error during session creation:", error);
      return { success: false, statusCode: 500, message: "Something went wrong while creating session" };
    }
  }
}

export default authController;
