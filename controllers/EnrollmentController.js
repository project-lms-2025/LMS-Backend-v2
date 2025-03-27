import UserModel from '../models/UserModel.js';
import BatchModel from '../models/BatchModel.js';
import BatchEnrollmentModel from '../models/BatchEnrollmentModel.js';

class EnrollmentController {
  static async enrollUser(req, res) {
    const { user_id, batch_id, payment_amount, payment_status, enrollment_type } = req.body;

    try {
      const userResponse = await UserModel.getUserById(user_id);
      if (!userResponse.success) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const batchResponse = await BatchModel.getBatchById(batch_id);
      if (!batchResponse.success) {
        return res.status(404).json({ success: false, message: 'Batch not found' });
      }

      // if(payment_amount !== batchResponse.data.batch_price) {
      //   return res.status(400).json({ success: false, message: 'Payment amount does not match batch price' });
      // }

      if (payment_status !== 'successful') {
        return res.status(400).json({ success: false, message: 'Payment failed' });
      }

      const enrollmentResponse = await BatchEnrollmentModel.enrollUser({ 
        user_id, 
        batch_id,
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
}

export default EnrollmentController;
