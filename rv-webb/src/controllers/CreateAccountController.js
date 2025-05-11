import CustomerAccount from "../models/rv_customer_acct.js";

export const createAccount = async(req, res) => {
    try {
        const { username, email, password, verifyPassword, phone, privacyFlag } = req.body;

        if (!username || !email || !password || !verifyPassword || !phone || !privacyFlag) {
          console.error('Missing required fields:', error);
          return res.status(400).json({ message: 'Missing required fields' });
        }

        const newAccount = await CustomerAccount.create({
          username,
          email,
          password,
          verifyPassword,
          phone,
          privacyFlag
        });
    
        return res.status(201).json({
          message: 'Account created successfully',
          data: newAccount
        });
      } catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
}