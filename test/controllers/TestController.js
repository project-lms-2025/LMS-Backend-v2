import TestModel from "../models/TestModel.js";
import QuestionModel from "../models/QuestionModel.js";
import OptionModel from "../models/OptionModel.js";
import StudentResponseModel from "../models/StudentResponseModel.js";

class TestController {
  static async getAllTests(req, res) {
    const test_type = req.query.test_type;
    const user_data = { user_id: req.user_id, role: req.role };
    try {
      const tests = await TestModel.getAllTests({ test_type, user_data });
      res.status(200).json(tests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch tests" });
    }
  }

  static async getTestsInEntity(req, res) {
    const test_type = req.query.test_type;
    const { series_id, course_id } =
      test_type == "SERIES_TEST"
        ? { series_id: req.params.entity_id, course_id: null }
        : { series_id: null, course_id: req.params.entity_id };
    try {
      const tests = await TestModel.getTestsInEntity({ series_id, course_id });
      res.status(200).json(tests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch tests" });
    }
  }

  static async getAttemptedTests(req, res) {
    try {
      const tests = await TestModel.getAttemptedTests(req.user_id);
      res.status(200).json(tests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch attempted tests" });
    }
  }

  static async getTestById(req, res) {
    const { test_id } = req.params;
    try {
      const test = await TestModel.getTestById(test_id, req.role);
      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }
      res.status(200).json(test);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch the test" });
    }
  }

  static async getEnrolledTests(req, res) {
    try {
      const tests = await TestModel.getEnrolledTests(req.user_id);
      if (!tests) {
        return res.status(404).json({ error: "No enrolled tests found" });
      }
      res.status(200).json(tests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch enrolled tests" });
    }
  }

  static async createTest(req, res) {
    const examData = req.body;
    const user_id = req.user_id;
    try {
      const {
        title,
        test_id,
        test_type,
        selected_exam,
        course_id,
        series_id,
        description,
        duration,
        schedule_start,
        schedule_end,
        totalMarks,
        questions,
      } = examData;
      const test = await TestModel.createTest({
        test_id,
        test_type,
        selected_exam,
        course_id,
        series_id,
        teacher_id: user_id,
        title,
        description,
        schedule_start,
        schedule_end,
        duration,
        total_marks: totalMarks,
        questions_count: questions.length,
      });

      for (let questionData of questions) {
        const {
          question_id,
          section,
          question_text,
          question_type,
          image_url,
          positive_marks,
          negative_marks,
          options,
          correct_option_id,
        } = questionData;
        await QuestionModel.createQuestion({
          question_id,
          test_id,
          question_type,
          question_text,
          image_url,
          positive_marks,
          negative_marks,
          section,
          correct_option_id,
        });

        for (let optionData of options) {
          const { option_id, option_text, image_url, is_correct } = optionData;
          await OptionModel.createOption({
            option_id,
            question_id,
            option_text,
            image_url,
            is_correct,
          });
        }
      }

      return res.status(201).json({
        message: "Test created successfully",
        data: test,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error creating test",
        error: error.message,
      });
    }
  }

  static async updateTest(req, res) {
    const { test_id } = req.params;
    const updateData = req.body;
    try {
      const test = await TestModel.getTestById(test_id, req.role);
      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      await TestModel.updateTest(test_id, updateData);
      res.status(200).json({ message: "Test updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update the test" });
    }
  }

  static async deleteTest(req, res) {
    const { test_id } = req.params;
    try {
      const test = await TestModel.getTestById(test_id, req.role);
      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      await TestModel.deleteTest(test_id);
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete the test" });
    }
  }

  static async submitTest(req, res) {
    const { test_id } = req.params;
    const { responses } = req.body;
    const student_id = req.user_id;

    try {
      if (!responses || !Array.isArray(responses)) {
        return res.status(400).json({ error: "Responses must be an array." });
      }
      await StudentResponseModel.submitResponse({
        test_id,
        student_id,
        responses,
      });
      res
        .status(200)
        .json({ message: "Test responses submitted successfully", test_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to submit test responses" });
    }
  }
}

export default TestController;
