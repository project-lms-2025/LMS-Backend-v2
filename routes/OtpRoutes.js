import express from 'express';
const router = express.Router();
import EmailController from '../controllers/EmailController.js';

router.post('/send', EmailController.sendEmailOtp);

router.post('/verify', EmailController.verifyEmailOtp);

export default router;
