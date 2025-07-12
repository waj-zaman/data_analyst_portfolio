import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utilities/api";

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/blogs/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error("Error fetching post details:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center py-20 text-red-500 text-lg">Post not found.</div>;
  }

  const createdAtFormatted = post.createdAt
    ? new Date(post.createdAt).toLocaleString()
    : "Unknown Date";

  return (
    <section className="flex flex-col items-center text-black px-4 sm:px-6">
      <div className="max-w-4xl w-full my-10 p-6 sm:p-8 bg-gray-600 shadow-lg rounded-xl space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-center">
          {post.title}
        </h2>

        <div className="text-center space-y-1">
          <h3 className="text-lg sm:text-xl text-gray-300">
            Author: {post.author || "Anonymous"}
          </h3>
          <p className="text-sm italic text-gray-400">
            Created on: {createdAtFormatted}
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {post.contentBlocks && post.contentBlocks.length > 0 ? (
            post.contentBlocks.map((block, idx) => (
              <div
                key={idx}
                className="border-2 rounded-lg p-4 bg-base-200 space-y-2"
              >
                {block.type === "paragraph" && (
                  <p className="text-base sm:text-lg text-white">
                    {block.content}
                  </p>
                )}
                {block.type === "image" && (
                  <img
                    src={block.content}
                    alt={`Blog Image ${idx + 1}`}
                    className="w-full max-h-[24rem] object-cover rounded"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic text-center">
              No content available.
            </p>
          )}
        </div>
      </div>

      <button
        className="btn btn-outline mb-10 text-base sm:text-lg px-6 py-2"
        onClick={() => navigate("/blogs")}
      >
        Back to Blog Posts
      </button>
    </section>
  );
}
