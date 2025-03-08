import express from 'express';
import ResultController from '../controllers/ResultController.js';

const router = express.Router();

router.get('/tests/:test_id/leaderboard', ResultController.getAllResults);
router.post('/tests/:test_id/generateResult', ResultController.generateResult);
router.get('/results/:test_id/:student_id', ResultController.getDetailedResult);

export default router;