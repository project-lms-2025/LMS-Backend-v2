import express from "express";
import multer from "multer";
import AuthController from "../controllers/AuthController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import RoleMiddleware from "../middleware/RoleMiddleware.js";

const upload = multer();
const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "9876543210"
 *               address:
 *                 type: string
 *                 example: "123 Main Street"
 *               state:
 *                 type: string
 *                 example: "California"
 *               city:
 *                 type: string
 *                 example: "Los Angeles"
 *               pincode:
 *                 type: string
 *                 example: "90001"
 *               class:
 *                 type: string
 *                 example: "12th"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "2005-01-01"
 *               selected_exam:
 *                 type: string
 *                 example: "GATE"
 *               tenth_marksheet_url:
 *                 type: string
 *                 example: "https://example.com/10th_marksheet.pdf"
 *               twelfth_marksheet_url:
 *                 type: string
 *                 example: "https://example.com/12th_marksheet.pdf"
 *               graduation_url:
 *                 type: string
 *                 example: "https://example.com/graduation_certificate.pdf"
 *               prev_year_grade_card_url:
 *                 type: string
 *                 example: "https://example.com/prev_year_grade_card.pdf"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User already exists"
 */
router.post("/register", AuthController.register);

/**
 * @swagger
 * /auth/create-user:
 *   post:
 *     summary: Create a new user with a specific role
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "9876543210"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You do not have permission to perform this action"
 */
router.post(
  "/create-user",
  AuthMiddleware.auth,
  await RoleMiddleware.checkRole(["admin", "sub-admin", "owner"]),
  RoleMiddleware.checkRoleHierarchy,
  AuthController.createUserWithRole
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user using email and OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               deviceType:
 *                 type: string
 *                 example: "web"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 authToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP"
 */
router.post("/login", AuthController.loginWithEmailOtp);

/**
 * @swagger
 * /auth/send-login-otp:
 *   post:
 *     summary: Send a login OTP to the user's email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP sent to your email"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
router.post("/send-login-otp", AuthController.sendLoginOtp);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the currently logged-in user
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               deviceType:
 *                 type: string
 *                 example: "web"
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 */
router.post("/logout", AuthController.logout);

export default router;