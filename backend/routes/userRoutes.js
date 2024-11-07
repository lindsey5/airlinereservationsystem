import express from 'express';
import { signupVerificationCode, userLogin, userSignup } from '../controller/userAuthController.js';

const router = express.Router();

router.post('/login', userLogin);
router.post('/signup', userSignup);
router.post('/signup/verification-code', signupVerificationCode);

export default router;