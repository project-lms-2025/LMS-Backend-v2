import jwt, { decode } from "jsonwebtoken";
import UserSession from "../models/UserSession.js";

class AuthMiddleware {
  static async auth(req, res, next) {
    try {
      var token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token)token = req.cookie?.token;
      // console.log("token", token)
      if(!token)console.log(req.header("Authorization"))
      if(!token)return res.status(401).json({success: false, message:"Unauthorised here"})
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const session = await UserSession.getSessionByUserAndDevice(
        decoded.email,
        decoded.deviceType
      );

      if (!session.data || session.data.token !== token) {
        return res.status(401).json({success: false, message: "Unauthorised access"});
      }
      req.user_id = decoded.user_id;
      req.email = decoded.email;
      req.deviceType = decoded.deviceType;
      req.role = decoded.role;
      next();
    } catch (error) {
      console.error(error)
      next()
    }
  }
}

export default AuthMiddleware;
