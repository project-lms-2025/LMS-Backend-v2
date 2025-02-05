import EmailService from "../services/EmailService.js";
import OtpService from "../services/OtpService.js";

class EmailController {
  static async sendEmailOtp(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const otp = OtpService.generateOtp();
      const otpExpiry = Date.now() + 15 * 60 * 1000;

      OtpService.saveOtp(email, otp, otpExpiry);

      const emailSent = await EmailService.sendEmailService(email, "emailVerification", otp);

      if (emailSent) {
        return res.status(200).json({ message: "OTP sent to your email" });
      } else {
        return res.status(500).json({ error: "Failed to send OTP" });
      }
    } catch (error) {
      console.error("Error sending emaiOtpServicel:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async verifyEmailOtp(req, res) {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    try {
      const storedOtpData = OtpService.getOtp(email);

      if (!storedOtpData) {
        return res.status(400).json({ error: "OTP not found or expired" });
      }

      const { storedOtp, otpExpiry } = storedOtpData;

      if (Date.now() > otpExpiry) {
        return res.status(400).json({ error: "OTP has expired" });
      }

      if (otp !== storedOtp) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      OtpService.deleteOtp(email);

      return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default EmailController;
