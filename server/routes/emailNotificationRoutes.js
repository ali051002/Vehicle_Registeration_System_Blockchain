const express = require('express');
const { sendEmail } = require('../controllers/emailNotificationController');

const router = express.Router();

// Route to send email
router.post('/send-email', sendEmail);

module.exports = router;
