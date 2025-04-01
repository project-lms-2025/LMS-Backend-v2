import ResultModel from '../models/ResultModel.js';

class ResultController {
  static async getAllResults(req, res) {
    const { test_id } = req.params;
    try {
      const results = await ResultModel.getAllResults(test_id);
      return res.json({ message: "Fetched all results successfully", results });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching results" });
    }
  }

  static async getDetailedResult(req, res) {
    const { test_id, student_id } = req.params;

    try {
      const testData = await ResultModel.getDetailedResult(test_id, student_id);
      
      if (testData) {
        return res.json(testData);
      } else {
        return res.status(404).json({ message: "No results found for this test and student." });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error retrieving detailed results." });
    }
  }

  static async generateResult(req, res) {
    const { test_id } = req.params;

    try {
      await ResultModel.generateResult(test_id);
      return res.json({ message: "Scores calculated and stored successfully", test_id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error calculating and storing scores for all students" });
    }
  }
}

export default ResultController;
