const transporter = require('../emailConfig/transporter');
const fs = require('fs');
const path = require('path');

// Send email with a beautified template
const sendEmail = async (req, res) => {
  const { to, subject, data } = req.body;

  if (!to || !subject || !data) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, data' });
  }

  try {
    // Read the HTML template file
    const htmlTemplate = fs.readFileSync(path.join(__dirname, '../emailConfig/emailTemplate.html'), 'utf8');

    // Replace placeholders with dynamic data
    const customizedHtml = htmlTemplate
  .replace(/{{user}}/g, data.user)
  .replace(/{{action}}/g, data.action)
  .replace(/{{vehicle}}/g, data.vehicle)
  .replace(/{{status}}/g, data.status);


    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      html: customizedHtml, // Send the customized HTML
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
};

module.exports = { sendEmail };
