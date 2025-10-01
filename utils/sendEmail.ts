import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, text: string) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    console.warn('Email credentials are not configured; skipping sendEmail');
    return;
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
  await transporter.sendMail({ from: user, to, subject, text });
}
