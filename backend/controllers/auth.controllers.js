import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

// Signup
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide all the details." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        message: "User created successfully.",
        user: newUser
      });
    } else {
      return res.status(400).json({ error: "Invalid User Data." });
    }
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Invalid email." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid password." });
    }

    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      message: "Login successful.",
      user
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

// Logout
  export const logout = async (req, res) => {
    try {
      res.clearCookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
      });

      return res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      console.error("Logout Error:", error);
      return res.status(500).json({ error: "Internal Server Error." });
    }
  }

// Session check
export const session = (req, res) => {
  if (req.user) { // or req.session.user depending on your session setup
    return res.status(200).json({ loggedIn: true, user: req.user });
  } else {
    return res.status(200).json({ loggedIn: false });
  }
};
