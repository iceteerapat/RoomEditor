import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export async function emailVerification(email, username){
  try {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

      const transporter = nodemailer.createTransport({
          service: 'Gmail',
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
          <a href="${process.env.BASE_URL}/createAccount/verify/${token}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
          <p>Room Visualizer</p>
        `
     };
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return { success: true};
  } catch(error) {
      console.error('Error sending verification email:', error);
      throw error;
  }
}

export async function sendResetEmail(email) {
  try {
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: email,
      subject: 'Reset your password',
      html: `
        <p>Hi,</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${process.env.BASE_URL}/login/reset/${resetToken}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>Room Visualizer</p>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email reset sent:', info.response);
    return { success: true };
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
}