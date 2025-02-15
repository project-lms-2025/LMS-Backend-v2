import express from 'express';
import StudentAnswerController from '../controllers/StudentAnswerController.js';

const router = express.Router();

router.post('/tests/:test_id/submit', StudentAnswerController.submitAnswers);

export default router;
