import ResultModel from '../models/ResultModel.js';

class ResultService {
  static async getResultsForTest(test_id) {
    return await ResultModel.getResultsByTestId(test_id);
  }

  static async getResultById(result_id) {
    return await ResultModel.getResultById(result_id);
  }

  static async createResult(test_id, resultData) {
    return await ResultModel.createResult(test_id, resultData);
  }

  static async updateResult(result_id, updateData) {
    return await ResultModel.updateResult(result_id, updateData);
  }
}

export default ResultService;
