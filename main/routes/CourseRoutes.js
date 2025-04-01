import express from 'express';
const router = express.Router();
import CourseController from '../controllers/CourseController.js';
import AuthMiddleware from '../../middleware/AuthMiddleware.js';
import RoleMiddleware from '../../middleware/RoleMiddleware.js';

router.post('/', AuthMiddleware.auth,await RoleMiddleware.checkRole(["admin", "teacher"]), CourseController.createCourse);
router.get('/courses', AuthMiddleware.auth,await RoleMiddleware.checkRole(["admin", "teacher"]), CourseController.getAllCourses);
router.get('/my-courses', AuthMiddleware.auth, CourseController.getEnrolledCourses);
router.get('/batch/:batch_id', CourseController.getCoursesByBatchId); //check for enrollment
router.get('/:course_id', CourseController.getCourse); //check for enrollment
router.put('/:course_id', AuthMiddleware.auth,await RoleMiddleware.checkRole(["admin", "teacher"]), CourseController.updateCourse);
router.delete('/:course_id', AuthMiddleware.auth,await RoleMiddleware.checkRole(["admin", "teacher"]), CourseController.deleteCourse);

export default router;