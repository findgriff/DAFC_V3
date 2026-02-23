const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, topic, message } = req.body;

    // Validate input
    if (!name || !email || !topic || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Get database connection
    const connection = await pool.getConnection();

    try {
      // Insert into database
      const [result] = await connection.execute(
        'INSERT INTO contact_submissions (name, email, topic, message, created_at) VALUES (?, ?, ?, ?, NOW())',
        [name, email, topic, message]
      );

      // Email to visitor
      const visitorMail = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'We received your message | Darley Abbey FC',
        html: `
          <h2>Hi ${name},</h2>
          <p>Thank you for reaching out to Darley Abbey FC. We've received your message and will get back to you soon.</p>
          <hr>
          <p><strong>Your message:</strong></p>
          <p><strong>Topic:</strong> ${topic}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p>Best regards,<br>Darley Abbey FC</p>
        `
      };

      // Email to club
      const clubMail = {
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: `New contact form submission: ${topic}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Topic:</strong> ${topic}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `
      };

      // Send both emails
      await Promise.all([
        transporter.sendMail(visitorMail),
        transporter.sendMail(clubMail)
      ]);

      res.json({ success: true, message: 'Message sent successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, error: 'Failed to process message' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Contact API running on port ${PORT}`);
});
