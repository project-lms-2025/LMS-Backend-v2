import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel.js';
import { uploadFile } from '../config/s3.js';

class AuthService {
  static async registerUserService(userData, files) {
    console.log(userData);
    const {
      name,
      email,
      password,
      gender,
      phoneNumber,
      dob,
      is_email_verified,
      address,
      pincode,
      state,
      marks10,
      marks12,
      examRegisteredFor,
      higherDegreeScore,
      previousYearScore,
    } = userData;

    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser.success) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePic = await uploadFile(files.profilePicture[0]);
    const degree10 = files.pdf10th ? await uploadFile(files.pdf10th[0]) : null;
    const degree12 = files.pdf12th ? await uploadFile(files.pdf12th[0]) : null;
    const higherDegrees = files.pdfHigherDegrees
      ? await Promise.all(
          files.pdfHigherDegrees.map((file) => uploadFile(file))
        )
      : [];
    const previousYearScorecard = files.pdfPreviousYear
      ? await uploadFile(files.pdfPreviousYear[0])
      : null;

    const user = await UserModel.createUser({
      name,
      email,
      password: hashedPassword,
      gender: gender,
      phoneNumber: phoneNumber,
      dob: dob,
      is_email_verified: is_email_verified,
      profile_picture: profilePic.Location,
      pdf10th: degree10 ? degree10.Location : null,
      pdf12th: degree12 ? degree12.Location : null,
      exam_registered_for: examRegisteredFor,
      higher_degree_urls: higherDegrees.map((file) => file.Location),
      previous_year_scorecard_url: previousYearScorecard
        ? previousYearScorecard.Location
        : null,
      address,
      pincode,
      state,
      marks10,
      marks12,
      higher_degree_score: higherDegreeScore,
      previous_year_score: previousYearScore,
    });

    return user;
  }

  static async loginUserService(email, password) {
    const response = await UserModel.getUserByEmail(email);
    if (!response.success) throw new Error(response.message || response.error);

    const user = response.data;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
  }

  static async resetPasswordService(resetToken, newPassword) {
    try {
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
      const email = decoded.email;
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const result = await UserModel.updatePassword(email, hashedPassword);

      if (result.success) {
        return { success: true, message: "Password reset successfully" };
      } else {
        return { success: false, message: "Error resetting password" };
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      return { success: false, message: "Error resetting password" };
    }
  }

  static async getResetTokenService(email) {
    const response = await UserModel.getUserByEmail(email);
    if (!response.success) throw new Error(response.message || response.error);

    const user = response.data;

    const resetToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    return resetToken;
  }
}

export default AuthService;
