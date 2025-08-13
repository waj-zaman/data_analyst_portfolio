import express from 'express';
import upload from '../utils/multer.js';

import {
  addDashboard,
  updateDashboard,
  deleteDashboard,
  getADashboard,
  getAllDashboards
} from '../controllers/projects.controllers.js';

import { protectRoute } from '../utils/protectRoute.js';

const router = express.Router();

// Create
router.post("/add", protectRoute, upload.single('imageUrl'), addDashboard);

// Update
router.put("/:id", protectRoute, upload.single('imageUrl'), updateDashboard);

// Delete
router.delete("/:id", protectRoute, deleteDashboard);

// Read All
router.get("/", getAllDashboards);

// Read Single
router.get("/:id", getADashboard);

export default router;
