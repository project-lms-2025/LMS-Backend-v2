import TestModel from '../models/TestModel.js';
import QuestionModel from '../models/QuestionModel.js'
import OptionModel from '../models/OptionModel.js'

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
      const { title, id, course_id, description, duration, scheduleDate, scheduleTime, totalMarks, questions } = examData;

      const test = await TestModel.createTest({
        test_id: id,
        teacher_id: req.user_id,
        course_id,
        title,
        description,
        schedule_date: scheduleDate,
        schedule_time: scheduleTime,
        duration,
        totalMarks
      });

      console.log("test created successfully")

      for (let questionData of questions) {
        const { id: question_id, section, question_text, question_type, positive_marks, negative_marks, options } = questionData;
        const question = await QuestionModel.createQuestion({
          question_id,
          test_id: id,
          question_type,
          question_text,
          positive_marks,
          negative_marks,
          section,
        });

        for (let optionData of options) {
          const { id: optionId, option_text, image_url, is_correct } = optionData;

          await OptionModel.createOption({
            option_id: optionId,
            question_id: question_id,
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
}

export default TestController;
