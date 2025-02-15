import StudentAnswerModel from '../models/StudentAnswerModel.js';

class StudentAnswerController {
  static async submitAnswers(req, res) {
    const { test_id } = req.params;
    const { student_id, answers } = req.body;
    try {
      await StudentAnswerModel.submitAnswers(test_id, student_id, answers);
      return res.status(201).json({
        success: true,
        message: 'Student answers submitted successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to submit the student answers.',
        error: error.message,
      });
    }
  }
}

export default StudentAnswerController;
