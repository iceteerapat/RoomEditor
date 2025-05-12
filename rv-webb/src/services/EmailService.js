import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export async function emailVerification(email, username){
  try {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

      const transporter = nodemailer.createTransport({
          service: 'Gmail', // or use "SMTP" settings for custom domains
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
          }
      });

      const mailOptions = {
        from: `${process.env.EMAIL_USER}`,
        to: email,
        subject: 'Verify your email address',
        html: `
          <p>Hi ${username},</p>
          <p>Thank you for registering. Please click the link below to verify your email:</p>
          <a href="${process.env.BASE_URL}/verify-email/${token}">Verify Email</a>
          <p>This link will expire in 15 minutes.</p>
        `
     };
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      
  } catch(error) {
      console.error('Error sending verification email:', error);
      throw error;
  }
}