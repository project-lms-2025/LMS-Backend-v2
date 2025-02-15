import express from 'express';
import ResultController from '../controllers/ResultController.js';

const router = express.Router();

router.get('/tests/:test_id/results', ResultController.getResultsForTest);
router.post('/tests/:test_id/results', ResultController.createResult);
router.put('/results/:result_id', ResultController.updateResult);

export default router;
