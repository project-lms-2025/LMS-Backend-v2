import ResultModel from '../models/ResultModel.js';

class ResultController {
  static async getResultsForTest(req, res) {
    const { test_id } = req.params;
    try {
      const results = await ResultModel.getResultsByTestId(test_id);
      return res.status(200).json({
        success: true,
        message: 'Fetched results for the test successfully.',
        data: results,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch results.',
        error: error.message,
      });
    }
  }

  static async createResult(req, res) {
    const { test_id } = req.params;
    const resultData = req.body;
    try {
      await ResultModel.createResult(test_id, resultData);
      return res.status(201).json({
        success: true,
        message: 'Result created successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create the result.',
        error: error.message,
      });
    }
  }

  static async updateResult(req, res) {
    const { result_id } = req.params;
    const updateData = req.body;
    try {
      await ResultModel.updateResult(result_id, updateData);
      return res.status(200).json({
        success: true,
        message: 'Result updated successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update the result.',
        error: error.message,
      });
    }
  }
}

export default ResultController;
