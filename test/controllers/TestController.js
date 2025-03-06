import TestModel from '../models/TestModel.js';
import QuestionModel from '../models/QuestionModel.js'
import OptionModel from '../models/OptionModel.js'
import StudentResponseModel from '../models/StudentResponseModel.js';

class TestController {
  static async getAllTests(req, res) {
    try {
      const tests = await TestModel.getAllTests();
      res.status(200).json(tests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch tests' });
    }
  }

  // Get a specific test by ID
  static async getTestById(req, res) {
    const { test_id } = req.params;
    try {
      const test = await TestModel.getTestById(test_id);
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }
      res.status(200).json(test);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch the test' });
    }
  }

  // Create a new test
  // static async createTest(req, res) {
  //   const testData = req.body;
  //   testData.teacher_email = req.email
  //   try {
  //     await TestModel.createTest(testData);
  //     res.status(201).json({ message: 'Test created successfully' });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Failed to create the test' });
  //   }
  // }

  static async createTest(req, res){
    const examData = req.body;

    try {
      const { title, test_id, course_id, description, duration, schedule_date, schedule_time, totalMarks, questions } = examData;

      const test = await TestModel.createTest({
        test_id,
        teacher_id: req.user_id,
        course_id,
        title,
        description,
        schedule_date,
        schedule_time,
        duration,
        totalMarks
      });

      console.log("test created successfully")

      for (let questionData of questions) {
        const { question_id, section, question_text, question_type,image_url, positive_marks, negative_marks, options } = questionData;
        const question = await QuestionModel.createQuestion({
          question_id,
          test_id,
          question_type,
          question_text,
          image_url,
          positive_marks,
          negative_marks,
          section,
        });

        for (let optionData of options) {
          const { option_id, option_text, image_url, is_correct } = optionData;

          await OptionModel.createOption({
            option_id,
            question_id,
            option_text,
            image_url,
            is_correct
          });
        }
      }

      console.log("question and options  created successfully")

      return res.status(201).json({
        message: 'Exam created successfully',
        data: test
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error creating exam',
        error: error.message
      });
    }
  }

  // Update a test by ID
  static async updateTest(req, res) {
    const { test_id } = req.params;
    const updateData = req.body;
    try {
      const test = await TestModel.getTestById(test_id);
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }

      await TestModel.updateTest(test_id, updateData);
      res.status(200).json({ message: 'Test updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update the test' });
    }
  }

  // Delete a test by ID
  static async deleteTest(req, res) {
    const { test_id } = req.params;
    try {
      const test = await TestModel.getTestById(test_id);
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }

      await TestModel.deleteTest(test_id);
      res.status(204).end();  // No content, indicating successful deletion
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete the test' });
    }
  }

  static async submitTest(req, res) {
    const { test_id } = req.params;
    const { responses } = req.body;
  
    try {
      if (!responses || !Array.isArray(responses)) {
        return res.status(400).json({ error: 'Responses must be an array.' });
      }
      await StudentResponseModel.insertResponses({ test_id, responses });
      res.status(200).json({
        message: 'Test responses submitted successfully',
        test_id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to submit test responses' });
    }
  }  
}

export default TestController;
