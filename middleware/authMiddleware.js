const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };