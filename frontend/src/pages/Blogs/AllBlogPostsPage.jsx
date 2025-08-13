import React, { useEffect, useState } from "react";
import BlogPostCard from "../../components/BlogPostCard";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utilities/api.js";

import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../store/authSlice.js";

export default function AllBlogPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const blogsResponse = await api.get("/blogs");
        setPosts(blogsResponse.data);
      } catch (err) {
        console.error("Error in fetching blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const handleLogin = () => {
    navigate("/auth/login", { state: { from: location } });
  };


  const handleAddPost = () => {
    if (!isLoggedIn) return handleLogin();
    navigate("/blogs/add");
  };

  const handleDeletePost = (deletedId) => {
    setPosts((prev) => prev.filter((post) => post._id !== deletedId));
  };

  if (loading) {
    return <div className="text-center py-10 text-xl">Loading...</div>;
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold font-heading text-black mt-10 mb-10 text-center">
          All Blog Posts
        </h2>

        <div className="flex flex-wrap gap-4 justify-center mb-10">
          {isLoggedIn && 
              <button
                className="btn btn-outline text-base-200 hover:text-white text-lg sm:text-xl px-6 py-2"
                onClick={handleAddPost}
              >
                Add Post
              </button>
            }
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 pb-20">
        {posts.length === 0 ? (
          <p className="text-lg sm:text-xl text-gray-600 text-center">No blog posts found.</p>
        ) : (
          posts.map((post) => (
            <BlogPostCard
              key={post._id}
              post={post}
              isLoggedIn={isLoggedIn}
              onDelete={handleDeletePost}
            />
          ))
        )}
      </div>
      <div className="flex items-center justify-center mt-10">
        <button
          onClick={() => navigate("/")}
          className="btn text-xl font-body bg-gray-600 text-white rounded-lg px-8 py-3 hover:bg-gray-700 transition"
        >
          Home
        </button>
      </div>
      
    </section>
  );
}
