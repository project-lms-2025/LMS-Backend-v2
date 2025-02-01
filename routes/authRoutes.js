const express = require("express");
const multer = require("multer");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

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
  register
);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
