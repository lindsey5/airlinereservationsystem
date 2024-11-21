import express from 'express';
import { create_airport, delete_airport, get_airports, get_pagination_airports, update_airport_data } from '../controller/airportController.js';
import { adminRequireAuth } from '../middleware/adminRequireAuth.js';
const router = express.Router();

router.post('/', adminRequireAuth, create_airport);
router.get('/airports', adminRequireAuth, get_airports);
router.get('/airports/pagination', adminRequireAuth, get_pagination_airports);
router.delete('/:id', adminRequireAuth, delete_airport);
router.put('/:id', adminRequireAuth, update_airport_data);

export default router;