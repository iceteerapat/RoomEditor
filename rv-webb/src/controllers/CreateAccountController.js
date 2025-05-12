import AccountLogin from "../models/rvAccountLogin.js";
import { validator } from "sequelize/lib/utils/validator-extras";
import {emailVerification} from "../services/EmailService.js"

export const create = async(req, res) => {
    try {
        const items = req.body;
        const { username, email, password, verifyPassword, phone, privacyFlag } = items;
        if(!req.body){
          console.log("req.body: ", req.body)
          return res.status(403).json({ message: 'Request body empty' });
        }
        if (!items.username || !items.email || !items.password || !items.verifyPassword || !items.phone || !items.privacyFlag) {
          console.error('Missing required fields');
          return res.status(400).json({ message: 'Missing required fields' });
        }
        
        if(items.password.length < 8){
          console.error('The password needs to be at least 8 characters long');
          return res.status(400).json({ message: 'The password needs to be at least 8 characters long' });
        }

        if(items.verifyPassword !== items.password){
          console.error('Password and Verify Password is not the same');
          return res.status(400).json({ message: 'Password and Verify Password is not the same' });
        }
        
        if (!validator.isEmail(items.email)) {
          console.error('Invalid email format');
          return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingEmail = await AccountLogin.findOne({ where: { email } })
        if(existingEmail){
          console.error('Email is already used');
          return res.status(400).json({ message: 'Email is already used' });
        }

        const existingUsername = await AccountLogin.findOne({ where: { username } })
        if(existingUsername){
          console.error('Username is already used');
          return res.status(400).json({ message: 'Username is already used' });
        }

        const createDate = new Date();
        const verifyEmail = 'N';
        const active = 'N';

        const newAccount = await AccountLogin.create({
          username,
          email,
          password,
          verifyPassword,
          phone,
          privacyFlag,
          createDate,
          verifyEmail,
          active
        });

        await emailVerification(req.body.email, req.body.username);

        return res.status(200).json({
          message: 'Account created successfully',
          data: newAccount
        });
      } catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
}

export const verify = async(req, res) => {

  const { token } = req.params;
  console.log('Received token:', token);
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const account = await AccountLogin.findOne({ where: { email } });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    account.verifyEmail = 'Y';
    account.active = 'Y';
    await account.save();

    return res.status(200).json({ message: 'Email verified successfully' });

   } catch (error) {

   }
}