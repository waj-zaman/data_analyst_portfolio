import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./index.css";

import { useDispatch, useSelector } from "react-redux";
import { loadSession, selectAuthInitialized } from "./store/authSlice";

import Home from "./pages/Home";
import Dashboards from "./pages/Dashboards/Dashboards";
import DashboardDetail from "./pages/Dashboards/DashboardDetail";
import AddDashboardForm from "./pages/Dashboards/AddDashboardForm";
import UpdateDashboardPage from "./pages/Dashboards/UpdateDashboardPage";   // ✅ ADD THIS
import Login from "./pages/Login";

import Blogs from "./pages/Blogs/AllBlogPostsPage";
import AddBlog from "./pages/Blogs/AddBlogPostForm";
import UpdateBlog from "./pages/Blogs/UpdateBlogPostPage";
import BlogDetail from "./pages/Blogs/BlogDetail";

import Websites from "./pages/webDev/Websites"
import AddWebsiteForm from "./pages/webDev/AddWebsiteForm";
import UpdateWebsiteForm from "./pages/webDev/UpdateWebsiteForm";
import WebsiteDetail from "./pages/webDev/WebsiteDetail";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectAuthInitialized);

  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  if(!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading session...
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBDE]">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="/dashboards/:id" element={<DashboardDetail />} />
          <Route path="/dashboards/add" element={<AddDashboardForm />} />
          <Route path="/dashboards/update/:id" element={<UpdateDashboardPage />} />  {/* ✅ ADD THIS */}
          <Route path="/auth/login" element={<Login />} />

          {/* Blog Routes */}
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/add" element={<AddBlog />} />
          <Route path="/blogs/update/:id" element={<UpdateBlog />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />

          {/* Website routes */}
          <Route path="/websites" element={<Websites />} />
          <Route path="/websites/add" element={<AddWebsiteForm />}/>
          <Route path="/websites/update/:id" element={<UpdateWebsiteForm />}/>
          <Route path="/websites/:id" element={<WebsiteDetail />}/>
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
