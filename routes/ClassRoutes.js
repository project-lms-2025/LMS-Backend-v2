import express from 'express';
const router = express.Router();
import ClassController from '../controllers/ClassController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import RoleMiddleware from '../middleware/RoleMiddleware.js';

router.post('/',  AuthMiddleware.auth, await RoleMiddleware.checkRole(["admin", "teacher"]), ClassController.createClass);
router.get('/classes', AuthMiddleware.auth, await RoleMiddleware.checkRole(["admin", "teacher"]), ClassController.getAllClasses);
router.get('/:class_id', ClassController.getClass);
router.get('/course/:course_id', ClassController.getClassesByCourseId);
router.put('/:class_id',  AuthMiddleware.auth, await RoleMiddleware.checkRole(["admin", "teacher"]), ClassController.updateClass);
router.delete('/:class_id',  AuthMiddleware.auth, await RoleMiddleware.checkRole(["admin","teacher"]), ClassController.deleteClass);

export default router;