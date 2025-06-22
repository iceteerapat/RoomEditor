import AccountLogin from "../models/rvAccountLogin.js";
import Account from "../models/rvAccount.js";
import AccountService from "../models/rvAccountService.js";
import Service from "../models/rvService.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import { validator } from "sequelize/lib/utils/validator-extras";
import {emailVerification} from "../services/EmailService.js"
import { formatDateToYMD } from "../../../rv-webf/src/components/DateFormat.js";
import { createCustomerId } from "../services/GenerateCustomerIdService.js";

const createDate = new Date(formatDateToYMD(new Date()));
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

        
        const verifyEmail = 'N';
        const active = 'N';
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const hashedVerifyPassword = await bcrypt.hash(req.body.verifyPassword, 10);

        const newAccountLogin = await AccountLogin.create({
          username,
          email,
          password: hashedPassword,
          verifyPassword: hashedVerifyPassword,
          phone,
          privacyFlag,
          createDate,
          verifyEmail,
          active
        });
        console.log("newAccountLogin created");
        await emailVerification(req.body.email, req.body.username);

        return res.status(200).json({
          message: 'Account created successfully',
          data: newAccountLogin
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

    const recId = 4;
    const service = await Service.findOne({ where: { recId }});

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    const serviceName = service.serviceName;
    const serviceAccess = 'N';
    const serviceId = service.recId;
    const imageGenerated = service.serviceUsage;
    const customerId = await createCustomerId();
    await Account.create({
      customerId,
      email,
      createDate
    })
    console.log("Account created");

    await AccountService.create({
      customerId,
      serviceName,
      serviceAccess,
      serviceId,
      imageGenerated,
      createDate
    })
    console.log("AccountService created");

    await account.save();
    return res.status(200).json({ message: 'Email verified successfully' });

   } catch (error) {
      console.error('Verification email error:', error);
      return res.status(500).json({ message: 'Verification email error' });
   }
}