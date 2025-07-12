import React from "react";
import { Link } from "react-router-dom";
import api from "../utilities/api";

export default function BlogPostCard({ post, isLoggedIn, onDelete }) {
  if (!post) return null;

  const blocks = post.contentBlocks ?? [];

  // Combine all paragraphs into one string for preview
  const combinedParagraphs = blocks
    .filter(block => block.type === "paragraph")
    .map(block => block.content)
    .join(" ");

  const previewText =
    combinedParagraphs.length > 100
      ? combinedParagraphs.slice(0, 100) + "..."
      : combinedParagraphs;

  // Format createdAt date
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Handle Delete with confirmation
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this blog post?");
    if (!confirmed) return;

    try {
      await api.delete(`/blogs/${post?._id}`);
      alert("Blog post deleted successfully!");
      if (onDelete) onDelete(post._id);
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete blog post.");
    }
  };

  return (
    <div className="max-w-4xl w-full border rounded-lg shadow p-4 mb-4 bg-white">
      <h2 className="text-2xl font-bold mb-2 font-heading text-gray-800">{post.title}</h2>

      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Author:</span> {post.author || "Anonymous"}
      </p>

      {formattedDate && (
        <p className="text-gray-500 text-sm mb-2">
          <span className="font-semibold">Posted on:</span> {formattedDate}
        </p>
      )}

      <div className="mt-4">
        {previewText ? (
          <p className="text-gray-800">{previewText}</p>
        ) : (
          <p className="text-gray-400 italic">No preview available.</p>
        )}
      </div>

      <div className="flex gap-3 mt-4 flex-wrap justify-center">
        <Link
          to={`/blogs/${post._id}`}
          className="border-black border  hover:bg-black hover:text-white transition-all  text-black px-3 py-1 rounded"
        >
          View Blog Post
        </Link>

        {isLoggedIn && (
          <>
            <Link
              to={`/blogs/update/${post._id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
