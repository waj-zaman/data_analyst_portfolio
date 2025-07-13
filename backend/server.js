import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

import connectDB from './utils/db.js';

import authRoutes from './routes/auth.routes.js'
import projects from "./routes/projects.routes.js"
import leetcode from "./routes/leetcode.routes.js"
import codewars from "./routes/codewars.routes.js"
import blogRoutes from "./routes/blog.routes.js"

dotenv.config();
const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(cookieParser());

// Add security middleware in production
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(morgan('common'));
}

// ✅ Set allowed frontend origin from env
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
];



// ✅ Simplified and reliable CORS
app.use(cors({
  origin: function (origin, callback) {
    console.log(process.env.FRONTEND_URL);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Routes
app.use("/api/auth", authRoutes)
app.use("/api/projects", projects)
app.use("/api/leetcode", leetcode)
app.use("/api/codewars", codewars)
app.use("/api/blogs", blogRoutes)

// ✅ Start server
app.listen(port, () => {
  connectDB();
  console.log(`Server running at port: ${port}`);
});
