const express = require('express');
const router = express.Router();
const { sendEmailOtp, verifyEmailOtp } = require('../controllers/emailController');

router.post('/send', sendEmailOtp);

router.post('/verify', verifyEmailOtp);

module.exports = router;
