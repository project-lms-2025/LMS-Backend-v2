import TestModel from '../models/TestModel.js';

class TestController {
  static async getAllTests(req, res) {
    try {
      const tests = await TestModel.getAllTests();
      return res.status(200).json({
        success: true,
        message: 'Fetched all tests successfully.',
        ...tests,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch tests.',
        error: error.message,
      });
    }
  }

  // Get a specific test by ID
  static async getTestById(req, res) {
    const { test_id } = req.params;
    try {
      const test = await TestModel.getTestById(test_id);
      if (!test) {
        return res.status(404).json({
          success: false,
          message: 'Test not found.',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Test fetched successfully.',
        data: test,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch the test.',
        error: error.message,
      });
    }
  }

  // Create a new test
  static async createTest(req, res) {
    const testData = req.body;
    try {
      await TestModel.createTest(testData);
      return res.status(201).json({
        success: true,
        message: 'Test created successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create the test.',
        error: error.message,
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
        return res.status(404).json({
          success: false,
          message: 'Test not found.',
        });
      }

      await TestModel.updateTest(test_id, updateData);
      return res.status(200).json({
        success: true,
        message: 'Test updated successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update the test.',
        error: error.message,
      });
    }
  }

  // Delete a test by ID
  static async deleteTest(req, res) {
    const { test_id } = req.params;
    try {
      const test = await TestModel.getTestById(test_id);
      if (!test) {
        return res.status(404).json({
          success: false,
          message: 'Test not found.',
        });
      }

      await TestModel.deleteTest(test_id);
      return res.status(200).json({
        success: true,
        message: 'Test deleted successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete the test.',
        error: error.message,
      });
    }
  }
}

export default TestController;
