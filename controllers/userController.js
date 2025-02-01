const { updateUserService, deleteUserService } = require('../services/userService');
const { protect } = require('../middleware/authMiddleware');

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
    await deleteUserService(req.user.id);
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { updateUser, deleteUser };