import express from 'express';
import { chat_a_bot, createPaymentLink, get_popular_destination, getCities, getCountries, getDashboardDetails, getUser, verifyCode } from '../controller/apiController.js';
import { userRequireAuth } from '../middleware/userRequireAuth.js';
import { adminRequireAuth } from '../middleware/adminRequireAuth.js';

const router = express.Router();

router.post('/chat', chat_a_bot);
router.get('/popular-destinations', get_popular_destination);
router.post('/verify-code', verifyCode);
router.get('/countries', getCountries);
router.get('/cities/:country', getCities)
router.post('/payment-link', userRequireAuth, createPaymentLink)
router.get('/user', getUser);
router.get('/details/dashboard', adminRequireAuth, getDashboardDetails);

export default router;