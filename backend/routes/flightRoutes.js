import express from 'express';
import { create_flight, get_popular_destination, get_flight, search_s, get_available_flights, book_flight } from '../controller/flightController.js';
import { userRequireAuth } from '../middleware/userRequireAuth.js';

const router = express.Router();
flight, get_flight
router.post('/', create_flight);
router.get('/book', userRequireAuth, book_flight);
router.get('/flights', get_flights);
router.get('/flights/available', userRequireAuth, get_available_flights);
router.get('/popular', get_popular_destination);
router.post('/search', userRequireAuth, search_flight);
router.get('/:id', get_flight);

export default router;