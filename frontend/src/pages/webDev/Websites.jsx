import React, { useEffect, useState } from "react";
import WebsiteCard from "../webDev/WebsiteCard"; // Assuming WebsiteCard is in this relative path
import api from "../../utilities/api";
import { useLocation, useNavigate } from "react-router-dom";
import { checkLoggedin } from "../../utilities/sessionCheck";

function Websites() {
  const [websites, setWebsites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  
  const navigate = useNavigate();

  // Fetches websites and checks login status on component mount.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const websitesResponse = await api.get("/websites");
        setWebsites(websitesResponse.data);

        const loggedInStatus = await checkLoggedin();
        setIsLoggedIn(loggedInStatus);
        
      } catch (err) {
        console.error("Error fetching websites:", err);
        setError("Failed to load websites.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to remove a deleted website from the state. This is passed
  // to the WebsiteCard to allow it to update the parent component's state.
  const handleDeleteWebsite = (deletedWebsiteId) => {
    setWebsites(currentWebsites =>
      currentWebsites.filter(website => website._id !== deletedWebsiteId)
    );
  };
  
  // Handlers for navigation and authentication.
  const handleLogin = () => {
    navigate("/auth/login", { state: { from: location }});
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      // NOTE: Replace alert with a more modern UI component for better UX.
      alert("Logged Out Successfully.");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Logout Failed.");
    }
  };

  const handleAddWebsite = () => {
    navigate("/websites/add");
  };

  // Conditional rendering for loading and error states
  if (loading) {
    return <div className="text-center text-white mt-8">Loading websites...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <section className="py-10 px-4 sm:px-6">
      <h2 className="text-3xl font-bold text-center mb-12 font-heading text-base-200">
        All Websites
      </h2>

      {/* Login / Add / Logout Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center items-center pb-10">
        {!isLoggedIn ? (
          <button
            className="btn btn-outline text-base-200 hover:text-white text-lg sm:text-xl px-6 py-3"
            onClick={handleLogin}
          >
            Login
          </button>
        ) : (
          <>
            <button
              className="btn btn-outline text-base-200 hover:text-white text-lg sm:text-xl px-6 py-3"
              onClick={handleAddWebsite}
            >
              Add Website
            </button>
            <button
              className="btn btn-error bg-red-600 text-black text-lg sm:text-2xl px-6 py-3 hover:bg-red-800 hover:text-slate-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Website Cards */}
      <div className="flex flex-col items-center gap-10 mt-10">
        {websites.length === 0 ? (
          <p className="text-lg sm:text-xl text-gray-500 text-center px-4">
            No Websites Found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl w-full px-4">
            {websites.map((website) => (
              <WebsiteCard
                key={website._id}
                id={website._id} // Pass the website's ID
                title={website.title}
                url={website.url}
                description={website.description}
                features={website.features}
                thumbnail={website.thumbnail}
                isLoggedIn={isLoggedIn} // Pass the auth status
                onDelete={handleDeleteWebsite} // Pass the delete handler
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center mt-10">
        <button
          onClick={() => window.history.back()}
          className="btn text-xl font-body bg-gray-600 text-white rounded-lg px-8 py-3 hover:bg-gray-700 transition"
        >
          Go Back
        </button>
      </div>
    </section>
  );
}

export default Websites;
