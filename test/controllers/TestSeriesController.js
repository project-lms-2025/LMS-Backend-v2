import TestSeriesModel from '../models/TestSeriesModel.js';
import TSTestModel from '../models/TSTestModel.js';

class TestSeriesController {
  static async createTestSeries(req, res) {
    const seriesData = req.body;
    try {
      const { series_id, title, description, total_tests } = seriesData;
      
      const series = await TestSeriesModel.createTestSeries({
        series_id,
        teacher_id: req.user_id,
        title,
        description,
        total_tests
      });

      return res.status(201).json({
        message: 'Test series created successfully',
        data: series
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error creating test series',
        error: error.message
      });
    }
  }

  static async getAllTestSeries(req, res) {
    try {
      const series = await TestSeriesModel.getAllTestSeries();
      res.status(200).json(series);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch test series' });
    }
  }

  static async getTestSeriesById(req, res) {
    const { series_id } = req.params;
    try {
      const series = await TestSeriesModel.getTestSeriesById(series_id);
      if (!series) {
        return res.status(404).json({ error: 'Test series not found' });
      }
      res.status(200).json(series);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch the test series' });
    }
  }

  static async getTestsInSeries(req, res) {
    const { series_id } = req.params;
    try {
      const tests = await TSTestModel.getAllTSTests(series_id);
      res.status(200).json(tests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch tests in series' });
    }
  }

  static async getTestInSeries(req, res) {
    const { series_id, test_id } = req.params;
    try {
      const test = await TSTestModel.getTSTestById(test_id, req.role);
      (test);
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }
      if (test.series_id !== series_id) {
        return res.status(400).json({ error: 'Test does not belong to this series' });
      }
      res.status(200).json(test);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch the test' });
    }
  }

  static async updateTestSeries(req, res) {
    const { series_id } = req.params;
    const updateData = req.body;
    try {
      const series = await TestSeriesModel.getTestSeriesById(series_id);
      if (!series) {
        return res.status(404).json({ error: 'Test series not found' });
      }

      await TestSeriesModel.updateTestSeries(series_id, updateData);
      res.status(200).json({ message: 'Test series updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update the test series' });
    }
  }

  static async deleteTestSeries(req, res) {
    const { series_id } = req.params;
    try {
      const series = await TestSeriesModel.getTestSeriesById(series_id);
      if (!series) {
        return res.status(404).json({ error: 'Test series not found' });
      }

      await TestSeriesModel.deleteTestSeries(series_id);
      res.status(204).end();  // No content, indicating successful deletion
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete the test series' });
    }
  }
}

export default TestSeriesController;