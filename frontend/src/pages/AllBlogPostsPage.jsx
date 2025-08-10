import React, { useEffect, useState } from "react";
import BlogPostCard from "../components/BlogPostCard";
import { useNavigate, useLocation } from "react-router-dom";
import { checkLoggedin } from "../utilities/sessionCheck";
import api from "../utilities/api.js";

export default function AllBlogPostsPage() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPostsAndAuth = async () => {
      try {
        const [postRes, isLoggedIn] = await Promise.all([
          api.get("/blogs"),
          checkLoggedin(),
        ]);
        setPosts(postRes.data);
        setIsLoggedIn(isLoggedIn);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndAuth();
  }, []);

  const handleLogin = () => {
    navigate("/auth/login", { state: { from: location } });
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      alert("Logged Out Successfully.");
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Logout Failed.");
    }
  };

  const handleAddPost = () => navigate("/blogs/add");

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
          {!isLoggedIn ? (
            <button
              className="btn btn-outline text-base-200 hover:text-white text-lg sm:text-xl px-6 py-2"
              onClick={handleLogin}
            >
              Login
            </button>
          ) : (
            <>
              <button
                className="btn btn-outline text-base-200 hover:text-white text-lg sm:text-xl px-6 py-2"
                onClick={handleAddPost}
              >
                Add Post
              </button>
              <button
                className="btn btn-error bg-red-600 text-white text-lg sm:text-xl px-6 py-2 hover:bg-red-800"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
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
      
    </section>
  );
}
