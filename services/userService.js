const { updateUser, deleteUser } = require('../models/userModel');

const updateUserService = async (userId, updateData) => {
  const updatedUser = await updateUser(userId, updateData);
  return updatedUser;
};

const deleteUserService = async (userId) => {
  await deleteUser(userId);
  return { message: 'User deleted successfully' };
};

module.exports = { updateUserService, deleteUserService };