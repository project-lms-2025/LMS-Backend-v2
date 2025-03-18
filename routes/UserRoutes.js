import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import UserController from '../controllers/UserController.js';

const router = express.Router();

router.put('/update', authMiddleware.auth, UserController.updateUser);
router.delete('/delete', authMiddleware.auth, UserController.deleteUser);
router.get('/profile', UserController.getUserDetails);

export default router;