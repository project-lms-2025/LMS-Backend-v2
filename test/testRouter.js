import express from 'express';
import testRoutes from './routes/TestRoutes.js';
import questionRoutes from './routes/QuestionRoutes.js';
import optionRoutes from './routes/OptionRoutes.js';
import resultRoutes from './routes/ResultRoutes.js';
import studentAnswerRoutes from './routes/StudentAnswerRoutes.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js'

const router = express.Router();
router.use(AuthMiddleware.auth)
router.use(testRoutes);
router.use(questionRoutes);
router.use(optionRoutes);
router.use(resultRoutes);
router.use(studentAnswerRoutes);

export default router;
