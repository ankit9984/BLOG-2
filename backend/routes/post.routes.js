import express from 'express';
import { protectRoutes } from '../middleware/protectRoutes.js';
import { createPost, deletePost, updatePost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/', protectRoutes, createPost);
router.post('/update/:id', protectRoutes, updatePost);
router.delete('/delete/:id', protectRoutes, deletePost);

export default router;