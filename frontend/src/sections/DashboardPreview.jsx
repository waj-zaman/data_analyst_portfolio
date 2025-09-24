import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import api from "../utilities/api";

import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/authSlice";

function DashboardPreview() {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    api.get("/dashboards?limit=4")
      .then(res => setDashboards(res.data))
      .catch(err => {
        console.error("Error fetching project preview:", err);
        setError("Failed to load dashboards. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-base-200">
      <section className="py-10 px-4 sm:px-6 md:px-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 font-heading">
          Projects
        </h2>

        <div className="flex justify-center">
          {loading ? (
            <div className="flex flex-col items-center">
              <span className="loading loading-spinner loading-lg text-[#FFFBDE] mb-4"></span>
              <p className="text-center text-white text-lg">
                Loading dashboards from the database. This might take a minute or two, please wait...
              </p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : dashboards.length === 0 ? (
            <p className="text-center text-gray-400">No dashboards available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 w-full max-w-6xl">
              {dashboards.map(dashboard => (
                <DashboardCard key={dashboard._id} dashboard={dashboard} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          )}

        </div>

        <div className="text-center mt-8">
          <div className="text-center mt-8">
            {!loading && !error && dashboards.length > 0 && (
              <Link
                to="/dashboards"
                className="btn btn-outline hover:bg-[#FFFBDE] hover:text-base-200 text-lg md:text-xl rounded-lg font-heading"
              >
                All Dashboards
              </Link>
            )}
          </div>

        </div>

      </section>
    </div>
  );
}

export default DashboardPreview;
