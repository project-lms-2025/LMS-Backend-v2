import TestModel from '../models/TestModel.js';
import { generateUniqueId } from '../../utils/idGenerator.js'

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
  static async createTest(req, res) {
    const testData = req.body;
    testData.teacher_email = req.email
    testData.test_id = generateUniqueId()
    try {
      await TestModel.createTest(testData);
      res.status(201).json({ message: 'Test created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create the test' });
    }
  }

  // Update a test by ID
  static async updateTest(req, res) {
    const { test_id } = req.params;
    const updateData = req.body;
    console.log(test_id)
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
