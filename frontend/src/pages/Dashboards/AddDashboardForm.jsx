import React, { useState, useEffect } from "react";
import api from "../../utilities/api.js";
import { useNavigate } from "react-router-dom";

export default function AddDashboardForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Schema fields
  const [projectTitle, setProjectTitle] = useState("");
  const [datasetName, setDatasetName] = useState("");
  const [datasetCategory, setDatasetCategory] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [analyticalQuestions, setAnalyticalQuestions] = useState([""]);
  const [technologies, setTechnologies] = useState([""]);
  const [csvToDB, setCsvToDB] = useState("");
  const [edaWithSQL, setEdaWithSQL] = useState("");
  const [ingestionAfterCleaning, setIngestionAfterCleaning] = useState("");
  const [edaWithPython, setEdaWithPython] = useState("");
  const [tableauLink, setTableauLink] = useState("");
  const [report, setReport] = useState(null); // file
  const [approach, setApproach] = useState(null); // file
  const [githubLink, setGithubLink] = useState("");
  const [imageUrl, setImageUrl] = useState(null); // file

  useEffect(() => {
    setLoading(false);
  }, [navigate]);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  // Helpers for arrays
  const handleArrayChange = (setter, arr, index, value) => {
    const updated = [...arr];
    updated[index] = value;
    setter(updated);
  };

  const addArrayItem = (setter, arr) => setter([...arr, ""]);
  const removeArrayItem = (setter, arr, index) => {
    const updated = [...arr];
    updated.splice(index, 1);
    setter(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("projectTitle", projectTitle);
      formData.append("datasetName", datasetName);
      formData.append("datasetCategory", datasetCategory);
      formData.append("datasetDescription", datasetDescription);
      formData.append("problemStatement", problemStatement);

      analyticalQuestions.forEach((q, i) =>
        formData.append(`analyticalQuestions[${i}]`, q)
      );
      technologies.forEach((t, i) =>
        formData.append(`technologies[${i}]`, t)
      );

      formData.append("csvToDB", csvToDB);
      formData.append("edaWithSQL", edaWithSQL);
      formData.append("ingestionAfterCleaning", ingestionAfterCleaning);
      formData.append("edaWithPython", edaWithPython);
      formData.append("tableauLink", tableauLink);
      formData.append("githubLink", githubLink);

      // ✅ Files
      // ✅ Only append real files (skip empty/null)
      if (report instanceof File) {
        formData.append("report", report);
      }
      if (approach instanceof File) {
        formData.append("approach", approach);
      }
      if (imageUrl instanceof File) {
        formData.append("imageUrl", imageUrl); // must match schema name exactly
      }


      await api.post("/dashboards/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Project added successfully!");
      navigate("/dashboards");
    } catch (err) {
      console.error("Error adding project:", err);
      alert(
        "Failed to add project: " +
        (err.response?.data?.error || err.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-200 px-4">
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
          }
        }}
        className="w-full max-w-2xl bg-base-100 shadow-lg rounded-xl p-6 md:p-8 space-y-3 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl sm:text-3xl text-center font-bold text-white">
          Add New Project
        </h2>

        {/* Project Title */}
        <label className="block text-white font-semibold pt-3">Project Title</label>
        <input
          type="text"
          placeholder="Project Title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          required
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        {/* Dataset Details */}
        <label className="block text-white font-semibold">Dataset Name</label>
        <input
          type="text"
          placeholder="Dataset Name"
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">Dataset Category</label>
        <input
          type="text"
          placeholder="Dataset Category"
          value={datasetCategory}
          onChange={(e) => setDatasetCategory(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">Dataset Description</label>
        <textarea
          placeholder="Dataset Description"
          value={datasetDescription}
          onChange={(e) => setDatasetDescription(e.target.value)}
          rows={3}
          className="textarea textarea-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        {/* Problem Statement */}
        <label className="block text-white font-semibold">Problem Statement</label>
        <textarea
          placeholder="Problem Statement"
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          rows={3}
          className="textarea textarea-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        {/* Analytical Questions */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Analytical Questions
          </label>
          {analyticalQuestions.map((q, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={q}
                placeholder={`Question ${i + 1}`}
                onChange={(e) =>
                  handleArrayChange(
                    setAnalyticalQuestions,
                    analyticalQuestions,
                    i,
                    e.target.value
                  )
                }
                className="input input-bordered w-full text-white bg-base-200"
                disabled={submitting}
              />
              {analyticalQuestions.length > 1 && (
                <button
                  type="button"
                  className="btn btn-error btn-sm"
                  onClick={() =>
                    removeArrayItem(
                      setAnalyticalQuestions,
                      analyticalQuestions,
                      i
                    )
                  }
                  disabled={submitting}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-primary mt-2"
            onClick={() =>
              addArrayItem(setAnalyticalQuestions, analyticalQuestions)
            }
            disabled={submitting}
          >
            + Add Question
          </button>
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-white font-semibold mb-2">Technologies</label>
          {technologies.map((t, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={t}
                placeholder={`Technology ${i + 1}`}
                onChange={(e) =>
                  handleArrayChange(setTechnologies, technologies, i, e.target.value)
                }
                className="input input-bordered w-full text-white bg-base-200"
                disabled={submitting}
              />
              {technologies.length > 1 && (
                <button
                  type="button"
                  className="btn btn-error btn-sm"
                  onClick={() =>
                    removeArrayItem(setTechnologies, technologies, i)
                  }
                  disabled={submitting}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-primary mt-2"
            onClick={() => addArrayItem(setTechnologies, technologies)}
            disabled={submitting}
          >
            + Add Technology
          </button>
        </div>

        {/* Links */}
        <label className="block text-white font-semibold">CSV to DB Link</label>
        <input
          type="url"
          placeholder="CSV To DB Link"
          value={csvToDB}
          onChange={(e) => setCsvToDB(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">EDA with SQL Notebook</label>
        <input
          type="url"
          placeholder="EDA with SQL Notebook Link"
          value={edaWithSQL}
          onChange={(e) => setEdaWithSQL(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">
          Ingestion After Cleaning Notebook
        </label>
        <input
          type="url"
          placeholder="Ingestion After Cleaning Notebook Link"
          value={ingestionAfterCleaning}
          onChange={(e) => setIngestionAfterCleaning(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">EDA with Python Notebook</label>
        <input
          type="url"
          placeholder="EDA with Python Notebook Link"
          value={edaWithPython}
          onChange={(e) => setEdaWithPython(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">Tableau Link</label>
        <input
          type="url"
          placeholder="Tableau Link"
          value={tableauLink}
          onChange={(e) => setTableauLink(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        {/* File Uploads */}
        <label className="block text-white font-semibold">Upload Report (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setReport(e.target.files[0])}
          className="file-input file-input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">Upload Solution Approach (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setApproach(e.target.files[0])}
          className="file-input file-input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">GitHub Link</label>
        <input
          type="url"
          placeholder="GitHub Link"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">Upload Project Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageUrl(e.target.files[0])}
          className="file-input file-input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        {/* Buttons */}
        <button
          type="submit"
          className={`btn w-full ${submitting ? "btn-disabled bg-gray-500" : "btn-primary"
            }`}
          disabled={submitting}
        >
          {submitting ? "Uploading…" : "Add Project"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboards")}
          className="btn btn-secondary w-full"
          disabled={submitting}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
