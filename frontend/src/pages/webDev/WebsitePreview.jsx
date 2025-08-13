import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WebsiteCard from "../webDev/WebsiteCard";
import api from "../../utilities/api";
import { checkLoggedin } from "../../utilities/sessionCheck";

import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../store/authSlice";

function WebsitePreview() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    // We use an async function inside useEffect to handle both API calls.
    const fetchData = async () => {
      try {
        // Fetch the websites with a limit.
        const websitesResponse = await api.get("/websites?limit=4");
        setWebsites(websitesResponse.data);
      } catch (err) {
        console.error("Error fetching website preview:", err);
        setError("Failed to load websites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Conditional rendering based on state.
  if (loading) {
    return (
      <div className="bg-base-200 m-4 rounded-lg py-10 px-4 sm:px-6 md:px-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 font-heading text-white">
          Websites
        </h2>
        <div className="text-center text-white">Loading websites...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-base-200 m-4 rounded-lg py-10 px-4 sm:px-6 md:px-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 font-heading text-white">
          Websites
        </h2>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-base-200 m-4 rounded-lg">
      <section className="py-10 px-4 sm:px-6 md:px-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 font-heading text-white">
          Websites
        </h2>

        <div className="flex justify-center">
          {websites.length === 0 ? (
            <p className="text-center text-gray-400">No websites available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 w-full max-w-6xl">
              {websites.map(website => (
                <WebsiteCard
                  key={website._id}
                  id={website._id}
                  title={website.title}
                  url={website.url}
                  description={website.description}
                  thumbnail={website.thumbnail}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          )}
        </div>


        <div className="text-center mt-8">
          <Link
            to="/websites"
            className="btn btn-outline hover:bg-[#FFFBDE] hover:text-base-200 text-lg md:text-xl rounded-lg font-heading"
          >
            All Websites
          </Link>
        </div>
      </section>
    </div>
  );
}

export default WebsitePreview;
