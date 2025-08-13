import React, { useEffect, useState } from "react";
import DashboardCard from "../../components/DashboardCard.jsx";
import api from "../../utilities/api.js";
import { useNavigate, useLocation } from 'react-router-dom';

import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../store/authSlice.js";

function Dashboards() {
  const [dashboards, setDashboards] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardResponse = await api.get("/dashboards");
        setDashboards(dashboardResponse.data);
      } catch (error) {
        console.error("Error fetching Dashboards:", error);
        setError("Failed to Load Dashboards");
      }
    };

    fetchData();
  }, []);

  const handleLogin = () => {
    navigate("/auth/login", { state: { from: location } });
  };

  const handleAddDashboard = () => {
    if (!isLoggedIn) return handleLogin();
    navigate("/dashboards/add")
  };

  // ✅ New: Handle deleting a project from the list
  const handleDelete = (id) => {
    setDashboards(prevDashboards => prevDashboards.filter(dashboard => dashboard._id !== id));
  };

  return (
    <section className="py-10 px-4 sm:px-6">
      <h2 className="text-3xl font-bold text-center mb-12 font-heading text-base-200">
        All Dashboards
      </h2>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center items-center pb-10">
        {isLoggedIn && 
            <button
              className="btn btn-outline text-base-200 hover:text-white text-lg sm:text-xl px-6 py-3"
              onClick={handleAddDashboard}
            >
              Add Dashboard
            </button>
          
        }
      </div>

      <div className="flex flex-col items-center gap-10 mt-10">
        {dashboards.length === 0 ? (
          <div>
            <p className="text-lg sm:text-xl text-gray-500 text-center px-4">
              No Dashboards Found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl w-full px-4">
            {dashboards.map((dashboard) => (
              <DashboardCard
                key={dashboard._id}
                dashboard={dashboard}
                isLoggedIn={isLoggedIn}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center py-10 justify-center">
        <button
          onClick={() => navigate("/")}
          className="btn text-xl font-body bg-gray-600 text-white rounded-lg px-8 py-3 hover:bg-gray-700 transition"
        >
          Home
        </button>
      </div>
    </section>
  );

}

export default Dashboards;
