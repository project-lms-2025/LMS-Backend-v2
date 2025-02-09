import UserModel from "../models/UserModel.js";

const roleHierarchy = {
    "owner": 4,
    "admin": 3,
    "sub-admin": 2,
    "teacher": 1,
    "user": 0,
  };
  
  class RoleMiddleware {
    static async checkRole(roles) {
      return async (req, res, next) => {
        try {
          const user = await UserModel.getUserByEmail(req.email);
  
          if (!user.success) {
            return res.status(404).json({ success: false, message: "User not found" });
          }
  
          if (!roles.includes(user.data.role)) {
            return res.status(403).json({ success: false, message: "Access denied. You don't have permission to access this resource" });
          }
  
          next();
        } catch (error) {
          console.error("Error checking role:", error);
          return res.status(500).json({ success: false, message: "Internal server error" });
        }
      };
    }
  
    static async checkRoleHierarchy(req, res, next) {
      try {
        const creator = await UserModel.getUserByEmail(req.email);
  
        if (!creator.success) {
          return res.status(404).json({ success: false, message: "Creator not found" });
        }
  
        const { role: creatorRole } = creator.data;
  
        const { role: newUserRole } = req.body;
  
        if (roleHierarchy[creatorRole] <= roleHierarchy[newUserRole]) {
          return res.status(403).json({
            success: false,
            message: `You do not have permission to create a user with the ${newUserRole} role`,
          });
        }
  
        next();
      } catch (error) {
        console.error("Error checking role hierarchy:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  }
  
  export default RoleMiddleware;
  