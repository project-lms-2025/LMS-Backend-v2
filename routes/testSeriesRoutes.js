import express from 'express';
import TestSeriesController from '../test/controllers/TestSeriesController.js';

const router = express.Router();

// Test Series Management Routes
router.post('/', TestSeriesController.createTestSeries);
router.get('/', TestSeriesController.getAllTestSeries);
router.get('/:series_id', TestSeriesController.getTestSeriesById);
router.put('/:series_id', TestSeriesController.updateTestSeries);
router.delete('/:series_id', TestSeriesController.deleteTestSeries);

// Test Series Tests Management Routes
router.post('/:series_id/tests', TestSeriesController.createSeriesTest);
router.get('/:series_id/tests', TestSeriesController.getTestsInSeries);
router.get('/:series_id/tests/attempted', TestSeriesController.getAttemptedSeriesTests);
router.get('/:series_id/tests/:test_id', TestSeriesController.getTestInSeries);
router.put('/:series_id/tests/:test_id', TestSeriesController.updateSeriesTest);
router.delete('/:series_id/tests/:test_id', TestSeriesController.deleteSeriesTest);
router.post('/:series_id/tests/:test_id/submit', TestSeriesController.submitSeriesTest);

export default router; 