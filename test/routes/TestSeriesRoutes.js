import express from 'express';
import TestSeriesController from '../controllers/TestSeriesController.js';

const router = express.Router();

// Create a new test series
router.post('/test-series', TestSeriesController.createTestSeries);

// Get all test series
router.get('/test-series', TestSeriesController.getAllTestSeries);

// Get a test series by ID
router.get('/test-series/:series_id', TestSeriesController.getTestSeriesById);

// Get all tests in a series
router.get('/test-series/:series_id/tests', TestSeriesController.getTestsInSeries);

// Get a specific test in a series
router.get('/test-series/:series_id/tests/:test_id', TestSeriesController.getTestInSeries);

// Update a test series
router.put('/test-series/:series_id', TestSeriesController.updateTestSeries);

// Delete a test series
router.delete('/test-series/:series_id', TestSeriesController.deleteTestSeries);

// Create a test in a series
router.post('/test-series/:series_id/tests', TestSeriesController.createSeriesTest);

// Get attempted tests in a series
router.get('/test-series/:series_id/attempted-tests', TestSeriesController.getAttemptedSeriesTests);

// Update a test in a series
router.put('/test-series/:series_id/tests/:test_id', TestSeriesController.updateSeriesTest);

// Delete a test from a series
router.delete('/test-series/:series_id/tests/:test_id', TestSeriesController.deleteSeriesTest);

// Submit a test response for a series test
router.post('/test-series/:series_id/tests/:test_id/submit', TestSeriesController.submitSeriesTest);

export default router;