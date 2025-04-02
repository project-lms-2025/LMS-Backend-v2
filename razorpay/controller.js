import express from 'express';
import razorpayInstance from '../config/razorpay.js';
import crypto from 'crypto';
import BatchEnrollmentModel from '../models/BatchEnrollmentModel.js';
import EmailService from '../services/EmailService.js';

const router = express.Router();

class RazorPayController {
    // Create order as previously defined
    static async createOrder(req, res) {
        const user_id = req.user_id;
        const { amount, currency , batch_id, series_id} = req.body;

        try {
            const options = {
                amount: amount * 100, // Convert amount to smallest currency unit
                currency: currency || 'INR',
                notes: {
                    batch_id,
                    series_id,
                    user_id,
                    email: req.email
                }
            };

            const order = await razorpayInstance.orders.create(options);
            res.status(200).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error creating RazorPay order');
        }
    }

    static async handleWebhook(req, res) {
        const razorpaySecret = process.env.RAZORPAY_SECRET_KEY;
        const signature = req.headers['x-razorpay-signature'];
        const payload = JSON.stringify(req.body);

        const verifySignature = (payload, signature) => {
            const generatedSignature = crypto
                .createHmac('sha256', razorpaySecret)
                .update(payload)
                .digest('hex');
            return generatedSignature === signature;
        };

        if (!verifySignature(payload, signature)) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const { event, payload: { payment } } = req.body;
        if (event === 'payment.captured') {
            const batchId = payment.entity.notes.batch_id;
            const seriesId = payment.entity.notes.series_id;
            const userId = payment.entity.notes.user_id;
            const email = payment.entity.notes.email;

            console.log('Payment captured!');
            console.log('Batch ID:', batchId);
            console.log('User ID:', userId);
            console.log('series ID:', seriesId);

            try {
                await BatchEnrollmentModel.enrollUser({
                    user_id: userId,
                    entity_id: batchId || seriesId,
                    enrollment_type: batchId ? 'BATCH' : 'TEST_SERIES'
                });

                await EmailService.sendEmailService(email, "enrollmentSuccess", process.env.FRONTEND_URL)
                // Implement your business logic here, e.g., update DB with payment status
                // Example: await updateOrderStatus(batchId, userId, payment.status);

                // Respond with success
                return res.status(200).json({ message: 'Webhook received successfully' });
            } catch (err) {
                console.error('Error processing payment:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }

        // If not a captured payment event, just return success (you can handle other events here)
        return res.status(200).json({ message: 'Event received' });
    }
}

export default RazorPayController;
