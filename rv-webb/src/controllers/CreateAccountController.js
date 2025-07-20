import Account from "../models/Account.js";
import Service from "../models/Service.js";
import Product from "../models/Product.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import Stripe from "stripe";

import { validator } from "sequelize/lib/utils/validator-extras";
import {emailVerification} from "../services/EmailService.js"
import { formatDateToYMD } from "../../../rv-webf/src/components/DateFormat.js";
import { createCustomerId } from "../services/GenerateCustomerIdService.js";

const createDate = new Date(formatDateToYMD(new Date()));
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const create = async(req, res) => {
    try {
        const items = req.body;
        const { username, email, password, verifyPassword, phone, privacyFlag } = items;
        if(!req.body){
          return res.status(500).json({ message: 'Request body empty' });
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

        const existingEmail = await Account.findOne({ where: { email } })
        if(existingEmail){
          console.error('Email is already used');
          return res.status(400).json({ message: 'Email is already used' });
        }

        const existingUsername = await Account.findOne({ where: { username } })
        if(existingUsername){
          console.error('Username is already used');
          return res.status(400).json({ message: 'Username is already used' });
        }

        const verifyEmail = 'N';
        const active = 'N';
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const hashedVerifyPassword = await bcrypt.hash(req.body.verifyPassword, 10);
        const customerId = await createCustomerId();

        const newAccount = await Account.create({
          email,
          customerId,
          username,
          password: hashedPassword,
          verifyPassword: hashedVerifyPassword,
          phone,
          verifyEmail,
          active,
          createDate,
          privacyFlag
        });
        console.log("Account created");
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
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const account = await Account.findOne({ where: { email } });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    account.verifyEmail = 'Y';
    account.active = 'Y';

    const checkService = await Service.findOne({ where: { customerId: account.customerId }});
    if(checkService){
      console.log("Already create service for account: ", checkService.customerId);
      return;
    }

    const product = await Product.findOne({ where: { recId: 1 }});
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productName = product.productName;
    const productAccess = 'T';
    const productId = product.recId;
    const credits = product.creditGrant;
    const customerId = account.customerId;
    const customer = await stripe.customers.create({ email: email, metadata: {customerId} });
    const stripeCustomerId = customer.id;

    await Service.create({
      customerId,
      stripeCustomerId,
      productName,
      productAccess,
      productId,
      credits,
      createDate
    })
    console.log(`Service created for account ${account.email}`);
    await account.save();
    return res.status(200).json({ message: 'Email verified successfully' });

   } catch (error) {
      console.error('Verification email error:', error);
      return res.status(500).json({ message: 'Verification email error' });
   }
}