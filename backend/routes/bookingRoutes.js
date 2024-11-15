import express from 'express';
import { getScheduledBookings } from '../controller/bookingController.js';
import { userRequireAuth } from '../middleware/userRequireAuth.js';


const router = express.Router();

router.get('/bookings', getScheduledBookings);

export default router;