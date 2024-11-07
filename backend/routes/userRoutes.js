import express from 'express';
import { signupVerificationCode, userSignup } from '../controller/userAuthController.js';

const router = express.Router();
router.post('/signup', userSignup);
router.post('/signup/verification-code', signupVerificationCode);

export default router;