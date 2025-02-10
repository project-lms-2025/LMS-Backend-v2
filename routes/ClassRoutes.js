import express from 'express';
const router = express.Router();
import ClassController from '../controllers/ClassController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

router.post('/',  AuthMiddleware.auth, AuthMiddleware.checkRole(["teacher"]), ClassController.createClass);
router.get('/:class_id', ClassController.getClass);
router.get('/course/:course_id', ClassController.getClassesByCourseId);
router.put('/:class_id',  AuthMiddleware.auth, AuthMiddleware.checkRole(["teacher"]), ClassController.updateClass);
router.delete('/:class_id',  AuthMiddleware.auth, AuthMiddleware.checkRole(["teacher"]), ClassController.deleteClass);

export default router;