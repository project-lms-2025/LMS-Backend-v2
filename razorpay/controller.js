import express from 'express';
import razorpayInstance from '../config/razorpay.js';

const router = express.Router();

class RazorPayController{
    static async createOrder(req, res) {
        const { amount, currency } = req.body;
        console.log(req.body);

        try {
            const options = {
                amount: amount * 100, // Convert amount to smallest currency unit
                currency: currency || 'INR',
            };

            const order = await razorpayInstance.orders.create(options);
            res.status(200).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error creating RazorPay order');
        }
    }
}

export default RazorPayController;