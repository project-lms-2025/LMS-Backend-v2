import express from 'express';
const router = express.Router();
import RazorpayController from './controller.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

router.post('/create-order', AuthMiddleware.auth, RazorpayController.createOrder);
router.post('/razorpay-webhook', RazorpayController.handleWebhook);

export default router;