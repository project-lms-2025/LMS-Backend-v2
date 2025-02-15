import StudentAnswerModel from '../models/StudentAnswerModel.js';

class StudentAnswerController {
  static async submitAnswers(req, res) {
    const { test_id } = req.params;
    const { student_id, answers } = req.body;
    try {
      await StudentAnswerModel.submitAnswers(test_id, student_id, answers);
      res.status(201).json({ message: 'Student answers submitted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to submit the student answers' });
    }
  }
}

export default StudentAnswerController;
