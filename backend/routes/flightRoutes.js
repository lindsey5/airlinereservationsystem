import express from 'express';
import { create_flight, get_popular_destination, get_flight } from '../controller/flightController.js';

const router = express.Router();

router.post('/', create_flight);
router.get('/popular', get_popular_destination);
router.get('/:id', get_flight);

export default router;