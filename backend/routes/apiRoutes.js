import express from 'express';
import { createPaymentLink, getCities, getCountries, getUser, verifyCode } from '../controller/apiController.js';
import { userRequireAuth } from '../middleware/userRequireAuth.js';

const router = express.Router();

router.post('/verify-code', verifyCode);
router.get('/countries', getCountries)
router.get('/cities/:country', getCities)
router.post('/payment-link', userRequireAuth, createPaymentLink)
router.get('/user', getUser);

export default router;