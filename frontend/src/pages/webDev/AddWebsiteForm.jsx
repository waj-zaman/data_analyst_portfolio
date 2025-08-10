import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utilities/api";

const AddWebsiteForm = () => {
  const navigate = useNavigate();

  // State to manage the form inputs
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]);
  const [currentFeature, setCurrentFeature] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  // State for form submission status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handles adding a new feature to the features array
  const handleAddFeature = (e) => {
    e.preventDefault();
    if (currentFeature.trim() !== "") {
      setFeatures([...features, currentFeature.trim()]);
      setCurrentFeature(""); // Clear the input field
    }
  };

  // Handles removing a feature from the features array
  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);
    formData.append("description", description);
    
    // Append each feature individually
    features.forEach(feature => {
      formData.append("features", feature);
    });

    // Append the thumbnail file if it exists
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    
    try {
      // The backend must have an endpoint that accepts multipart/form-data
      await api.post("/websites/add", formData);

      setSuccess("Website added successfully!");
      
      // Clear form after successful submission
      setTitle("");
      setUrl("");
      setDescription("");
      setFeatures([]);
      setThumbnail(null);
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate("/websites");
      }, 1500);

    } catch (err) {
      console.error("Error adding website:", err);
      // Display a user-friendly error message
      setError("Failed to add website. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg md:max-w-2xl bg-base-100 shadow-lg rounded-xl p-6 md:p-8 space-y-6 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl sm:text-3xl text-center font-bold text-white">Add New Website</h2>
        
        {error && (
          <div className="p-4 text-center text-red-500 bg-red-900 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 text-center text-green-500 bg-green-900 rounded-lg">
            {success}
          </div>
        )}

        {/* Title Input */}
        <input
          type="text"
          className="border-2 text-base sm:text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Website Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* URL Input */}
        <input
          type="url"
          className="border-2 text-base sm:text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        {/* Description Input */}
        <textarea
          className="border-2 text-base sm:text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Website Description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Features Input */}
        <div>
          <label className="text-lg sm:text-xl block font-semibold mb-2 text-white">Features:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={currentFeature}
              onChange={(e) => setCurrentFeature(e.target.value)}
              placeholder="Enter a feature"
              className="border-2 text-base sm:text-lg px-4 py-2 rounded-lg text-white w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="btn bg-slate-700 text-white rounded-lg px-4 py-2 hover:bg-slate-800 transition"
            >
              Add
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-base-200 rounded-lg text-white">
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="btn btn-sm btn-error text-white"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Thumbnail File Input */}
        <div>
          <label className="text-lg sm:text-xl block font-semibold mb-2 text-white">Thumbnail Image:</label>
          <input
            type="file"
            accept="image/*"
            className="text-base sm:text-lg px-2 py-2 rounded-lg bg-base-200 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`text-base sm:text-lg py-3 rounded-xl w-full transition ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 text-slate-800 hover:bg-blue-900 hover:text-white"
          }`}
        >
          {loading ? "Adding..." : "Add Website"}
        </button>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/websites")}
          className="text-base sm:text-lg py-3 rounded-xl w-full transition bg-gray-600 text-white hover:bg-gray-700"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddWebsiteForm;
