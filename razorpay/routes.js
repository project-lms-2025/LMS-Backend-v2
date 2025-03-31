import express from 'express';
const router = express.Router();
import RazorpayController from './controller.js';

router.post('/create-order', RazorpayController.createOrder);

export default router;