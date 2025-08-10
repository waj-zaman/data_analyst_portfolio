import React from "react";
import { Link } from "react-router-dom";
import api from "../../utilities/api.js";

const WebsiteCard = ({ id, title, url, description, thumbnail, isLoggedIn, onDelete }) => {
  // Return null if there's no title to display, preventing rendering of an empty card.
  if (!title) return null;

  // Handles the deletion process for a website.
  const handleDelete = async () => {
    // NOTE: In a production app, it is best practice to replace `window.confirm`
    // with a custom modal component for a better user experience and styling control.
    const confirmed = window.confirm(`Are you sure you want to delete the website "${title}"?`);
    if (!confirmed) {
      return;
    }

    try {
      // Use the pre-configured API instance to send a DELETE request.
      await api.delete(`/websites/${id}`);
      
      // NOTE: Same as with confirm, `alert` should be replaced with a
      // state-driven message or a toast notification system.
      alert("Website deleted successfully!");

      // If an onDelete callback is provided, call it to inform the parent component
      // to update its state (e.g., remove the deleted item from the list).
      if (onDelete) {
        onDelete(id);
      }
    } catch (err) {
      console.error("Error deleting website:", err);
      // Display a user-friendly error message.
      alert("Failed to delete website. Please try again.");
    }
  };

  return (
    <div className="relative group w-full h-80 rounded-xl overflow-hidden shadow-lg bg-gray-200">
      {/* Thumbnail Image */}
      <img
        src={thumbnail || "https://placehold.co/400x320/E5E7EB/4B5563?text=No+Image"}
        alt={`Thumbnail for ${title}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center space-y-3 px-4">
        <h2 className="text-white text-2xl font-bold">{title}</h2>
        <p className="text-gray-300 text-md">{description}</p>
        
        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          {/* Always visible "View Website" link */}
          <button className="btn btn-outline text-lg font-body"><Link to={`/websites/${id}`}>Website Details</Link></button>

          {/* Conditionally rendered edit and delete buttons for logged-in users */}
          {isLoggedIn && (
            <>
              {/* Link to the edit page for this website */}
              <Link
                to={`/websites/update/${id}`}
                className="bg-blue-500 hover:bg-blue-600 font-body items-center flex text-white px-3 py-1 rounded"
              >
                Edit
              </Link>
              {/* Button to trigger the delete action */}
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
};

export default WebsiteCard;
