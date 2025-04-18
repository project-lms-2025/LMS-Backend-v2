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
    } else if (type === "emailLogin") {
      subject = "Email Login OTP";
      htmlContent = `
        <h3>Email Login</h3>
        <p>Your OTP Login to ${process.env.APP_NAME}: <strong>${linkOrOtp}</strong></p>
        <p>If you did not request this, please ignore this email.</p>

        <p>If you need any assistance, feel free to reach out to our support team.</p>

        <p>Best regards,<br />The ${process.env.APP_NAME} Team</p>
      `;
    } else if (type === "enrollmentSuccess") {
      subject = "Enrollment Successfull";
      htmlContent = `
        <h3>Welcome to ${process.env.APP_NAME}!</h3>
        <p>Dear user,</p>
        <p>We're excited to have you on board! You've successfully enrolled.</p>
        
        <p>You can access your resources using the ${linkOrOtp}. log in and start your learning journey.</p>
        
        <p>If you did not request this enrollment, please ignore this email.</p>
        
        <p>If you need any assistance, feel free to reach out to our support team.</p>
        
        <p>Best regards,<br />The ${process.env.APP_NAME} Team</p>
      `;
    }
     else {
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
      return { success: true, statusCode: 200, message: "Email sent successfully" };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, statusCode: 500, message: "Error sending email" };
    }
  }  
}

export default EmailService;
