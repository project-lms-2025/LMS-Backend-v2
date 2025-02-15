import QuestionModel from '../models/QuestionModel.js';
import { generateUniqueId } from '../../utils/idGenerator.js';

class QuestionController {
  // Get all questions for a test
  static async getQuestionsForTest(req, res) {
    const { test_id } = req.params;
    try {
      const questions = await QuestionModel.getQuestionsByTestId(test_id);
      res.status(200).json(questions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  }

  // Get a specific question by ID
  static async getQuestionById(req, res) {
    const { question_id } = req.params;
    try {
      const question = await QuestionModel.getQuestionById(question_id);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.status(200).json(question);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch the question' });
    }
  }

  // Create a new question for a test
  static async createQuestion(req, res) {
    const { test_id } = req.params;
    const questionData = req.body;
    questionData.question_id = generateUniqueId();
    questionData.test_id = test_id;
    try {
      await QuestionModel.createQuestion(questionData);
      res.status(201).json({ message: 'Question created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create the question' });
    }
  }

  // Update a question by ID
  static async updateQuestion(req, res) {
    const { question_id } = req.params;
    const updateData = req.body;
    try {
      const question = await QuestionModel.getQuestionById(question_id);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      await QuestionModel.updateQuestion(question_id, updateData);
      res.status(200).json({ message: 'Question updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update the question' });
    }
  }

  // Delete a question by ID
  static async deleteQuestion(req, res) {
    const { question_id } = req.params;
    try {
      const question = await QuestionModel.getQuestionById(question_id);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      await QuestionModel.deleteQuestion(question_id);
      res.status(204).end();  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete the question' });
    }
  }
}

export default QuestionController;
