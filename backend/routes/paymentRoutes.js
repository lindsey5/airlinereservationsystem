import express from 'express';
import { get_payment } from '../controller/paymentController.js';
const router = express.Router();

router.get('/', get_payment);

export default router;