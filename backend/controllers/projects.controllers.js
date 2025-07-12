import Projects from "../models/projects.model.js";
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CREATE
export const addProject = async (req, res) => {
  try {
    const { title, description, technologies, githubLink, tableauLink, steps } = req.body;
    const file = req.file;

    if (!title || !description || !technologies) {
      return res.status(400).json({ error: "Please enter all the information." });
    }

    const existingTitle = await Projects.findOne({ title });
    if (existingTitle) {
      return res.status(400).json({ error: "Title already exists." });
    }

    let imageUrl = "";
    if (file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio_projects' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const newProject = new Projects({
      title,
      description,
      technologies,
      githubLink,
      tableauLink,
      imageUrl,
      steps,
    });

    await newProject.save();

    res.status(201).json({ message: "Project added successfully.", project: newProject });
  } catch (error) {
    console.error("Error in addProject controller:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// READ ALL
export const getAllProjects = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const projects = await Projects.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error in getAllProjects controller:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// READ ONE
export const getAProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Projects.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error in getAProject controller:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// DELETE
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Projects.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error in deleteProject controller:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// UPDATE
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, technologies, githubLink, tableauLink, steps } = req.body;
    const file = req.file;

    const existingProject = await Projects.findById(id);
    if (!existingProject) {
      return res.status(404).json({ error: "Project not found." });
    }

    if (title && title !== existingProject.title) {
      const existingTitle = await Projects.findOne({ title });
      if (existingTitle) {
        return res.status(400).json({ error: "Title already exists." });
      }
    }

    let imageUrl = existingProject.imageUrl;
    if (file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio_projects' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      imageUrl = result.secure_url;
    }

    existingProject.title = title || existingProject.title;
    existingProject.description = description || existingProject.description;
    existingProject.technologies = technologies || existingProject.technologies;
    existingProject.githubLink = githubLink || existingProject.githubLink;
    existingProject.tableauLink = tableauLink || existingProject.tableauLink;
    existingProject.steps = steps || existingProject.steps;
    existingProject.imageUrl = imageUrl;

    await existingProject.save();

    res.status(200).json({ message: "Project updated successfully.", project: existingProject });
  } catch (error) {
    console.error("Error in updateProject controller:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
