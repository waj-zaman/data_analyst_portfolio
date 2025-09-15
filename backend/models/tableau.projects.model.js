import mongoose from "mongoose";


const projectsSchema = new mongoose.Schema({
    projectTitle: {
        type: String,
        required: true,
        unique: true
    },
    datasetName: { type: String },
    datasetCategory: { type: String },
    datasetDescription: { type: String },
    problemStatement: { type: String },
    analyticalQuestions: { type: [String] },
    technologies: { type: [String] },
    csvToDB: { type: String },
    edaWithSQL: { type: String },
    ingestionAfterCleaning: { type: String },
    edaWithPython: { type: String },
    tableauLink: { type: String },
    report: { type: String },
    approach: { type: String },
    githubLink: { type: String },
    imageUrl: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Projects = mongoose.model("Projects", projectsSchema);

export default Projects;