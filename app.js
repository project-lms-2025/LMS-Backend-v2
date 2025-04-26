import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import YAML from "yamljs";

// Load environment variables
dotenv.config();

// Route Imports
import authRoutes from "./routes/AuthRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import otpRoutes from "./routes/OtpRoutes.js";
import batchRoutes from "./main/routes/BatchRoutes.js";
import courseRoutes from "./main/routes/CourseRoutes.js";
import classRoutes from "./routes/ClassRoutes.js";
import testRoutes from "./test/testRouter.js";
import testSeriesRoutes from "./main/routes/testSeriesRoutes.js";
import enrollmentRoutes from "./routes/EnrollmentRoutes.js";
import paymentRoutes from "./razorpay/routes.js";
import zoomRoute from "./routes/zoomRoute.js";

// Middleware Imports
import AuthMiddleware from "./middleware/AuthMiddleware.js";
import errorHandler from "./middleware/ErrorMiddleware.js";

// Initialize Express App
const app = express();

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      "https://lmssystem01.vercel.app/",
      "https://www.teachertech.in",
    ],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(cookieParser());

// Swagger API Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", AuthMiddleware.auth, userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/batch", batchRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/class", classRoutes);
app.use("/api/test", testRoutes);
app.use("/api/test-series", testSeriesRoutes);
app.use("/api/enrollment", AuthMiddleware.auth, enrollmentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/zoom", zoomRoute);

// 404 Route not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found - Invalid API endpoint",
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
