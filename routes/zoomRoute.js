import express from "express";
import {
  createMeeting,
  getMeetingDetails,
  generateSignature,
} from "../controllers/zoomController.js";

const router = express.Router();

router.post("/zoom/create-meeting", createMeeting);
router.get("/zoom/meeting/:meetingId", getMeetingDetails);
router.post("/zoom/generate-signature", generateSignature);

export default router;
