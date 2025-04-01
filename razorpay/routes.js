import express from 'express';
const router = express.Router();
import RazorpayController from './controller.js';

router.post('/create-order', RazorpayController.createOrder);
router.post('/razorpay-webhook', RazorpayController.handleWebhook);

export default router;