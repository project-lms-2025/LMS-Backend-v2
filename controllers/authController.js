const {
  registerUserService,
  loginUserService,
  getResetTokenService,
  resetPasswordService,
} = require("../services/authService");
const { sendResetPasswordEmailService } = require("../services/emailService");

const register = async (req, res) => {
  try {
    const user = await registerUserService(req.body, req.files);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const token = await loginUserService(req.body.email, req.body.password);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const resetToken = await getResetTokenService(req.body.email);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendResetPasswordEmailService(email, resetLink);

    res.status(200).json({ success: true, resetToken });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing reset token or new password",
        });
    }

    const result = await resetPasswordService(resetToken, newPassword);

    if (result.success) {
      res.status(200).json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
