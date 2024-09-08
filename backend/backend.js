const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 9000; 


app.use(cors({
  origin: '*', 
}));


app.use(bodyParser.json());

app.post('/api/send-email', (req, res) => {
  const { email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER, 
      pass: process.env.GMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: email, 
    to: process.env.GMAIL_RECIEVER, 
    subject: 'New Contact Form Submission',
    text: `You have recieve a new message from: ${email}
    
    ${message}`,

  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to send email' });
    }
    res.status(200).json({ message: 'Email sent successfully!' });
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
