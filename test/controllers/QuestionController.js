import QuestionModel from '../models/QuestionModel.js';

class QuestionController {
  // Get all questions for a test
  static async getQuestionsForTest(req, res) {
    const { test_id } = req.params;
    try {
      const questions = await QuestionModel.getQuestionsByTestId(test_id);
      return res.status(200).json({
        success: true,
        message: 'Fetched questions for the test successfully.',
        data: questions,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch questions.',
        error: error.message,
      });
    }
  }

  // Get a specific question by ID
  static async getQuestionById(req, res) {
    const { question_id } = req.params;
    try {
      const question = await QuestionModel.getQuestionById(question_id);
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found.',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Question fetched successfully.',
        data: question,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch the question.',
        error: error.message,
      });
    }
  }

  // Create a new question for a test
  static async createQuestion(req, res) {
    const { test_id } = req.params;
    const questionData = req.body;
    try {
      await QuestionModel.createQuestion(test_id, questionData);
      return res.status(201).json({
        success: true,
        message: 'Question created successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create the question.',
        error: error.message,
      });
    }
  }

  // Update a question by ID
  static async updateQuestion(req, res) {
    const { question_id } = req.params;
    const updateData = req.body;
    try {
      const question = await QuestionModel.getQuestionById(question_id);
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found.',
        });
      }

      await QuestionModel.updateQuestion(question_id, updateData);
      return res.status(200).json({
        success: true,
        message: 'Question updated successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update the question.',
        error: error.message,
      });
    }
  }

  // Delete a question by ID
  static async deleteQuestion(req, res) {
    const { question_id } = req.params;
    try {
      const question = await QuestionModel.getQuestionById(question_id);
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found.',
        });
      }

      await QuestionModel.deleteQuestion(question_id);
      return res.status(200).json({
        success: true,
        message: 'Question deleted successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete the question.',
        error: error.message,
      });
    }
  }
}

export default QuestionController;
