import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AccountLogin from "../models/rvAccountLogin.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AccountLogin.findOne({ where: { email } });

    if (user.verifyEmail !== 'Y') {
      return res.status(400).json({ message: 'Unverified account' });
    }

    if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!user) {
    return res.status(404).json({ message: 'Account not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userEmail = user.email;
    const userUsername = user.username;
    
    res.json({ token, userEmail, userUsername });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
