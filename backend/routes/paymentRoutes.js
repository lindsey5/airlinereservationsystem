import express from 'express';
import { get_payment, get_payments } from '../controller/paymentController.js';
const router = express.Router();

router.get('/', get_payment);
router.get('/payments', get_payments);

export default router;