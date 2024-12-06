import express from 'express';
import { post_verification_code, userLogin, userSignup } from '../controller/userAuthController.js';
import { changeUserPassword, getUser, update_user } from '../controller/userController.js';
import { userRequireAuth } from '../middleware/userRequireAuth.js';

const router = express.Router();

router.get('/', userRequireAuth, getUser);
router.put('/', userRequireAuth, update_user);
router.put('/password', changeUserPassword);
router.post('/login', userLogin);
router.post('/signup', userSignup);
router.post('/verification-code', post_verification_code);

export default router;