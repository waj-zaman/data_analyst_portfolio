import BlogPost from "../models/blogs.model.js";
import cloudinary from "../utils/cloudinary.js";

// CREATE BLOG POST
export const createPost = async (req, res) => {
  try {
    const { title, author } = req.body;

    let contentMeta;
    try {
      contentMeta = JSON.parse(req.body.contentMeta);
    } catch (parseError) {
      console.error("Invalid contentMeta JSON:", parseError);
      return res.status(400).json({ error: "Invalid contentMeta JSON." });
    }

    if (!title || !Array.isArray(contentMeta) || contentMeta.length === 0) {
      return res.status(400).json({ error: "Title and at least one content block are required." });
    }

    const files = req.files || [];
    const uploadedImageUrls = [];

    // Upload images
    for (const file of files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(file.buffer);
      });
      uploadedImageUrls.push(result.secure_url);
    }

    // Replace placeholders in contentMeta
    let imageIndex = 0;
    const processedContentBlocks = contentMeta.map(block => {
      if (block.type === 'image') {
        if (imageIndex >= uploadedImageUrls.length) {
          throw new Error("Not enough images uploaded to match placeholders.");
        }
        return { type: 'image', content: uploadedImageUrls[imageIndex++] };
      }
      if (block.type === 'paragraph') {
        if (!block.content || !block.content.trim()) {
          throw new Error("Paragraph blocks must have non-empty content.");
        }
        return { type: 'paragraph', content: block.content.trim() };
      }
      throw new Error(`Invalid content block type: ${block.type}`);
    });

    const newPost = new BlogPost({
      title: title.trim(),
      author: author?.trim() || "Anonymous",
      contentBlocks: processedContentBlocks,
    });

    await newPost.save();

    res.status(201).json({ message: "Blog post created successfully.", post: newPost });
  } catch (err) {
    console.error("Error in createPost:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// GET ALL POSTS
export const getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error in getAllPosts:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// GET SINGLE POST
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error("Error in getPostById:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const { title, author } = req.body;

    if (!title || !req.body.contentMeta) {
      return res.status(400).json({ error: "Title and contentMeta are required." });
    }

    let contentMeta;
    try {
      contentMeta = JSON.parse(req.body.contentMeta);
    } catch (e) {
      console.error("Invalid JSON in contentMeta:", e);
      return res.status(400).json({ error: "Invalid JSON in contentMeta." });
    }

    if (!Array.isArray(contentMeta) || contentMeta.length === 0) {
      return res.status(400).json({ error: "At least one content block is required." });
    }

    const files = req.files || [];
    const uploadedImageUrls = [];

    for (const file of files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(file.buffer);
      });
      uploadedImageUrls.push(result.secure_url);
    }

    let imageIndex = 0;
    const processedContentBlocks = contentMeta.map(block => {
      if (block.type === 'image') {
        if (block.content.startsWith('NEW_IMAGE_PLACEHOLDER')) {
          if (imageIndex >= uploadedImageUrls.length) {
            throw new Error("Not enough new images uploaded to match placeholders.");
          }
          return { type: 'image', content: uploadedImageUrls[imageIndex++] };
        }
        return { type: 'image', content: block.content };
      }
      if (block.type === 'paragraph') {
        if (!block.content || !block.content.trim()) {
          throw new Error("Paragraph blocks must have non-empty content.");
        }
        return { type: 'paragraph', content: block.content.trim() };
      }
      throw new Error(`Invalid content block type: ${block.type}`);
    });

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        author: author?.trim() || "Anonymous",
        contentBlocks: processedContentBlocks,
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json({ message: "Post updated successfully.", post: updatedPost });
  } catch (err) {
    console.error("Error in updatePost:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    console.error("Error in deletePost:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
