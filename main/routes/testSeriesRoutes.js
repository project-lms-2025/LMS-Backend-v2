import express from 'express';
import TestSeriesController from '../controllers/TestSeriesController.js';
import AuthMiddleware from '../../middleware/AuthMiddleware.js';
import RoleMiddleware from '../../middleware/RoleMiddleware.js';

const router = express.Router();

router.post( '/', AuthMiddleware.auth, await RoleMiddleware.checkRole(["admin", "teacher"]), TestSeriesController.createTestSeries);
router.get( '/', TestSeriesController.getAllTestSeries);
router.get('/:series_id', TestSeriesController.getTestSeriesById);
router.get('/my-series', AuthMiddleware.auth, TestSeriesController.getEnrolledTestSeries);
router.put( '/:series_id', AuthMiddleware.auth, await RoleMiddleware.checkRole(["admin", "teacher"]), TestSeriesController.updateTestSeries);
router.delete( '/:series_id', AuthMiddleware.auth, await RoleMiddleware.checkRole(["admin", "teacher"]), TestSeriesController.deleteTestSeries);

export default router;