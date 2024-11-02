import { create_airplane, delete_airplane, get_airplane, get_airplanes, update_airplane_data } from '../controller/airplaneController.js';
import express from 'express';

const router = express.Router();

router.post('/', create_airplane);
router.get('/airplanes', get_airplanes);
router.get('/:id', get_airplane);
router.put('/:id', update_airplane_data);
router.delete('/:id', delete_airplane);

export default router;