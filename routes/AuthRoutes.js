import express from "express";
import multer from "multer";
import AuthController from "../controllers/AuthController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import RoleMiddleware from "../middleware/RoleMiddleware.js";

const upload = multer();
const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "pdf10th", maxCount: 1 },
    { name: "pdf12th", maxCount: 1 },
    { name: "pdfHigherDegrees", maxCount: 4 },
    { name: "pdfPreviousYear", maxCount: 1 },
  ]),
  AuthController.register
);

router.post("/create-user",
  AuthMiddleware.auth,
  await RoleMiddleware.checkRole(["admin", "sub-admin", "owner"]),
  RoleMiddleware.checkRoleHierarchy,
  AuthController.createUserWithRole);
router.post("/login", AuthController.login);
router.post("/login-with-otp", AuthController.loginWithEmailOtp);
router.post("/send-login-otp", AuthController.sendLoginOtp);
router.post("/logout", AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

export default router
