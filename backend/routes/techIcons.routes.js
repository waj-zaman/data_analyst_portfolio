import express from 'express';
import TechIcon from '../models/techIcons.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const icons = await TechIcon.find();
    res.json(icons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch icons' });
  }
});

export default router;
