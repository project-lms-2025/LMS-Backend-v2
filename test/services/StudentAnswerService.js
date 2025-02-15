import StudentAnswerModel from '../models/StudentAnswerModel.js';

class StudentAnswerService {
  static async submitAnswers(test_id, student_id, answers) {
    return await StudentAnswerModel.submitAnswers(test_id, student_id, answers);
  }
}

export default StudentAnswerService;
