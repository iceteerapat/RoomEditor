import express from 'express';

import { createAccount } from '../controllers/CreateAccountController.js';

const route = express();    

route.post('/createAccount/create', createAccount);

export default route;