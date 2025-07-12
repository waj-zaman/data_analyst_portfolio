import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  
  const query = `
    {
      matchedUser(username: "${username}") {
        username
        profile {
          ranking
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }    
    }
  `;

  try {
    const response = await axios.post("https://leetcode.com/graphql", { query });
    res.status(200).json(response.data.data.matchedUser);
  } catch (error) {
    console.error("Error in the getLeetCode controller:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

export default router;
