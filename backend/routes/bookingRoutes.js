import express from 'express';
import { getBooking, getBookings } from '../controller/bookingController.js';
import { userRequireAuth } from '../middleware/userRequireAuth.js';


const router = express.Router();

router.get('/bookings', userRequireAuth, getBookings);
router.get('/:id', getBooking);

export default router;