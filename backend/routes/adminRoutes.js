import express from 'express';
import { addAdmin, adminLogin, delete_admin, get_admins } from '../controller/adminController.js';
import { adminRequireAuth } from '../middleware/adminRequireAuth.js';
const router = express.Router();

router.post('/', adminRequireAuth, addAdmin);
router.post('/login', adminLogin);
router.get('/admins', adminRequireAuth, get_admins);
router.delete('/:id', adminRequireAuth, delete_admin);

export default router;