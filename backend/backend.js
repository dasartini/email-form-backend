const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 9000; // Use dynamic port for deployment

// Add CORS middleware
app.use(cors({
  origin: '*', // Allow all origins temporarily (set to your frontend domain in production)
}));

// Middleware to parse JSON data
app.use(bodyParser.json());

app.post('/api/send-email', (req, res) => {
  const { email, message } = req.body;

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER, // Environment variable for email address
      pass: process.env.GMAIL_PASS, // Environment variable for email password
    },
  });

  // Set up email data
  const mailOptions = {
    from: email, // Sender address
    to: 'receiver-email@gmail.com', // Your email (to receive messages)
    subject: 'New Contact Form Submission',
    text: `You have recieve a new message from: ${email}
    
    ${message}`, // Plain text body

  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to send email' });
    }
    res.status(200).json({ message: 'Email sent successfully!' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
