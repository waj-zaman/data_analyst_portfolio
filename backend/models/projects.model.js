import mongoose from "mongoose";


const projectsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    technologies: {
        type: [String],
        required: true
    },
    githubLink: {
        type: String,
        required: false
    },
    tableauLink: {
        type: String,
        required: false
    },
    imageUrl:{
        type:String
    },
    steps: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

const Projects = mongoose.model("Projects", projectsSchema);

export default Projects;