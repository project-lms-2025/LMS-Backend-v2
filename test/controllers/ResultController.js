import ResultModel from '../models/ResultModel.js';
import { generateUniqueId } from '../../utils/idGenerator.js'

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
}

export default ResultController;
