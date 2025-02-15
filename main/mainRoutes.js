import express from "express";
import EnrollmentController from "./controllers/EnrollmentController.js";

const router = express.Router();

router.post("/joinCourse", EnrollmentController.joinCourse);
router.post("/joinBatch", EnrollmentController.joinBatch);

export default router;
