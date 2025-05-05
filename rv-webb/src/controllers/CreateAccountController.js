import rv_customer_acct from "../models/rv_customer_acct";

export const createAccount = async(req, res) => {
    try {
        const { username, email, password } = req.body;
    
        // Basic validation (you can add more)
        if (!username || !email || !password) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
    
        // Create new account
        const newAccount = await rv_customer_acct.create({
          username,
          email,
          password // ideally hash this before storing
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