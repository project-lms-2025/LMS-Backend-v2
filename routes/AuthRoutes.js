import express from "express";
import multer from "multer";
import AuthController from "../controllers/AuthController.js";

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
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

export default router
