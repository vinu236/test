import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In production, serve the built React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Valentine email
app.post('/api/send-valentine', async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log("name =>>.",name,email)

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const baseUrl = "https://valen-flax.vercel.app";
    const valentineLink = `${baseUrl}/valentine?name=${encodeURIComponent(name)}`;

    const htmlEmail = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#1a0a1e;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(135deg,#1a0a1e 0%,#2d1135 50%,#1a0a1e 100%);min-height:600px;">
        <tr>
          <td align="center" style="padding:40px 20px;">
            <table role="presentation" width="500" cellspacing="0" cellpadding="0" style="background:linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02));border-radius:24px;border:1px solid rgba(255,107,129,0.3);box-shadow:0 20px 60px rgba(255,107,129,0.15);">
              <tr>
                <td align="center" style="padding:50px 40px 20px;">
                  <div style="font-size:60px;line-height:1;">💕</div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:10px 40px;">
                  <h1 style="margin:0;font-size:32px;background:linear-gradient(135deg,#ff6b81,#ff4757,#ff6b81);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:700;letter-spacing:1px;">
                    You Have a Valentine!
                  </h1>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:20px 40px;">
                  <p style="margin:0;font-size:18px;color:#e8b4c8;line-height:1.6;">
                    Hey <strong style="color:#ff6b81;">${name}</strong>,<br><br>
                    Someone special has a Valentine's message just for you! 💝<br>
                    Click the button below to see what awaits you...
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:30px 40px;">
                  <a href="${valentineLink}" 
                     style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#ff6b81,#ff4757);color:white;text-decoration:none;border-radius:50px;font-size:18px;font-weight:600;letter-spacing:1px;box-shadow:0 8px 30px rgba(255,71,87,0.4);">
                    💌 Open Your Valentine
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:20px 40px;">
                  <div style="font-size:40px;">
                    🌹 💖 🌹
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:10px 40px 40px;">
                  <p style="margin:0;font-size:13px;color:rgba(232,180,200,0.5);">
                    Made with ❤️ for Valentine's Day 2026
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;

    await transporter.sendMail({
      from: `"Valentine 💕" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `💝 ${name}, You Have a Special Valentine's Message!`,
      html: htmlEmail,
    });

    res.json({ success: true, message: 'Valentine sent successfully! 💕' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Check your email configuration.' });
  }
});

// Catch-all: serve React app for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`💕 Valentine server running at http://localhost:${PORT}`);
  console.log(`📧 API endpoint: http://localhost:${PORT}/api/send-valentine`);
});
