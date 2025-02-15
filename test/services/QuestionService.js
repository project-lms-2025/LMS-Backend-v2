import QuestionModel from '../models/QuestionModel.js';

class QuestionService {
  static async getQuestionsForTest(test_id) {
    return await QuestionModel.getQuestionsForTest(test_id);
  }

  static async getQuestionById(question_id) {
    return await QuestionModel.getQuestionById(question_id);
  }

  static async createQuestion(test_id, questionData) {
    return await QuestionModel.createQuestion(test_id, questionData);
  }

  static async updateQuestion(question_id, updateData) {
    return await QuestionModel.updateQuestion(question_id, updateData);
  }

  static async deleteQuestion(question_id) {
    return await QuestionModel.deleteQuestion(question_id);
  }
}

export default QuestionService;
