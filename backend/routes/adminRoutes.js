import express from 'express';
import { addAdmin, delete_admin, get_admins } from '../controller/adminController.js';
const router = express.Router();

router.post('/', addAdmin)
router.get('/admins', get_admins);
router.delete('/:id', delete_admin);

export default router;