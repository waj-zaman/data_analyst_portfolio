import express from "express";
import upload from "../utils/multer.js";

import {
  addDashboard,
  updateDashboard,
  deleteDashboard,
  getADashboard,
  getAllDashboards,
} from "../controllers/projects.controllers.js";

import { protectRoute } from "../utils/protectRoute.js";

const router = express.Router();

// Create
router.post(
  "/add",
  protectRoute,
  upload.fields([
    { name: "report", maxCount: 1 },
    { name: "approach", maxCount: 1 },
    { name: "imageUrl", maxCount: 1 },
  ]),
  addDashboard
);

// Update
router.put(
  "/:id",
  protectRoute,
  upload.fields([
    { name: "report", maxCount: 1 },
    { name: "approach", maxCount: 1 },
    { name: "imageUrl", maxCount: 1 },
  ]),
  updateDashboard
);

// Delete
router.delete("/:id", protectRoute, deleteDashboard);

// Read All
router.get("/", getAllDashboards);

// Read Single
router.get("/:id", getADashboard);

export default router;
