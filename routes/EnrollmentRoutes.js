import express from 'express';
import EnrollmentController from '../controllers/EnrollmentController.js';

const router = express.Router();

router.post('/enroll-user', EnrollmentController.enrollUser);

export default router;