import express from 'express';
const router = express.Router();
import CourseController from '../controllers/courseController.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.post('/', authMiddleware.isAuthenticated, authMiddleware.isTeacher, CourseController.createCourse);
router.get('/:course_id', CourseController.getCourse);
router.get('/batch/:batch_id', CourseController.getCoursesByBatchId);
router.put('/:course_id', authMiddleware.isAuthenticated, authMiddleware.isTeacher, CourseController.updateCourse);
router.delete('/:course_id', authMiddleware.isAuthenticated, authMiddleware.isTeacher, CourseController.deleteCourse);

export default router;