import express from "express";
import { protectRoute } from "../utils/protectRoute.js";
import upload from "../utils/multer.js";

import { addWebsite, getWebsite, getAllWebsites, updateWebsite, deleteWebsite } from "../controllers/webDevProjects.controllers.js";

const router = express.Router();

// Add a website
router.post("/add", protectRoute, upload.single('imageUrl'), addWebsite);

// //Read a website
router.get("/:id", getWebsite);

// //Read all Websites
router.get("/", getAllWebsites);

// //Update a Website
router.put("/:id", protectRoute, upload.single('imageUrl'), updateWebsite);

// //Delete a website
router.delete("/:id", protectRoute, deleteWebsite);

export default router;