import express from 'express';
import { 
    create_flight, 
    get_popular_destination,
     get_flight, 
     search_flight, 
     get_available_flights, 
     user_book_flight,
    get_flights, 
    admin_book_flight} from '../controller/flightController.js';
import { userRequireAuth } from '../middleware/userRequireAuth.js';

const router = express.Router();

router.post('/', create_flight);
router.get('/book', userRequireAuth, user_book_flight);
router.post('/book/admin', admin_book_flight);
router.get('/flights', get_flights);
router.get('/flights/available', get_available_flights);
router.get('/popular', get_popular_destination);
router.post('/search', userRequireAuth, search_flight);
router.get('/:id', get_flight);

export default router;