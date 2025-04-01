import express from "express";
import EnrollmentController from "./controllers/EnrollmentController.js";
import generateUploadUrl from "../utils/generateUploadUrl.js"

const router = express.Router();

router.post("/joinCourse", EnrollmentController.joinCourse);
router.post("/joinBatch", EnrollmentController.joinBatch);
router.get("/generatePresignedUrl", generateUploadUrl);

export default router;
