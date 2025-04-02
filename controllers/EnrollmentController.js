import UserModel from '../models/UserModel.js';
import BatchModel from '../main/models/BatchModel.js';
import BatchEnrollmentModel from '../models/BatchEnrollmentModel.js';
import TestSeriesModel from '../main/models/TestSeriesModel.js';

class EnrollmentController {
  static async enrollUser(req, res) {
    const { entity_id, payment_id, enrollment_type } = req.body;

    try {
      const user_id = req.user_id;
      const userResponse = await UserModel.getUserById(user_id);
      if (!userResponse.success) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const response = enrollment_type=="TEST_SERIES" ? await TestSeriesModel.getTestSeriesById(entity_id): await BatchModel.getBatchById(entity_id);
      if (!response.success) {
        return res.status(404).json({ success: false, message: 'Batch not found' });
      }

      if(!payment_id) {
        return res.status(400).json({ success: false, message: 'Payment ID is required' });
      }
      // if(payment_amount !== response.data.batch_price) {
      //   return res.status(400).json({ success: false, message: 'Payment amount does not match batch price' });
      // }

      const enrollmentResponse = await BatchEnrollmentModel.enrollUser({ 
        user_id, 
        entity_id,
        enrollment_type
      });

      if (!enrollmentResponse.success) {
        return res.status(500).json({ success: false, message: 'Failed to enroll user in batch' });
      }

      return res.status(200).json({ success: true, message: 'User enrolled successfully' });
    } catch (error) {
      console.error('Error enrolling user:', error);
      return res.status(500).json({ success: false, message: 'An error occurred during enrollment' });
    }
  }

  static async getEnrolledBatch(req, res) {
    const user_id = req.user_id;

    try {
      // Check if user exists
      const userResponse = await UserModel.getUserById(user_id);
      if (!userResponse.success) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Get all batches the user is enrolled in
      const enrolledBatchesResponse = await BatchEnrollmentModel.getEnrollmentByUserId(user_id);
      if (!enrolledBatchesResponse.success || enrolledBatchesResponse.data.length === 0) {
        return res.status(404).json({ success: false, message: 'User is not enrolled in any batch' });
      }

      return res.status(200).json({ success: true, data: enrolledBatchesResponse.data });
    } catch (error) {
      console.error('Error fetching enrolled batches:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while retrieving the batches' });
    }
  }

}

export default EnrollmentController;
