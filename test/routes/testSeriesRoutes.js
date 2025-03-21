import express from 'express';
import TestSeriesController from '../controllers/TestSeriesController.js';

const router = express.Router();

// Test Series Routes
router.post('/', TestSeriesController.createTestSeries);
router.get('/', TestSeriesController.getAllTestSeries);
router.get('/:series_id', TestSeriesController.getTestSeriesById);
router.put('/:series_id', TestSeriesController.updateTestSeries);
router.delete('/:series_id', TestSeriesController.deleteTestSeries);

// Tests within a Series Routes
router.get('/:series_id/tests', TestSeriesController.getTestsInSeries);
router.get('/:series_id/tests/:test_id', TestSeriesController.getTestInSeries);

export default router; 