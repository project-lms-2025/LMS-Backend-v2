import ResultModel from '../models/ResultModel.js';
import { generateUniqueId } from '../../utils/idGenerator.js'
import OptionController from './OptionController.js';
import QuestionModel from '../models/QuestionModel.js';

class ResultController {
  static async getResultsForTest(req, res) {
    const { test_id } = req.params;
    try {
      const results = await ResultModel.getResultsByTestId(test_id);
      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch results' });
    }
  }

  static async createResult(req, res) {
    const { test_id } = req.params;
    const resultData = req.body;
    resultData.result_id = generateUniqueId();
    resultData.test_id = test_id;
    try {
      await ResultModel.createResult(resultData);
      res.status(201).json({ message: 'Result created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create the result' });
    }
  }

  static async updateResult(req, res) {
    const { result_id } = req.params;
    const updateData = req.body;
    try {
      await ResultModel.updateResult(result_id, updateData);
      res.status(200).json({ message: 'Result updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update the result' });
    }
  }

  static async deleteResult(req, res) {
    const { result_id } = req.params;
    try {
      await ResultModel.deleteResult(result_id);
      res.status(204).end();  // No content, indicating successful deletion
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete the result' });
    }
  }

  static async calculateScore(question, studentResponse) {
    const correctAnswer = question.answers;
    const questionType = question.question_type;
    const positiveMarks = question.positive_marks;
    const negativeMarks = question.negative_marks;
    console.log(correctAnswer, questionType, positiveMarks, negativeMarks)

    if (questionType === 'M') {
        if (studentResponse && studentResponse[0] === correctAnswer[0]) {
            return positiveMarks;
        } else {
            return negativeMarks;
        }
    } else if (questionType === 'S') {
        if (!studentResponse || studentResponse.length === 0) {
            return negativeMarks;
        }

        let correctCount = 0;
        let incorrectCount = 0;

        for (const responseOption of studentResponse) {
            if (correctAnswer.includes(responseOption)) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        }

        if (incorrectCount > 0) {
            return negativeMarks;
        } else if (correctCount === correctAnswer.length) {
            return positiveMarks;
        } else {
            return positiveMarks * (correctCount / correctAnswer.length);
        }
    } else if (questionType === 'N') {
        if (studentResponse && studentResponse[0] === correctAnswer[0]) {
            return positiveMarks;
        } else {
            return negativeMarks;
        }
    }

    return 0;
  }

  static async generateAndSaveResult(req, res){
    try {
      const {test_id} = req.params;
      const studentEmail = req.email;
      const answers = req.body.answers;


      if (!answers || !Array.isArray(answers)) {
          return res.status(400).json({ message: "Invalid answers format" });
      }

      const questions = await QuestionModel.getQuestionsByTestId(test_id);
      if (!questions || questions.length === 0) {
          return res.status(404).json({ message: "Questions not found for the given test ID" });
      }

      let student_score = 0;
      let correct_count = 0;
      let wrong_count = 0;
      const results = [];

      for (const answer of answers) {
          const { question_id, chosen_answer } = answer;
          const question = questions.find(q => q.question_id === question_id);

          if (!question) {
              results.push({
                  question_id: question_id,
                  score: 0,
                  message: "Question not found",
              });
              continue;
          }
          console.log(this)
          const score = await ResultController.calculateScore(question, chosen_answer);
          student_score += score;

          if (score > 0) {
              correct_count++;
          } else if (score < 0) {
              wrong_count++;
          }

          results.push({
              question_id: question_id,
              score: score,
          });
      }

      res.json({
          student_email: studentEmail,
          test_id: test_id,
          total_score: student_score,
          correct_count: correct_count,
          wrong_count: wrong_count,
          results: results,
      });
    } catch (err) {
        console.error("Error calculating score:", err);
        res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default ResultController;
