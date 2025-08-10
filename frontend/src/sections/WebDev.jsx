import React, { useState, useEffect } from "react";
import axios from "axios";
import WebsitePreview from "../pages/webDev/WebsitePreview";

export const WebDev = () => {
  const [techIcons, setTechIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/tech-icons", {
          withCredentials: true,
        });
        setTechIcons(response.data); // Adjust if response shape is different
      } catch (error) {
        console.error("Error fetching the icons:", error);
        setError("Error fetching the Tech Icons.");
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, []); // ✅ Prevents infinite re-render loop

  return (
    <>
      {/* ✅ Tech Stack Icon Grid */}
      <div className="pb-4 px-4 flex justify-center">
        {loading ? (
          <p className="text-center text-gray-500">Loading icons...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : techIcons.length === 0 ? (
          <p className="text-center text-gray-500">No tech icons available yet.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 justify-items-center max-w-xl">
            {techIcons.map((icon) => (
              <div key={icon._id} className="  p-2  rounded-md flex flex-col items-center gap-2">
                <img
                  src={icon.iconUrl}
                  alt={icon.name}
                  className="w-14 h-14 object-contain"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <WebsitePreview />
    </>
  );
};
