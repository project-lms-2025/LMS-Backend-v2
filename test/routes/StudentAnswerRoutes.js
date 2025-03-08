import express from 'express';
import TestController from '../controllers/TestController.js';

const router = express.Router();

router.post('/tests/:test_id/submit', TestController.submitTest);

export default router;
