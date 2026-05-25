const nodemailer = require('nodemailer');
const logger = require('./logger');

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  if (!transporter) {
    logger.warn('SMTP not configured — skipping email send');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return true;
  } catch (err) {
    logger.error(`Failed to send email: ${err.message}`);
    return false;
  }
};

const sendResetEmail = async ({ to, resetLink }) => {
  const subject = 'Reset Password - RiceCare AI';
  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color:#111;">
      <h2 style="color:#0f5132;">Reset Password RiceCare AI</h2>
      <p>Anda meminta reset password. Klik tombol di bawah untuk membuat password baru. Tautan berlaku 15 menit.</p>
      <p style="text-align:center; margin: 24px 0;"><a href="${resetLink}" style="background:#16a34a;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Reset Password</a></p>
      <p>Atau gunakan tautan langsung: <a href="${resetLink}">${resetLink}</a></p>
      <hr />
      <p style="font-size:12px;color:#666;">Jika Anda tidak meminta reset password, abaikan email ini.</p>
    </div>
  `;

  return sendEmail({ to, subject, html, text: `Reset link: ${resetLink}` });
};

module.exports = { sendEmail, sendResetEmail };
