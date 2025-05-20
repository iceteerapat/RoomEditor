import express from 'express';
import { create, verify } from '../controllers/CreateAccountController.js';
import { login } from '../controllers/AuthController.js';

const route = express.Router();    

// Create Customer Account
route.post('/createAccount/create', create);
route.get('/createAccount/verify/:token', verify);

// Login
route.post('/login/', login);

export default route;