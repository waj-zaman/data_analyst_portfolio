import React, { useState, useEffect } from "react";
import api from "../utilities/api.js";
import { useNavigate } from "react-router-dom";

export default function AddProjectForm() {
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [tableauLink, setTableauLink] = useState("");
  const [steps, setSteps] = useState([""]);
  const [imageUrl, setImageUrl] = useState(null);

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

  useEffect(() => {
    if (!loading && !authorized) {
      navigate("/auth/login");
    }
  }, [loading, authorized, navigate]);

  if (loading) return <div className="text-center p-10">Loading...</div>
  if (!authorized) return null;

  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index) => {
    const updated = [...steps];
    updated.splice(index, 1);
    setSteps(updated);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("technologies", technologies);
    formData.append("githubLink", githubLink);
    formData.append("tableauLink", tableauLink);
    formData.append("imageUrl", imageUrl);
    steps.forEach((step, index) => {
      formData.append(`steps[${index}]`, step);
    });

    await api.post("/projects/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });

    alert("Project added successfully!");
    navigate("/projects");
  } catch (err) {
    console.error("Error adding project:", err);
    alert("Failed to add project: " + (err.response?.data?.error || err.message));
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg md:max-w-2xl bg-base-100 shadow-lg rounded-xl p-6 md:p-8 space-y-6 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl sm:text-3xl text-center font-bold text-white">Add New Project</h2>

        <input
          type="text"
          className="border-2 text-base sm:text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="border-2 text-base sm:text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Project Description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="text"
          className="border-2 text-base sm:text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Technologies (comma separated)"
          value={technologies}
          onChange={(e) => setTechnologies(e.target.value)}
          required
        />

        <input
          type="url"
          className="border-2 text-base sm:text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="GitHub Link"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
        />

        <input
          type="url"
          className="border-2 text-base sm:text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Tableau Link"
          value={tableauLink}
          onChange={(e) => setTableauLink(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="text-base sm:text-lg px-2 py-2 rounded-lg bg-base-200 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onChange={(e) => setImageUrl(e.target.files[0])}
        />

        <div>
          <label className="text-lg sm:text-xl block font-semibold mb-2 text-white">Steps:</label>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  className="border-2 text-base sm:text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder={`Step ${index + 1}`}
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-error"
                    onClick={() => removeStep(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 text-md sm:text-lg rounded-xl bg-slate-700 px-4 py-2 hover:border-2 hover:bg-slate-800 transition-all text-white w-full sm:w-auto"
            onClick={addStep}
          >
            + Add Step
          </button>
        </div>

        <button
          type="submit"
          className="text-base sm:text-lg bg-blue-600 text-slate-800 py-3 rounded-xl hover:bg-blue-900 hover:text-white w-full transition"
        >
          Add Project
        </button>
      </form>
    </div>
  );
}
