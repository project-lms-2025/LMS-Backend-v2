import express from "express";
import multer from "multer";
import AuthController from "../controllers/AuthController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import RoleMiddleware from "../middleware/RoleMiddleware.js";

const upload = multer();
const router = express.Router();

router.post("/register", AuthController.register);

router.post("/create-user",
  AuthMiddleware.auth,
  await RoleMiddleware.checkRole(["admin", "sub-admin", "owner"]),
  RoleMiddleware.checkRoleHierarchy,
  AuthController.createUserWithRole);
router.post("/login", AuthController.loginWithEmailOtp);
router.post("/send-login-otp", AuthController.sendLoginOtp);
router.post("/logout", AuthController.logout);

export default router
