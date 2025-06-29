import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AccountLogin from "../models/rvAccountLogin.js";
import AccountService from "../models/rvAccountService.js";
import Account from "../models/rvAccount.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await AccountLogin.findOne({ where: { email: email } });
    if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }

    if (user.verifyEmail !== 'Y') {
      return res.status(400).json({ message: 'Unverified account' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const account = await Account.findOne({ where: { email: user.email } });
    if (!account) {
    return res.status(404).json({ message: 'Account not found' });
    }

    const service = await AccountService.findOne({ where: {customerId: account.customerId } });
    if (!service) {
    return res.status(404).json({ message: 'Account Service not found' });
    }

    const token = jwt.sign({
       email: user.email,
       username: user.username,
       customerId: service.customerId,
       serviceName: service.serviceName,
       imageGenerated: service.imageGenerated
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

    const service = await AccountService.findOne({ where: {customerId: decoded.customerId } });
    if (!service) {
    return res.status(404).json({ message: 'Account Service not found' });
    }
    const account = await AccountLogin.findOne({ where: { email: decoded.email } });
    if (!account) {
    return res.status(404).json({ message: 'Account not found' });
    }

    const newAccessToken = jwt.sign(
      { 
        email: account.email, 
        username: account.username, 
        customerId: service.customerId,
        serviceName: service.serviceName,
        imageGenerated: service.imageGenerated 
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