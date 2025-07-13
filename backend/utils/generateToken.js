import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (user_id, res) => {
  const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ Boolean
    sameSite: "none",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });
};
