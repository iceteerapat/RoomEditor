import express from 'express';
import { create, verify } from '../controllers/CreateAccountController.js';
import { login, logout, refresh } from '../controllers/AuthController.js';
import { genBasic, genPro, genPremium } from '../services/AiService.js';

const route = express.Router();    

// Create Customer Account
route.post('/createAccount/create', create);
route.get('/createAccount/verify/:token', verify);

// Login
route.post('/login/', login);
route.post('/login/refresh', refresh);
route.post('/login/logout', logout);

//AI Service
route.post('/service/create', genBasic);
// route.post('/service/create', genPro);
// route.post('/service/create', genPremium);

export default route;