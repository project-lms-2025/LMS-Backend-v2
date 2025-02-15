import express from 'express';
import QuestionController from '../controllers/QuestionController.js';

const router = express.Router();

router.get('/tests/:test_id/questions', QuestionController.getQuestionsForTest);
router.get('/questions/:question_id', QuestionController.getQuestionById);
router.post('/tests/:test_id/questions', QuestionController.createQuestion);
router.put('/questions/:question_id', QuestionController.updateQuestion);
router.delete('/questions/:question_id', QuestionController.deleteQuestion);

export default router;
