// models/BlogPost.js
import mongoose from 'mongoose';


const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['paragraph', 'image']
  },
  content: {
    type: String,
    required: true
  }
}, {_id: false});

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: "Anonymous",
    },
    contentBlocks: {
      type: [contentBlockSchema],
      required: true,
      validate: [arr => arr.length > 0, "At least one Content block is required"]
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const BlogPost = mongoose.model('Blogpost', blogPostSchema);

export default BlogPost;
