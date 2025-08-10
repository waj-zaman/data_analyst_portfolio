import cloudinary from "../utils/cloudinary.js";
import WebDevProjects from "../models/webdev.projects.model.js";
import mongoose from "mongoose";


// Add A website
export const addWebsite = async (req, res) => {
    try {
        const { title, url, description, features } = req.body;
        const file = req.file;

        if (!title || !url || !description) {
            return res.status(400).json({error: "Please enter All the Details."})
        };

        const existingTitle = await WebDevProjects.findOne({ title });
        if (existingTitle) {
            return res.status(404).json({error: "Title Already exists."})
        }

        let imageUrl = "";
        if (file) {
            const result = await new Promise((reject, resolve) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "portfolio_projects" }, 
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(file.buffer);
            });
            imageUrl = result.secure_url;
        };

        const newWebsite = new WebDevProjects({
            title,
            url,
            description,
            features,
            thumbnail: imageUrl
        });

        await newWebsite.save();

        res.status(201).json({message: "Website Added Successfully.", website: newWebsite})
    } catch (error) {
        console.log("Error in the Add website controller:", error);
        res.status(400).json({ error: "Internal Server error"});
    }
};

// Read One Website
export const getWebsite = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid website ID format." });
        }

        const website = await WebDevProjects.findById(id);

        if (!website) {
            return res.status(404).json({ error: "Website not found." });
        }

        res.status(200).json(website);

    } catch (error) {
        console.error("Error in Get Website Controller:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Read All Websites
export const getAllWebsites = async (req, res) => {
    try {
        const limit = req.query.limit || 0;
        const websites = await WebDevProjects.find()
        .sort({createdAt: -1})
        .limit(limit);

        res.status(200).json(websites);
    } catch (error) {
        console.log("Error in the Get All websites controller: ", error);
        res.status(500).json({error: "Internal Server Error."});
    }
};

// Update A website
export const updateWebsite = async (req,res) => {
    try {
        const { id } = req.params;
        const { title, url, description, features } = req.body;
        const file = req.file;

        const existingWebsite = await WebDevProjects.findById(id);
        if (!existingWebsite) {
            return res.status(404).json({error: "Website not Found."})
        };

        if (title && title !== existingWebsite.title) {
            const existingTitle = await WebDevProjects.findOne({ title });
            if (existingTitle) {
                return res.status(400).json({error: "Title Already Exists."})
            }
        };

        let imageUrl = existingWebsite.thumbnail;
        if (file) {
            const result = await new Promise((reject, resolve) => {
                const resut = cloudinary.uploader.upload_stream(
                    { folder: "portfolio_projects" }, 
                    (error, result) => {
                        if (error) reject (error);
                        else resolve(result);
                    }
                );
                stream.end(file.buffer);
            });
            imageUrl = result.secure_url
        };

        existingWebsite.title = title || existingWebsite.title;
        existingWebsite.url = url || existingWebsite.url;
        existingWebsite.description = description || existingWebsite.description;
        existingWebsite.features = features || existingWebsite.features;
        existingWebsite.thumbnail = imageUrl || existingWebsite.thumbnail;

        await existingWebsite.save();

        res.status(200).json({message: "Project Updated Successfully.",website: existingWebsite});

    } catch (error) {
        console.log("Error in the update website controller: ", error);
        res.status(500).json({error: "Internal Server Error."})
    }
};

// Delete A website
export const deleteWebsite = async (req,res) => {
    try {
        const { id } = req.params;

        const existingWebsite = await WebDevProjects.findById(id);
        if (!existingWebsite) {
            return res.status(404).json({error: "Website not found."})
        };

        const deletedWebsite = await WebDevProjects.findByIdAndDelete(id);
        
        res.status(200).json({message: "Website deleted successfully."})
    } catch (error) {
        console.log("Error in the delete website controller: ", error);
        res.status(500).json({error: "Internal server error."})
    }
};