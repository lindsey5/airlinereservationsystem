import express from 'express';
import { userLogin } from '../controller/userAuthController.js';

const router = express.Router('/login', userLogin);


export default router;