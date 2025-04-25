import express from "express";
import ResultController from "../controllers/ResultController.js";

const router = express.Router();

router.get("/tests/:test_id/leaderboard", ResultController.getAllResults);
router.get("/results/:test_id/:student_id", ResultController.getDetailedResult);

export default router;
