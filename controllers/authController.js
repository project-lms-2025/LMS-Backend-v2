const { registerUser, loginUser, getResetToken } = require('../services/authService');

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body, req.files);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const resetToken = await getResetToken(req.body.email);

    // handle the logic for sending reset password email here

    res.status(200).json({ success: true, resetToken });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: 'Missing reset token or new password' });
    }

    const result = await resetPassword(resetToken, newPassword);
    
    if (result.success) {
      res.status(200).json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


module.exports = { register, login, forgotPassword, resetPassword };