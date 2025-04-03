import express from 'express';
import TestController from '../controllers/TestController.js';

const router = express.Router();

router.get('/tests', TestController.getAllTests);
router.get('/attempted', TestController.getAttemptedTests);
router.get('/enrolled', TestController.getEnrolledTests);

router.get('/tests/:entity_id', TestController.getTestsInEntity);
router.get('/:test_id', TestController.getTestById);
router.put('/tests/:test_id', TestController.updateTest);
router.delete('/tests/:test_id', TestController.deleteTest);
router.post('/:test_id/submit', TestController.submitTest);

router.post('/tests', TestController.createTest);

export default router;
