const express = require('express');
const { sendOtpController, verifyOtpController } = require('../controllers/otpController');

const router = express.Router();

// Route to send email
router.post('/send-otp', sendOtpController);

router.post('/verify-otp', verifyOtpController);

module.exports = router;