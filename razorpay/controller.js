import express from 'express';
import razorpayInstance from '../config/razorpay.js';
import crypto from 'crypto';

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
        const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
        const signature = req.headers['x-razorpay-signature'];
        const payload = JSON.stringify(req.body);
        console.log('Payload:', payload);

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
            const batchId = payment.notes.batch_id;
            const seriesId = payment.notes.series_id;
            const userId = payment.notes.user_id;

            console.log('Payment captured!');
            console.log('Batch ID:', batchId);
            console.log('User ID:', userId);
            console.log('series ID:', seriesId);

            try {
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
