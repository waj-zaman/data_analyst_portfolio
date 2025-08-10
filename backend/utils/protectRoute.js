import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ error: "No token found." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      console.log("Invalid token");
      return res.status(401).json({ error: "Unauthorized token." });
    }

    const user = await User.findById(decoded.user_id).select("-password");

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
