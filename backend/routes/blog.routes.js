// routes/blogRoutes.js
import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} from '../controllers/blog.controllers.js';
import { protectRoute } from '../utils/protectRoute.js';
import upload from '../utils/multer.js';

const router = express.Router();

// POST /api/posts
router.post('/',protectRoute, upload.array('images'), createPost);

// GET /api/posts
router.get('/', getAllPosts);

// GET /api/posts/:id
router.get('/:id', getPostById);

// PUT /api/posts/:id
router.put('/:id',protectRoute, upload.array('images'), updatePost);

// DELETE /api/posts/:id
router.delete('/:id', protectRoute, deletePost);

export default router;
