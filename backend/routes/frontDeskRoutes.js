import express from 'express';
import { adminRequireAuth } from '../middleware/adminRequireAuth.js';
import { add_front_desk_agent, delete_front_desk_agent, front_desk_login, get_front_desk_agents } from '../controller/frontDeskController.js';
const router = express.Router();

router.post('/', adminRequireAuth, add_front_desk_agent);
router.post('/login', front_desk_login);
router.get('/front-desks', adminRequireAuth, get_front_desk_agents);
router.delete('/:id', adminRequireAuth, delete_front_desk_agent);

export default router;