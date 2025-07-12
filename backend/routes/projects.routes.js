import express from 'express';
import upload from '../utils/multer.js';

import {
  addProject,
  getAllProjects,
  getAProject,
  deleteProject,
  updateProject
} from '../controllers/projects.controllers.js';

import { protectRoute } from '../utils/protectRoute.js';

const router = express.Router();

// Create
router.post("/add", protectRoute, upload.single('imageUrl'), addProject);

// Update
router.put("/:id", protectRoute, upload.single('imageUrl'), updateProject);

// Delete
router.delete("/:id", protectRoute, deleteProject);

// Read All
router.get("/", getAllProjects);

// Read Single
router.get("/:id", getAProject);

export default router;
