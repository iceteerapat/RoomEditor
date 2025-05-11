import AccountLogin from "../models/rvAccountLogin.js";

export const createAccount = async(req, res) => {
    try {
        const { items } = req.body;

        if (!items.username || !items.email || !items.password || !items.verifyPassword || !items.phone || !items.privacyFlag) {
          console.error('Missing required fields');
          return res.status(400).json({ message: 'Missing required fields' });
        }
        if(items.verifyPassword !== items.password){
          console.error('Password and Verify Password is not the same');
          return res.status(401).json({ message: 'Password and Verify Password is not the same' });
        }

        const { username, email, password, verifyPassword, phone, privacyFlag } = items;
        const createDate = new Date();

        const newAccount = await AccountLogin.create({
          username,
          email,
          password,
          verifyPassword,
          phone,
          privacyFlag,
          createDate
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