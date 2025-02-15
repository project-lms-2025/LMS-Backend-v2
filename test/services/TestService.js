import TestModel from '../models/TestModel.js';

class TestService {
  static async getAllTests() {
    return await TestModel.getAllTests();
  }

  static async getTestById(test_id) {
    return await TestModel.getTestById(test_id);
  }

  static async createTest(testData) {
    return await TestModel.createTest(testData);
  }

  static async updateTest(test_id, updateData) {
    return await TestModel.updateTest(test_id, updateData);
  }

  static async deleteTest(test_id) {
    return await TestModel.deleteTest(test_id);
  }
}

export default TestService;
