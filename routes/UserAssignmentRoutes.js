import express from 'express';
import BatchAssignmentController from '../controllers/BatchAssignmentController.js';
import CourseAssignmentController from '../controllers/CourseAssignmentController.js';
const router = express.Router();

router.post('/assign/batch', BatchAssignmentController.assignEntityToBatch);  
router.post('/bulk/assign/batches', BatchAssignmentController.bulkAssignEntitiesToBatches); 

router.post('/assign/course', CourseAssignmentController.assignEntityToCourse);
router.post('/bulk/assign/courses', CourseAssignmentController.bulkAssignEntitiesToCourses); 

export default router;
