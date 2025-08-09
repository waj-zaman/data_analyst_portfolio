import mongoose from "mongoose";


const webDevProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    features: [{
        type: String
    }],
    thumbnail: {
        type: String
    }
},{timestamps: true});


const WebDevProjects = mongoose.model("WebDevProjects", webDevProjectSchema);

export default WebDevProjects;