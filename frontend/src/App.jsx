import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./index.css";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import AddProjectForm from "./pages/AddProjectForm";
import UpdateProjectPage from "./pages/UpdateProjectPage";   // ✅ ADD THIS
import Login from "./pages/Login";

import Blogs from "./pages/AllBlogPostsPage";
import AddBlog from "./pages/AddBlogPostPage";
import UpdateBlog from "./pages/UpdateBlogPostPage";
import BlogDetail from "./pages/BlogDetail";

import Websites from "./pages/webDev/Websites"
import AddWebsiteForm from "./pages/webDev/AddWebsiteForm";
import UpdateWebsiteForm from "./pages/webDev/UpdateWebsiteForm";
import WebsiteDetail from "./pages/webDev/WebsiteDetail";

function App() {

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBDE]">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/add" element={<AddProjectForm />} />
          <Route path="/projects/update/:id" element={<UpdateProjectPage />} />  {/* ✅ ADD THIS */}
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
