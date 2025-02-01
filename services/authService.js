const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');
const { uploadFile } = require('../config/s3');

const registerUser = async (userData, files) => {
  const { name, email, password } = userData;

  const existingUser = await getUserByEmail(email);
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hashedPassword });

  const profilePic = await uploadFile(files.profilePicture[0]);
  const pdf = await uploadFile(files.pdf[0]);

  // Update user with file locations
  user.profile_picture = profilePic.Location;
  user.pdf = pdf.Location;

  return user;
};

const loginUser = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  return token;
};

const { updatePassword } = require('../models/userModel'); // Import the function

const resetPassword = async (resetToken, newPassword) => {
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await updatePassword(userId, hashedPassword);

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


const getResetToken = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) throw new Error('User not found');

  const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10m' });
  return resetToken;
};

module.exports = { registerUser, loginUser, getResetToken, resetPassword };