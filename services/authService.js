const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');
const { uploadFile } = require('../config/s3');
const { updatePassword } = require('../models/userModel');


const registerUserService = async (userData, files) => {
  const { name, email, password } = userData;

  const existingUser = await getUserByEmail(email);
  if (existingUser.success) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const profilePic = await uploadFile(files.profilePicture[0]);
  const pdf = await uploadFile(files.pdf[0]);
  console.log(profilePic,pdf)

  const user = await createUser({ name, email, password: hashedPassword, profile_picture:profilePic.Location, pdf:pdf.Location });


  return user;
};

const loginUserService = async (email, password) => {
  const response = await getUserByEmail(email);
  if (!response.success) throw new Error(response.message || response.error);

  const user = response.data

  const isMatch = await bcrypt.compare(password, user.password.S);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ email: user.email.S }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  return token;
};


const resetPasswordService = async (resetToken, newPassword) => {
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const email = decoded.email
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await updatePassword(email, hashedPassword);

    if (result.success) {
      return { success: true, message: 'Password reset successfully' };
    } else {
      return { success: false, message: 'Error resetting password' };
    }
  } catch (err) {
    console.error('Error resetting password:', err);
    return { success: false, message: 'Error resetting password' };
  }
};


const getResetTokenService = async (email) => {
  const response = await getUserByEmail(email);
  if (!response.success) throw new Error(response.message || response.error);

  const user = response.data

  const resetToken = jwt.sign({ email: user.email.S }, process.env.JWT_SECRET, { expiresIn: '10m' });
  return resetToken;
};

module.exports = { registerUserService, loginUserService, getResetTokenService, resetPasswordService };