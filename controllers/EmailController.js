import EmailService from "../services/EmailService.js";
import OtpService from "../services/OtpService.js";
import UserModel from "../models/UserModel.js"

class EmailController {
  static async sendEmailOtp(req, res) {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
  
    try {
      const user = await UserModel.getUserByEmail(email);
      
      if(user.success)return res.status(400).json({success: false, message:"User already exists"});

      const otp = OtpService.generateOtp();
      const otpExpiry = Date.now() + 15 * 60 * 1000;
  
      OtpService.saveOtp(email, otp, otpExpiry);
  
      const emailResponse = await EmailService.sendEmailService(email, "emailVerification", otp);
  
      if (emailResponse.success) {
        return res.status(emailResponse.statusCode).json({ message: emailResponse.message });
      } else {
        return res.status(500).json({ error: "Failed to send OTP" });
      }
    } catch (error) {
      console.error("Error sending email OTP:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }  

  static async verifyEmailOtp(req, res) {
    const { email, otp } = req.body;
  
    if (!email || !otp) {
      return res.status(400).json({ success: false, statusCode: 400, message: "Email and OTP are required" });
    }
  
    try {
      const storedOtpResponse = OtpService.getOtp(email);
  
      if (!storedOtpResponse.success) {
        return res.status(storedOtpResponse.statusCode).json({ success: false, statusCode: storedOtpResponse.statusCode, message: storedOtpResponse.message });
      }
  
      const { storedOtp, otpExpiry } = storedOtpResponse.otp;
  
      if (Date.now() > otpExpiry) {
        return res.status(400).json({ success: false, statusCode: 400, message: "OTP has expired" });
      }
  
      if (otp !== storedOtp) {
        return res.status(400).json({ success: false, statusCode: 400, message: "Invalid OTP" });
      }
  
      const deleteOtpResponse = OtpService.deleteOtp(email);
  
      if (!deleteOtpResponse.success) {
        return res.status(deleteOtpResponse.statusCode).json({ success: false, statusCode: deleteOtpResponse.statusCode, message: deleteOtpResponse.message });
      }
  
      return res.status(200).json({ success: true, statusCode: 200, message: "Email verified successfully" });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({ success: false, statusCode: 500, message: "Internal server error" });
    }
  }  
}

export default EmailController;
