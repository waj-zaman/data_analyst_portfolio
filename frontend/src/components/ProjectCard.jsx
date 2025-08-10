import React from "react";
import { Link } from "react-router-dom";
import api from "../utilities/api";

function ProjectCard({ project, isLoggedIn, onDelete }) {
  if (!project) return null;

  // Delete handler with confirmation
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    try {
      await api.delete(`/projects/${project._id}`);
      alert("Project deleted successfully!");
      if (onDelete) onDelete(project._id);
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project.");
    }
  };

  return (
    <div
      className="relative group w-full h-80 rounded-xl overflow-hidden shadow-lg"
      style={{
        backgroundImage: `url(${project.imageUrl || "https://placehold.co/400x320/E5E7EB/4B5563?text=No+Image"})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center space-y-3">
        <h2 className="text-white text-3xl font-bold mb-2">{project.title}</h2>

        <div className="flex flex-wrap gap-3 justify-center">
          {/* Always visible View button */}
          <Link
            to={`/projects/${project._id}`}
            className="btn btn-outline text-white border-white hover:bg-white hover:text-black text-lg"
          >
            View Dashboard
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to={`/projects/update/${project._id}`}
                className="bg-blue-500 hover:bg-blue-600 font-body items-center flex text-white px-3 py-1 rounded"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 font-body text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
