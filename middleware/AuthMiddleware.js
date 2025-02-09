import jwt from "jsonwebtoken";
import UserSession from "../models/UserSession.js";

class AuthMiddleware {
  static async auth(req, res, next) {
    try {
      var token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token)token = req.cookie?.token;
      if(!token)return res.status(401).json({success: false, message:"Unauthorised"})
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const session = await UserSession.getSessionByUserAndDevice(
        decoded.email,
        decoded.deviceType
      );

      if (!session || session.token !== token) {
        return res.status(401).json({success: false, message: "Unauthorised"})
      }

      req.email = decoded.email;
      req.deviceType = decoded.deviceType;
      next();
    } catch (error) {
      console.error(error)
      next()
    }
  }
}

export default AuthMiddleware;
