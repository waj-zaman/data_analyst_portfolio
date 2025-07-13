import axios from "axios";

// Use Vite environment variable
const baseURL = import.meta.env.VITE_API_BASE_URL;

console.log("Resolved BaseURL:", baseURL);

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default api;
