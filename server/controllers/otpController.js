const crypto = require('crypto'); // To generate random OTP
const { verifyOtp, assignOtpToEmail } = require('../db/dbQueries');
const transporter = require('../emailConfig/transporter');
const fs = require('fs');
const path = require('path');

// Generate and Send OTP Controller
const sendOtpController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Generate a 6-digit random OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Assign OTP to the email in the database with a 5-minute expiry
        await assignOtpToEmail(email, otp, 5);

        // Read the HTML template file
        const htmlTemplate = fs.readFileSync(path.join(__dirname, '../emailConfig/otpMailTemplate.html'), 'utf8');

        // Replace placeholders in the email template with dynamic data
        const customizedHtml = htmlTemplate
            .replace(/{{otp}}/g, otp); // OTP is the dynamic value

        // Set up the mail options
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP for Verification',
            html: customizedHtml,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully', info });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate or send OTP', details: error.message });
    }
};

// Verify OTP Controller
const verifyOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ msg: "Email and OTP are required" });
        }
        const isValid = await verifyOtp(email, otp);
        if (isValid === 1) {
            res.status(200).json({ msg: "OTP verified successfully" });
        } else {
            res.status(400).json({ msg: "Invalid or expired OTP" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error verifying OTP", error: error.message });
    }
};

module.exports = {
    sendOtpController,
    verifyOtpController  
};
