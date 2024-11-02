import express from 'express';
import { create_flight, get_popular_destination, get_flight, search_flight, get_flights } from '../controller/flightController.js';

const router = express.Router();

router.post('/', create_flight);
router.get('/flights', get_flights);
router.get('/popular', get_popular_destination);
router.post('/search', search_flight);
router.get('/:id', get_flight);

export default router;