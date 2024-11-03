import express from 'express';
import { create_pilot, delete_pilot, get_pilots, isPilotAvailable, update_pilot_data } from '../controller/pilotController.js';
const router = express.Router();

router.post('/', create_pilot);
router.get('/:id/available', isPilotAvailable);
router.get('/pilots', get_pilots);
router.delete('/:id', delete_pilot);
router.put('/:id', update_pilot_data);

export default router;