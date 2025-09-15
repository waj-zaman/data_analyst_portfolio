import Projects from "../models/tableau.projects.model.js";
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to normalize GitHub links
const normalizeGithubLink = (link) => {
  if (!link) return "";

  return link
    .replace(/^https?:\/\//, "")   // remove http:// or https://
    .replace(/^www\./, "")         // remove www.
    .replace(/\.com/, "");         // remove .com
};


// Helper function to upload a file to Cloudinary
const uploadToCloudinary = (file, folder = "portfolio_projects") => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result.secure_url);
    });
    stream.end(file.buffer);
  });
};

// CREATE
export const addDashboard = async (req, res) => {
  try {
    const {
      projectTitle,
      datasetName,
      datasetCategory,
      datasetDescription,
      problemStatement,
      analyticalQuestions,
      technologies,
      csvToDB,
      edaWithSQL,
      edaWithPython,
      ingestionAfterCleaning,
      tableauLink,
      githubLink,
    } = req.body;

    const files = req.files || {}; // Expecting multiple files

    if (!projectTitle || !datasetName || !problemStatement || !technologies) {
      return res.status(400).json({ error: "Please enter all the information." });
    }

    const existingTitle = await Projects.findOne({ projectTitle });
    if (existingTitle) {
      return res.status(400).json({ error: "Title already exists." });
    }

    // Upload files if provided
    const reportUrl = files.report ? await uploadToCloudinary(files.report[0]) : "";
    const approachUrl = files.approach ? await uploadToCloudinary(files.approach[0]) : "";
    const imageUrlUploaded = files.imageUrl ? await uploadToCloudinary(files.imageUrl[0]) : "";

    const newProject = new Projects({
      projectTitle,
      datasetName,
      datasetCategory,
      datasetDescription,
      problemStatement,
      analyticalQuestions,
      technologies,
      csvToDB,
      edaWithSQL: normalizeGithubLink(edaWithSQL),
      edaWithPython: normalizeGithubLink(edaWithPython),
      ingestionAfterCleaning,
      tableauLink,
      report: reportUrl,
      approach: approachUrl,
      githubLink,
      imageUrl: imageUrlUploaded,
    });

    await newProject.save();

    res.status(201).json({ message: "Project added successfully.", project: newProject });
  } catch (error) {
    console.error("Error in addDashboard controller:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// READ ALL
export const getAllDashboards = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const projects = await Projects.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error in getAllDashboards controller:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// READ ONE
export const getADashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Projects.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found." });
    res.status(200).json(project);
  } catch (error) {
    console.error("Error in getADashboard controller:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// DELETE
export const deleteDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Projects.findByIdAndDelete(id);
    if (!deletedProject) return res.status(404).json({ error: "Project not found." });
    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error in deleteDashboard controller:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// UPDATE
export const updateDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      projectTitle,
      datasetName,
      datasetCategory,
      datasetDescription,
      problemStatement,
      analyticalQuestions,
      technologies,
      csvToDB,
      edaWithSQL,
      edaWithPython,
      ingestionAfterCleaning,
      tableauLink,
      githubLink,
      steps,
    } = req.body;

    const files = req.files || {};
    const existingProject = await Projects.findById(id);
    if (!existingProject) return res.status(404).json({ error: "Project not found." });

    if (projectTitle && projectTitle !== existingProject.projectTitle) {
      const existingTitle = await Projects.findOne({ projectTitle });
      if (existingTitle) return res.status(400).json({ error: "Title already exists." });
    }

    // Upload files if new ones provided, else keep old
    const reportUrl = files.report ? await uploadToCloudinary(files.report[0]) : existingProject.report;
    const approachUrl = files.approach ? await uploadToCloudinary(files.approach[0]) : existingProject.approach;
    const imageUrlUploaded = files.imageUrl ? await uploadToCloudinary(files.image[0]) : existingProject.imageUrl;

    existingProject.projectTitle = projectTitle || existingProject.projectTitle;
    existingProject.datasetName = datasetName || existingProject.datasetName;
    existingProject.datasetCategory = datasetCategory || existingProject.datasetCategory;
    existingProject.datasetDescription = datasetDescription || existingProject.datasetDescription;
    existingProject.problemStatement = problemStatement || existingProject.problemStatement;
    existingProject.analyticalQuestions = analyticalQuestions || existingProject.analyticalQuestions;
    existingProject.technologies = technologies || existingProject.technologies;
    existingProject.csvToDB = csvToDB || existingProject.csvToDB;
    existingProject.edaWithSQL = edaWithSQL ? normalizeGithubLink(edaWithSQL) : existingProject.edaWithSQL;
    existingProject.edaWithPython = edaWithPython ? normalizeGithubLink(edaWithPython) : existingProject.edaWithPython;
    existingProject.ingestionAfterCleaning = ingestionAfterCleaning || existingProject.ingestionAfterCleaning;
    existingProject.tableauLink = tableauLink || existingProject.tableauLink;
    existingProject.report = reportUrl;
    existingProject.approach = approachUrl;
    existingProject.githubLink = githubLink || existingProject.githubLink;
    existingProject.imageUrl = imageUrlUploaded;

    await existingProject.save();

    res.status(200).json({ message: "Project updated successfully.", project: existingProject });
  } catch (error) {
    console.error("Error in updateDashboard controller:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
