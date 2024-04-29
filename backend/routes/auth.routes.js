import express from 'express';
import { getProfile, login, logout, signup } from '../controllers/auth.controller.js';
import { protectRoutes } from '../middleware/protectRoutes.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/',protectRoutes ,getProfile)

export default router;