const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); 
const path = require('path');

const app = express();
const port = process.env.PORT || 9000; 

app.use(cors({
  origin: '*', 
}));

app.use(bodyParser.json());

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

app.post('/api/send-email', upload.single('attachment'), (req, res) => {
  const { email, message, sender, phoneNumber } = req.body;
  const attachmentFile = req.file; 

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER, 
      pass: process.env.GMAIL_PASS, 
    },
    
  });

  const mailOptions = {
    from: email, 
    to: process.env.GMAIL_RECEIVER, 
    subject: 'New Contact Form Submission',
    text: `${sender} sent you a message:
    ${message} 
    
    Customer email: ${email}
    Customer phone number: ${phoneNumber}
    `,

    attachments: attachmentFile
      ? [
          {
            filename: attachmentFile.originalname,
            content: attachmentFile.buffer, 
          },
        ]
      : [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully!' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
