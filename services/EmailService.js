import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class EmailService {
  static async sendEmailService(email, type, linkOrOtp) {
    let subject, htmlContent;

    if (type === "passwordReset") {
      subject = "Password Reset Request";
      htmlContent = `
      <h3>Password Reset Request</h3>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${linkOrOtp}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;
    } else if (type === "emailVerification") {
      subject = "Email Verification OTP";
      htmlContent = `
      <h3>Email Verification</h3>
      <p>Your OTP for email verification is: <strong>${linkOrOtp}</strong></p>
      <p>If you did not request this, please ignore this email.</p>
    `;
    } else {
      throw new Error("Invalid email type");
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: htmlContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Error sending email");
    }
  }
}

export default EmailService;