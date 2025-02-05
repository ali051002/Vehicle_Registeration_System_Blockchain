const express = require('express');
const authorize = require('../middleware/authMiddleware');
const { sendOtpController, verifyOtpController,sendRegOtpController,verifyRegOtpController } = require('../controllers/otpController');

const router = express.Router();

// Route to send email
router.post('/send-otp',authorize(['user','government official','InspectionOfficer']), sendOtpController);

router.post('/verify-otp',authorize(['user','government official','InspectionOfficer']), verifyOtpController);

router.post('/send-Regotp',authorize(['user','government official','InspectionOfficer']), sendRegOtpController);

router.post('/verify-Regotp',authorize(['user','government official','InspectionOfficer']), verifyRegOtpController);

module.exports = router;