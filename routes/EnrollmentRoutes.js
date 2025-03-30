import express from 'express';
import EnrollmentController from '../controllers/EnrollmentController.js';

const router = express.Router();

router.post('/enroll-user', EnrollmentController.enrollUser);
router.get('/batch', EnrollmentController.getEnrolledBatch);

export default router;