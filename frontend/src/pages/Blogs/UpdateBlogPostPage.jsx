import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utilities/api.js";

export default function UpdateBlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(true);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);
  const [newImages, setNewImages] = useState([]);

  // ✅ 1. Fetch existing post details
  useEffect(() => {
    api.get(`/blogs/${id}`, { withCredentials: true })
      .then((res) => {
        setTitle(res.data.title || "");
        setAuthor(res.data.author || "");
        setContentBlocks(res.data.contentBlocks || []);
      })
      .catch((err) => console.error("Error fetching post:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center p-10 text-lg">Loading...</div>;
  if (!authorized) return null;

  // ✅ Handlers
  const handleParagraphChange = (index, value) => {
    const updated = [...contentBlocks];
    updated[index].content = value;
    setContentBlocks(updated);
  };

  const handleImageChange = (index, file) => {
    const updated = [...contentBlocks];
    updated[index].content = `NEW_IMAGE_PLACEHOLDER_${newImages.length}`;
    setContentBlocks(updated);
    setNewImages([...newImages, file]);
  };

  const addBlock = (type) => {
    if (type === "paragraph") {
      setContentBlocks([...contentBlocks, { type: "paragraph", content: "" }]);
    } else if (type === "image") {
      setContentBlocks([...contentBlocks, { type: "image", content: `NEW_IMAGE_PLACEHOLDER_${newImages.length}` }]);
      setNewImages([...newImages, null]);
    }
  };

  const removeBlock = (index) => {
    const updated = [...contentBlocks];
    updated.splice(index, 1);
    setContentBlocks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasParagraph = contentBlocks.some(
      (block) => block.type === "paragraph" && block.content.trim() !== ""
    );

    if (!hasParagraph) {
      alert("Please add at least one paragraph to your blog post.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("contentMeta", JSON.stringify(contentBlocks));
      newImages.forEach((file) => {
        if (file) formData.append("images", file);
      });

      await api.put(`/blogs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      alert("Blog post updated successfully!");
      navigate("/blogs");

    } catch (err) {
      console.error("Error updating post:", err);
      alert("Failed to update post: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-screen-md mx-auto p-6 sm:p-8 bg-base-100 shadow-lg rounded-xl space-y-6 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl sm:text-3xl text-center font-bold mb-4">
          Update Blog Post
        </h2>

        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border-2 text-base sm:text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200"
        />

        <input
          type="text"
          placeholder="Author (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border-2 text-base sm:text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200"
        />

        <div className="mt-6 space-y-6">
          {contentBlocks.map((block, index) => (
            <div key={index} className="border-2 rounded-lg p-4 bg-base-200 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-base sm:text-lg font-semibold capitalize">{block.type}</span>
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
                  className="border-2 text-base sm:text-lg px-4 py-2 rounded-lg text-white w-full bg-base-300"
                  placeholder="Write your paragraph..."
                  value={block.content}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  required
                />
              ) : (
                <>
                  {block.content && !block.content.startsWith("NEW_IMAGE_PLACEHOLDER") && (
                    <img
                      src={block.content}
                      alt={`Blog Image`}
                      className="w-full max-h-80 object-cover rounded mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                    className="file-input file-input-ghost w-full"
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          <button
            type="button"
            onClick={() => addBlock("paragraph")}
            className="btn btn-outline text-base-200 hover:text-white text-base sm:text-lg px-4 py-2"
          >
            + Add Paragraph
          </button>
          <button
            type="button"
            onClick={() => addBlock("image")}
            className="btn btn-outline text-base-200 hover:text-white text-base sm:text-lg px-4 py-2"
          >
            + Add Image
          </button>
        </div>

        <button
          type="submit"
          className="text-base sm:text-xl bg-blue-500 mt-10 transition-all text-slate-800 py-2 rounded-xl hover:bg-blue-900 hover:text-white w-full"
        >
          Update Blog Post
        </button>
      </form>
    </div>
  );
}
