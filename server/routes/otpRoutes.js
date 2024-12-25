const express = require('express');
const { sendOtpController, verifyOtpController,sendRegOtpController,verifyRegOtpController } = require('../controllers/otpController');

const router = express.Router();

// Route to send email
router.post('/send-otp', sendOtpController);

router.post('/verify-otp', verifyOtpController);

router.post('/send-Regotp', sendRegOtpController);

router.post('/verify-Regotp', verifyRegOtpController);

module.exports = router;