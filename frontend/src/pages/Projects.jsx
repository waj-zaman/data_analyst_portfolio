import React, { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import api from "../utilities/api.js";
import { useNavigate, useLocation } from 'react-router-dom';
import { checkLoggedin } from "../utilities/sessionCheck.js";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.get("/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching all projects:", err));

    const checkAuth = async () => {
      const loggedIn = await checkLoggedin();
      setIsLoggedIn(loggedIn);
    };

    checkAuth();
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
      console.log("Error logging out:", error);
      alert("Logout Failed.");
    }
  };

  const handleAddProject = () => navigate("/projects/add");

  // ✅ New: Handle deleting a project from the list
  const handleDelete = (id) => {
    setProjects(prevProjects => prevProjects.filter(project => project._id !== id));
  };

  return (
    <section className="py-10 px-4 sm:px-6">
      <h2 className="text-3xl font-bold text-center mb-12 font-heading text-base-200">
        All Dashboards
      </h2>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center items-center pb-10">
        {!isLoggedIn ? (
          <button
            className="btn btn-outline text-base-200 hover:text-white text-lg sm:text-xl px-6 py-3"
            onClick={handleLogin}
          >
            Login
          </button>
        ) : (
          <>
            <button
              className="btn btn-outline text-base-200 hover:text-white text-lg sm:text-xl px-6 py-3"
              onClick={handleAddProject}
            >
              Add Dashboard
            </button>
            <button
              className="btn btn-error bg-red-600 text-black text-lg sm:text-2xl px-6 py-3 hover:bg-red-800 hover:text-slate-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-10 mt-10">
        {projects.length === 0 ? (
          <div>
            <p className="text-lg sm:text-xl text-gray-500 text-center px-4">
              No Projects Found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl w-full px-4">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                isLoggedIn={isLoggedIn}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center py-10 justify-center">
        <button
          onClick={() => window.history.back()}
          className="btn text-xl font-body bg-gray-600 text-white rounded-lg px-8 py-3 hover:bg-gray-700 transition"
        >
          Go Back
        </button>
      </div>
    </section>
  );

}

export default Projects;
