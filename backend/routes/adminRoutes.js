import express from 'express';
import { addAdmin, admin_send_verification_code, adminLogin, adminResetPassword, delete_admin, get_admins } from '../controller/adminController.js';
import { adminRequireAuth } from '../middleware/adminRequireAuth.js';
const router = express.Router();

router.post('/', adminRequireAuth, addAdmin);
router.post('/login', adminLogin);
router.get('/admins', adminRequireAuth, get_admins);
router.put('/reset-password', adminResetPassword);
router.post('/forgot-password/code', admin_send_verification_code);
router.delete('/:id', adminRequireAuth, delete_admin);

export default router;