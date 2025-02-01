const express = require('express');
const multer = require('multer');
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');

const upload = multer();
const router = express.Router();

router.post('/register', upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',resetPassword)

module.exports = router;