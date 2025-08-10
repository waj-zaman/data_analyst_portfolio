import axios from "axios";

// Automatically set base URL based on environment
const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000/api"
    : import.meta.env.VITE_API_BASE_URL || "https://data-analyst-portfolio.onrender.com/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // allows sending cookies/auth tokens
});

export default api;
