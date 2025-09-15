import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utilities/api.js";

export default function UpdateDashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [projectTitle, setProjectTitle] = useState("");
  const [datasetName, setDatasetName] = useState("");
  const [datasetCategory, setDatasetCategory] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [analyticalQuestions, setAnalyticalQuestions] = useState([""]);
  const [technologies, setTechnologies] = useState([""]);
  const [csvToDB, setCsvToDB] = useState("");
  const [edaWithSQL, setEdaWithSQL] = useState("");
  const [edaWithPython, setEdaWithPython] = useState("");
  const [ingestionAfterCleaning, setIngestionAfterCleaning] = useState("");
  const [tableauLink, setTableauLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [report, setReport] = useState(null); // new file
  const [approach, setApproach] = useState(null); // new file
  const [imageUrl, setImageUrl] = useState(null); // new file

  // Existing file URLs for preview
  const [existingReport, setExistingReport] = useState("");
  const [existingApproach, setExistingApproach] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  useEffect(() => {
    api.get(`/dashboards/${id}`)
      .then((res) => {
        const data = res.data.project;

        setProjectTitle(data.projectTitle || "");
        setDatasetName(data.datasetName || "");
        setDatasetCategory(data.datasetCategory || "");
        setDatasetDescription(data.datasetDescription || "");
        setProblemStatement(data.problemStatement || "");
        setAnalyticalQuestions(data.analyticalQuestions || [""]);
        setTechnologies(data.technologies || [""]);
        setCsvToDB(data.csvToDB || "");
        setEdaWithSQL(data.edaWithSQL || "");
        setEdaWithPython(data.edaWithPython || "");
        setIngestionAfterCleaning(data.ingestionAfterCleaning || "");
        setTableauLink(data.tableauLink || "");
        setGithubLink(data.githubLink || "");
        setExistingReport(data.report || "");
        setExistingApproach(data.approach || "");
        setExistingImageUrl(data.imageUrl || "");
      })
      .catch((err) => console.error("Error fetching project:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  // Helpers for array fields
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
      formData.append("edaWithPython", edaWithPython);
      formData.append("ingestionAfterCleaning", ingestionAfterCleaning);
      formData.append("tableauLink", tableauLink);
      formData.append("githubLink", githubLink);

      // File uploads
      if (report) formData.append("report", report);
      if (approach) formData.append("solutionApproach", approach);
      if (imageUrl) formData.append("image", imageUrl);

      await api.put(`/dashboards/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Project updated successfully!");
      navigate("/dashboards");
    } catch (err) {
      console.error("Error updating project:", err);
      alert("Failed to update project: " + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-base-100 shadow-lg rounded-xl p-6 md:p-8 space-y-6 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl sm:text-3xl text-center font-bold text-white">
          Update Project
        </h2>

        {/* Project Title */}
        <label className="block text-white font-semibold">Project Title</label>
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          required
          disabled={submitting}
        />

        {/* Dataset Fields */}
        <label className="block text-white font-semibold">Dataset Name</label>
        <input
          type="text"
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">Dataset Category</label>
        <input
          type="text"
          value={datasetCategory}
          onChange={(e) => setDatasetCategory(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">Dataset Description</label>
        <textarea
          value={datasetDescription}
          onChange={(e) => setDatasetDescription(e.target.value)}
          rows={3}
          className="textarea textarea-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        {/* Problem Statement */}
        <label className="block text-white font-semibold">Problem Statement</label>
        <textarea
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          rows={3}
          className="textarea textarea-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        {/* Analytical Questions */}
        <div>
          <label className="block text-white font-semibold mb-2">Analytical Questions</label>
          {analyticalQuestions.map((q, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={q}
                placeholder={`Question ${i + 1}`}
                onChange={(e) => handleArrayChange(setAnalyticalQuestions, analyticalQuestions, i, e.target.value)}
                className="input input-bordered w-full text-white bg-base-200"
                disabled={submitting}
              />
              {analyticalQuestions.length > 1 && (
                <button
                  type="button"
                  className="btn btn-error btn-sm"
                  onClick={() => removeArrayItem(setAnalyticalQuestions, analyticalQuestions, i)}
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
            onClick={() => addArrayItem(setAnalyticalQuestions, analyticalQuestions)}
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
                onChange={(e) => handleArrayChange(setTechnologies, technologies, i, e.target.value)}
                className="input input-bordered w-full text-white bg-base-200"
                disabled={submitting}
              />
              {technologies.length > 1 && (
                <button
                  type="button"
                  className="btn btn-error btn-sm"
                  onClick={() => removeArrayItem(setTechnologies, technologies, i)}
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
          value={csvToDB}
          onChange={(e) => setCsvToDB(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">EDA with SQL Notebook</label>
        <input
          type="url"
          value={edaWithSQL}
          onChange={(e) => setEdaWithSQL(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">Ingestion After Cleaning Notebook</label>
        <input
          type="url"
          value={ingestionAfterCleaning}
          onChange={(e) => setIngestionAfterCleaning(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">EDA with Python Notebook</label>
        <input
          type="url"
          value={edaWithPython}
          onChange={(e) => setEdaWithPython(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">Tableau Link</label>
        <input
          type="url"
          value={tableauLink}
          onChange={(e) => setTableauLink(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        <label className="block text-white font-semibold">GitHub Link</label>
        <input
          type="url"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          className="input input-bordered w-full text-white bg-base-200"
          disabled={submitting}
        />

        {/* File Uploads */}
        {existingReport && (
          <p className="text-white">Existing Report: <a href={existingReport} target="_blank" rel="noreferrer" className="underline">View</a></p>
        )}
        <label className="block text-white font-semibold">Upload New Report</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setReport(e.target.files[0])}
          className="file-input file-input-bordered w-full"
          disabled={submitting}
        />

        {existingApproach && (
          <p className="text-white">Existing Approach: <a href={existingApproach} target="_blank" rel="noreferrer" className="underline">View</a></p>
        )}
        <label className="block text-white font-semibold">Upload New Solution Approach</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setApproach(e.target.files[0])}
          className="file-input file-input-bordered w-full"
          disabled={submitting}
        />

        {existingImageUrl && (
          <div>
            <p className="text-white">Current Image:</p>
            <img src={existingImageUrl} alt="Current" className="w-full max-h-64 object-cover rounded mb-2" />
          </div>
        )}
        <label className="block text-white font-semibold">Upload New Project Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageUrl(e.target.files[0])}
          className="file-input file-input-bordered w-full"
          disabled={submitting}
        />

        <button
          type="submit"
          className={`btn w-full ${submitting ? "btn-disabled bg-gray-500" : "btn-primary"}`}
          disabled={submitting}
        >
          {submitting ? "Updating…" : "Update Project"}
        </button>
      </form>
    </div>
  );
}
