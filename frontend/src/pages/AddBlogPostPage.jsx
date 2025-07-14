import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utilities/api.js";

export default function AddBlogPostPage() {
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);
  const [images, setImages] = useState([]);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        await api.get("/auth/session", { withCredentials: true });
        setAuthorized(true);
      } catch (error) {
        console.error("Not Logged in:", error);
        navigate("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!authorized) return null;

  // Add new block
  const addBlock = (type) => {
    setContentBlocks(prev => [...prev, { type, value: "" }]);
  };

  // Handle changes
  const handleParagraphChange = (index, value) => {
    const updated = [...contentBlocks];
    updated[index].value = value;
    setContentBlocks(updated);
  };

  const handleImageChange = (index, file) => {
    const updated = [...contentBlocks];
    updated[index].value = `IMAGE_PLACEHOLDER_${images.length}`;
    setContentBlocks(updated);
    setImages(prev => [...prev, file]);
  };

  const removeBlock = (index) => {
    const updatedBlocks = [...contentBlocks];
    updatedBlocks.splice(index, 1);
    setContentBlocks(updatedBlocks);

    // also remove corresponding image if it was an image block
    const updatedImages = [];
    let placeholderCounter = 0;
    updatedBlocks.forEach(block => {
      if (block.type === "image") {
        updatedImages.push(images[placeholderCounter]);
        placeholderCounter++;
      }
    });
    setImages(updatedImages);
  };

  // Submit form
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title.trim()) {
    alert("Please provide a title for your blog post.");
    return;
  }

  const hasParagraph = contentBlocks.some(block => block.type === "paragraph" && block.value.trim() !== "");
  if (!hasParagraph) {
    alert("Please add at least one paragraph to your blog post.");
    return;
  }

  // Transform blocks to expected format
  const transformedBlocks = contentBlocks.map(block => ({
    type: block.type,
    content: block.value
  }));

  try {
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("author", author.trim());
    formData.append("contentMeta", JSON.stringify(transformedBlocks));

    images.forEach(file => {
      formData.append("images", file);
    });

    await api.post("/blogs", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    alert("Blog post added successfully!");
    navigate("/blogs");

  } catch (err) {
    console.error("Error adding post:", err);
    alert("Failed to add post: " + (err.response?.data?.error || err.message));
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl md:mx-auto mx-2 p-6 bg-base-100 shadow-lg rounded-xl space-y-6 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-3xl text-center font-bold mb-4">Add New Blog Post</h2>

        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
          required
          className="border-2 text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200"
        />

        <input
          type="text"
          placeholder="Author (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
          className="border-2 text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200"
        />

        <div className="mt-6 space-y-6">
          {contentBlocks.map((block, index) => (
            <div key={index} className="border-2 rounded-lg p-4 bg-base-200 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold capitalize">{block.type}</span>
                <button
                  type="button"
                  className="btn btn-error btn-sm"
                  onClick={() => removeBlock(index)}
                >
                  Remove
                </button>
              </div>

              {block.type === "paragraph" ? (
                <textarea
                  className="border-2 text-lg px-4 py-2 rounded-lg text-white w-full bg-base-300"
                  placeholder="Write your paragraph..."
                  value={block.value}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  required
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e.target.files[0])}
                  required
                  className="file-input file-input-ghost w-full"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          <button
            type="button"
            onClick={() => addBlock("paragraph")}
            className="btn btn-outline text-base-200 hover:text-black hover:bg-white text-white text-lg px-4 py-2"
          >
            + Add Paragraph
          </button>
          <button
            type="button"
            onClick={() => addBlock("image")}
            className="btn btn-outline text-base-200 hover:text-black text-white hover:bg-white text-lg px-4 py-2"
          >
            + Add Image
          </button>
        </div>

        <button
          type="submit"
          className="text-xl bg-blue-500 mt-10 transition-all text-slate-800 py-2 rounded-xl hover:bg-blue-900 hover:text-white w-full"
        >
          Add Blog Post
        </button>
      </form>
    </div>
  );
}
