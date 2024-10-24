import express from 'express';
import { create_flight } from '../controller/flightController.js';

const router = express.Router();

router.post('/', create_flight);

export default router;