import express from 'express';
import { protectRoute } from '../utils/protectRoute.js';
import { login, logout, session, signup } from '../controllers/auth.controllers.js';

const router = express.Router();

// Sign Up
router.post("/signup", signup);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

// Session check (protected route)
router.get("/session", protectRoute, session);

export default router;
