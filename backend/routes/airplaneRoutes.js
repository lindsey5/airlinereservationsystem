import { create_airplane, delete_airplane, get_airplane, get_airplanes, get_available_airplanes, update_airplane_data } from '../controller/airplaneController.js';
import express from 'express';
import { adminRequireAuth } from '../middleware/adminRequireAuth.js';
const router = express.Router();

router.post('/', adminRequireAuth, create_airplane);
router.get('/airplanes/available', adminRequireAuth, get_available_airplanes);
router.get('/airplanes', adminRequireAuth, get_airplanes);
router.get('/:id', get_airplane);
router.put('/:id', adminRequireAuth, update_airplane_data);
router.delete('/:id', adminRequireAuth, delete_airplane);

export default router;