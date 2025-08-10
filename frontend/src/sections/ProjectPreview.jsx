import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import api from "../utilities/api";

function ProjectPreview() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/projects?limit=4")
      .then(res => setProjects(res.data))
      .catch(err => {
        console.error("Error fetching project preview:", err);
        setError("Failed to load projects. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-base-200">
      <section className="py-10 px-4 sm:px-6 md:px-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 font-heading">
          Tableau Dashboards
        </h2>

        <div className="flex justify-center">
          {loading ? (
            <p className="text-center text-white">Loading projects...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : projects.length === 0 ? (
            <p className="text-center text-gray-400">No dashboards available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 w-full max-w-6xl">
              {projects.map(project => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>

          <div className="text-center mt-8">
            <Link
              to="/projects"
              className="btn btn-outline hover:bg-[#FFFBDE] hover:text-base-200 text-lg md:text-xl rounded-lg font-heading"
            >
              All Dashboards
            </Link>
          </div>
        
      </section>
    </div>
  );
}

export default ProjectPreview;
