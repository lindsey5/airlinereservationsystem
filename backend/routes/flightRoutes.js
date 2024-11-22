import express from 'express';
import { 
    create_flight, 
     get_flight, 
     search_flight, 
     get_available_flights, 
     user_book_flight,
    get_flights, 
    frontdesk_book_flight,
    completeFlight,
    cancelFlight,
    updateFlightStatus} from '../controller/flightController.js';
import { userRequireAuth } from '../middleware/userRequireAuth.js';
import { adminRequireAuth } from '../middleware/adminRequireAuth.js';

const router = express.Router();

router.post('/', adminRequireAuth, create_flight);
router.put('/:id', adminRequireAuth, updateFlightStatus);
router.put('/cancel', cancelFlight);
router.put('/:id/complete', adminRequireAuth, completeFlight);
router.get('/book', userRequireAuth, user_book_flight);
router.post('/book/frontdesk', frontdesk_book_flight);
router.get('/flights', get_flights);
router.get('/flights/available', get_available_flights);
router.post('/search', search_flight);
router.get('/:id', get_flight);

export default router;