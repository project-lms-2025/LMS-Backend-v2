import express from 'express';
import TestController from '../controllers/TestController.js';

const router = express.Router();

router.get('/tests', TestController.getAllTests);
router.get('/tests/:test_id', TestController.getTestById);
router.post('/tests', TestController.createTest);
router.put('/tests/:test_id', TestController.updateTest);
router.delete('/tests/:test_id', TestController.deleteTest);
router.post('/:test_id/submit', TestController.submitTest);
router.get('/attempted', TestController.getAttemptedTests);
router.get('/enrolled', TestController.getEnrolledTests);

export default router;
