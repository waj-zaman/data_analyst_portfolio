import React, { useState, useEffect } from "react";
import WebsitePreview from "../pages/webDev/WebsitePreview";
import api from "../utilities/api";

export const WebDev = () => {
  const [techIcons, setTechIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const res = await api.get("/tech-icons");
        setTechIcons(res.data);
      } catch (err) {
        console.error("Error Fetching the tech icons: ", err);
        setError("Error fetching the Tech Icons.");
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, []);


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
