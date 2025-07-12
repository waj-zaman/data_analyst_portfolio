import React, { useEffect, useState } from "react";
import api from "../utilities/api.js";
import codeWarsImg from "../assets/codewars.png";

function Python() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/codewars/wajahathzaman")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Python data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-base-200 rounded-xl py-8 px-4 sm:px-6 md:px-8 max-w-full sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-center mb-8">
        PYTHON
      </h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="flex flex-col items-center text-center space-y-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold">CodeWars Python Stats</h3>
          <p className="max-w-md text-base sm:text-lg md:text-xl text-gray-700">
            Codewars platform is used to showcase my Python problem-solving skills.
          </p>
          <a
            href="https://www.codewars.com/users/wajahathzaman"
            className="btn btn-wide h-12 sm:h-14 bg-base-100 hover:bg-base-200"
          >
            <img
              src={codeWarsImg}
              alt="CodeWars Profile"
              className="w-8 sm:w-10"
            />
          </a>
          <div className="card bg-base-100 shadow-md w-full max-w-md p-4 items-center space-y-2">
            <p className="text-lg sm:text-xl font-bold">
              Challenges Completed: {data.codeChallenges.totalCompleted}
            </p>
            <p className="text-sm text-gray-500">
              Rank: {data.ranks.overall.name}
            </p>
            <p className="text-base sm:text-lg text-gray-500">
              Honor Score: {data.honor}
            </p>
            <p className="text-sm italic text-gray-500 mt-2">
              Growing from 8 kyu—Python challenge stats will be updated as progress continues.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Python;
