import express from 'express';
import { addAdmin } from '../controller/adminController';

const router = express.Router();

router.post('/add-admin', addAdmin)

export default router;