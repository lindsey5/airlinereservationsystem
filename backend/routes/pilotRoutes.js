import express from 'express';
import { create_pilot, delete_pilot, get_available_pilots, get_pilots, update_pilot_data } from '../controller/pilotController.js';
const router = express.Router();

router.post('/', create_pilot);
router.get('/pilots/available', get_available_pilots);
router.get('/pilots', get_pilots);
router.delete('/:id', delete_pilot);
router.put('/:id', update_pilot_data);

export default router;