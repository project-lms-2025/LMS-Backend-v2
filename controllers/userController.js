const { updateUserService, deleteUserService } = require('../services/userService');
const { protect } = require('../middleware/authMiddleware');
const {getUserDataByEmail} = require('../models/userModel')

const updateUser = async (req, res) => {
  try {
    const updatedUser = await updateUserService(req.user.id, req.body);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.user.email);
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getUserDetails = async (req, res) => {
  const { email } = req.params;

  try {
    const { authData, userData, userDocs } = await getUserDataByEmail(email);
    const userDetails = {
      email,
      authData,
      userData,
      userDocs,
    };
    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
};

module.exports = { updateUser, deleteUser, getUserDetails };