import TestSeriesModel from '../models/TestSeriesModel.js';

class TestSeriesController {
  static async createTestSeries(req, res) {
    const seriesData = req.body;
    try {
      const { series_id, title, description, cost } = seriesData;

      const series = await TestSeriesModel.createTestSeries({
        series_id,
        teacher_id: req.user_id,
        title,
        description,
        cost
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
      res.status(200).json({success: true, message: "Test series fetched successfully", data: series}); 
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
      res.status(200).json({success: true, message: "test series fetched successfully", data: series});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch the test series' });
    }
  }

  static async getEnrolledTestSeries(req, res) {
    try {
      const user_id = req.user_id;
      const enrolledSeries = await TestSeriesModel.getUserEnrolledTestSeries(user_id);
      if (!enrolledSeries.length) {
        return res.status(404).json({ error: 'No enrolled test series found' });
      }
      res.status(200).json({success: true, data: enrolledSeries, message: "Enrolled test series fetched successfully"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch enrolled test series' });
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
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete the test series' });
    }
  }
}

export default TestSeriesController;
