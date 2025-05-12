import express from 'express';

import { create, verify } from '../controllers/CreateAccountController.js';

const route = express();    

route.post('/createAccount/create', create);
route.get('/verify-email/:token', verify)
export default route;