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
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());

// Add production security middleware
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(morgan('common'));
}

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/projects", projects)
app.use("/api/leetcode", leetcode)
app.use("/api/codewars", codewars)
app.use("/api/blogs", blogRoutes)

// Server
app.listen(port, () => {
    connectDB();
    console.log(`Server running at port: ${port}`)
});
