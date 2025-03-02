import express from 'express';
import ResultController from '../controllers/ResultController.js';

const router = express.Router();

router.post('/tests/:test_id/submit', ResultController.generateAndSaveResult);

export default router;
