import { create_airplane, get_airplane } from '../controller/airplaneController.js';
import express from 'express';

const router = express.Router();

router.post('/', create_airplane);
router.get('/:id', get_airplane);

export default router;