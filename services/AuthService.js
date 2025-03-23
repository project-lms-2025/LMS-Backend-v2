import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import UserSession from "../models/UserSession.js";
import EmailService from "./EmailService.js";
import OtpService from "./OtpService.js";

class AuthService {
  static async registerUserService(userData) {
    const {
      name,
      email,
      phoneNumber,
    } = userData;
    try {
      const existingUser = await UserModel.getUserByEmail(email);
      if (existingUser.success) {
        return { success: false, statusCode: 400, message: "User already exists" };
      }
      const resp = await UserModel.createUser({
        name,
        email,
        phoneNumber,
        role:"student",
      });

  
      return { success: true, statusCode: 201, message: "User registered successfully" };
    } catch (error) {
      return { success: false, statusCode: 500, message: error.message || "An error occurred while registering the user" };
    }
  }

  static async registerUserWithRole(user){
    try{
      const existingUser = await UserModel.getUserByEmail(user.email);
      if(existingUser.success){
        return {success: false, statusCode:400, message: "User already registered."}
      }
      await UserModel.createUser(user);
      return { success: true, statusCode: 201, message: "User registered successfully" };
    } catch (error) {
      return { success: false, statusCode: 500, message: error.message || "An error occurred while registering the user" };
    }
  }

  static async loginUserService(email, deviceType, password) {
    try {
      const response = await UserModel.getUserByEmail(email);
      if (!response.success) {
        return { success: false, statusCode: 400, message: response.message || response.error };
      }
  
      const user = response.data;
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, statusCode: 401, message: "Invalid credentials" };
      }
  
      const session = await this.createSessionService(email, deviceType);
      return { success: true, statusCode: 200, message: "Login successful", token: session.token };
    } catch (error) {
      return { success: false, statusCode: 500, message: error.message || "An error occurred during login" };
    }
  }

  static async generateEmailOtpService(phoneNumber) {
    try {
      const user = await UserModel.getUserPhoneNumber(phoneNumber)
      if (!user.success) {
        return { success: false, statusCode: 404, message: "User not found" };
      }
      const email = user.email;
  
      const otp = OtpService.generateOtp();
      const otpExpiry = Date.now() + 5 * 60 * 1000;
  
      OtpService.saveOtp(email, otp, otpExpiry);
  
      await EmailService.sendEmailService(email, "emailLogin", otp);
  
      return { success: true, statusCode: 200, message: "OTP sent to your email", email: email };
    } catch (error) {
      console.error("Error generating OTP for email:", error);
      return { success: false, statusCode: 500, message: "Something went wrong while generating OTP" };
    }
  }

  static async loginWitEmailService(email, deviceType, otp) {
    try {
      const response = OtpService.getOtp(email);
      const user = await UserModel.getUserByEmail(email);
      if (!response.success) {
        return { success: false, statusCode: 400, message: "OTP not found or expired" };
      }
      const otpData = response.otp;
      if (otpData.otpExpiry < Date.now()) {
        OtpService.deleteOtp(email);
        return { success: false, statusCode: 400, message: "OTP has expired" };
      }
      if (otpData.storedOtp !== otp) {
        return { success: false, statusCode: 400, message: "Invalid OTP" };
      }
  
      OtpService.deleteOtp(email);
  
      const sessionResult = await this.createSessionService(user.data.user_id, email, deviceType, user.data.role);
  
      if (sessionResult.statusCode === 200) {
        return { success: true, statusCode: 200, message: "Login successful", authToken: sessionResult.token, role: user.data.role };
      }
  
      return { success: false, statusCode: sessionResult.status, message: sessionResult.message };
    } catch (error) {
      console.error("Error during OTP validation:", error);
      return { success: false, statusCode: 500, message: "Something went wrong" };
    }
  }

  static async createSessionService(user_id, email, deviceType, role) {
    try {
      const token = jwt.sign({user_id, email, deviceType, role}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      await UserSession.createOrUpdateSession(email, deviceType, token);
      return { success: true, statusCode: 200, message: "Session created successfully", token: token };
    } catch (error) {
      console.error("Error during session creation:", error);
      return { success: false, statusCode: 500, message: "Something went wrong while creating session" };
    }
  }

  static async resetPasswordService(resetToken, newPassword) {
    try {
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
      const email = decoded.email;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      const result = await UserModel.updatePassword(email, hashedPassword);
  
      if (result.success) {
        return { success: true, statusCode: 200, message: "Password reset successfully" };
      } else {
        return { success: false, statusCode: 400, message: "Error resetting password" };
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      return { success: false, statusCode: 500, message: "Error resetting password" };
    }
  }

  static async getResetTokenService(email) {
    try {
      const response = await UserModel.getUserByEmail(email);
      if (!response.success) {
        return { success: false, statusCode: 400, message: response.message || response.error };
      }
  
      const user = response.data;
  
      const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "10m",
      });
  
      return { success: true, statusCode: 200, message: "Reset token generated", resetToken };
    } catch (error) {
      console.error("Error generating reset token:", error);
      return { success: false, statusCode: 500, message: "Error generating reset token" };
    }
  }

}

export default AuthService;
