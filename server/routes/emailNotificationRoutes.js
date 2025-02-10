const express = require('express');
const authorize = require('../middleware/authMiddleware');
const { sendEmail } = require('../controllers/emailNotificationController');

const router = express.Router();

// Route to send email
router.post('/send-email', sendEmail);

module.exports = router;
