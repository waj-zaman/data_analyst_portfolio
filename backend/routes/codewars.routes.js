import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const response = await axios.get(`https://www.codewars.com/api/v1/users/${username}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in the Codewars controller:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

export default router;
