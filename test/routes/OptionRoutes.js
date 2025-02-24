import express from 'express';
import OptionController from '../controllers/OptionController.js';

const router = express.Router();

router.get('/questions/:question_id/options', OptionController.getOptionsForQuestion);
router.post('/questions/:question_id/options', OptionController.createOption);
router.put('/options/:option_id', OptionController.updateOption);
router.delete('/options/:option_id', OptionController.deleteOption);
router.get("/getCorrectOptions/:test_id", OptionController.getCorrectOptions);

export default router;
