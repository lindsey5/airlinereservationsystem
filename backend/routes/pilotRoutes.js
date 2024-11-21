import express from 'express';
import { create_pilot, delete_pilot, get_available_pilots, get_pilot, get_pilots, update_pilot_data } from '../controller/pilotController.js';
import { adminRequireAuth } from '../middleware/adminRequireAuth.js';
const router = express.Router();

router.post('/', adminRequireAuth, create_pilot);
router.get('/pilots/available', adminRequireAuth, get_available_pilots);
router.get('/pilots', adminRequireAuth, get_pilots);
router.get('/:id', get_pilot);
router.delete('/:id', adminRequireAuth, delete_pilot);
router.put('/:id', adminRequireAuth, update_pilot_data);

export default router;