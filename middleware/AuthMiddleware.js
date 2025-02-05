const jwt = require("jsonwebtoken");
const UserSession = require("../models/UserSession");

class AuthMiddleware {
  static async auth(req, res, next) {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      if (!token) token = req.cookies.token;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const session = await UserSession.getSessionByUserAndDevice(
        decoded.userId,
        decoded.deviceType
      );
      if (!session || session.token !== token) {
        throw new Error("Invalid or expired session");
      }

      req.userId = decoded.userId;
      req.deviceType = decoded.deviceType;
      next();
    } catch (error) {
      res.status(401).send({ error: "Please authenticate." });
    }
  }
}

module.exports = AuthMiddleware;
