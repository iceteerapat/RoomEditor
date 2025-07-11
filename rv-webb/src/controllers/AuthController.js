import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Account from "../models/Account.js";
import Service from "../models/Service.js";
import { sendResetEmail } from "../services/EmailService.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
    }

    const account = await Account.findOne({ where: { email: email } });
    if (!account) {
    return res.status(404).json({ message: 'User not found' });
    }

    if (account.verifyEmail !== 'Y') {
      return res.status(404).json({ message: 'Unverified account' });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const service = await Service.findOne({ where: {customerId: account.customerId } });
    if (!service) {
    return res.status(404).json({ message: 'Account Service not found' });
    }

    const token = jwt.sign({
       email: account.email,
       username: account.username,
       customerId: account.customerId,
       productName: service.productName,
       credits: service.credits
       }, 
       process.env.JWT_SECRET, 
       { expiresIn: '1h' }
      );
    
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req, res) =>{
  try {
    res.status(200).json({ message: 'Logged out successfully'});
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Logout Failed'});
  }
};

export const refresh = async (req, res) =>{
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const refreshToken = authHeader.split(' ')[1];

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const service = await Service.findOne({ where: {customerId: decoded.customerId } });
    if (!service) {
    return res.status(404).json({ message: 'Account Service not found' });
    }
    const account = await Account.findOne({ where: { email: decoded.email } });
    if (!account) {
    return res.status(404).json({ message: 'Account not found' });
    }

    const newAccessToken = jwt.sign(
      { 
        email: account.email, 
        username: account.username, 
        customerId: account.customerId,
        productName: service.productName,
        credits: service.credits 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token: newAccessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

export const reset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const account = await Account.findOne({ where: { email: email } });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    await sendResetEmail(account.email);

    res.status(200).json({ message: 'Email reset link sent successful'});
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ message: 'Reset failed' });
  }
};

export const verifyReset = async (req, res) => {
    try {
    const { token, newPassword } = req.body; // Expect token and newPassword from the request body

    // 1. Basic input validation
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }
    if (newPassword.length < 6) { // Example: minimum password length
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    // 2. Re-verify the token for security (important for POST requests)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // If token is invalid or expired, return error
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Reset link has expired. Please request a new one.' });
      }
      return res.status(401).json({ message: 'Invalid token.' });
    }

    const email = decoded.email; // Get email from the decoded token

    // 3. Find the user account
    const account = await Account.findOne({ where: { email } });
    if (!account) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    // Optional: If you implement token invalidation (e.g., a 'used' flag in DB)
    // if (account.resetTokenUsed) {
    //   return res.status(401).json({ message: 'This reset link has already been used.' });
    // }

    // 4. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is a good salt rounds value

    // 5. Update the account's password in the database
    account.password = hashedPassword;
    // Optional: Invalidate the token in your database if you store them (e.g., set account.resetToken = null, account.resetTokenUsed = true)
    // This prevents the same token from being used multiple times.
    await account.save();

    res.status(200).json({ message: 'Password has been successfully reset.' });

  } catch (error) {
    console.error('Set new password error:', error);
    res.status(500).json({ message: 'Failed to set new password.' });
  }
};

export const verifyResetToken = async (req, res) => {
  const { token } = req.params; // Token comes from URL parameters

  if (!token) {
    return res.status(400).json({ message: 'Token is required.' });
  }

  try {
    // Verify the token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email; // Assuming your token payload includes the email

    // Find the account to ensure it exists and is active
    const account = await Account.findOne({ where: { email } });
    if (!account) {
      return res.status(404).json({ message: 'Account not found or token invalid.' });
    }

    // Optional: You could add a check here if the token has been used/blacklisted
    // if (account.resetTokenUsed) { return res.status(401).json({ message: 'Token already used.' }); }

    // If verification is successful, send a success response.
    // The frontend will then display the new password input fields.
    res.status(200).json({ message: 'Token verified successfully. Please set your new password.' });
  } catch (error) {
    console.error('Token verification error:', error);
    // Handle different JWT errors specifically if needed (e.g., TokenExpiredError)
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Reset link has expired. Please request a new one.' });
    }
    return res.status(401).json({ message: 'Invalid or malformed token.' });
  }
};