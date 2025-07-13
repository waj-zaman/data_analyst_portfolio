import React, { useEffect, useState } from "react";
import api from "../utilities/api.js";
import leetcodeImg from "../assets/leetcode.png";

function SQL() {
  console.log(api + "/leetcode/wajahathzaman")
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leetcode/wajahathzaman")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching SQL data:", err);
        setLoading(false);
      });
  }, []);

  const allItem = data?.submitStatsGlobal?.acSubmissionNum?.find(
    item => item.difficulty === "All"
  )

  const otherItems = data?.submitStatsGlobal?.acSubmissionNum.filter(
    item => item.difficulty !== "All"
  )

  return (
    <section className="bg-base-200 rounded-xl py-8 px-4 sm:px-6 md:px-8 max-w-full sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-center mb-8">
        SQL
      </h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="mb-6 flex flex-col items-center text-center space-y-2">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold">LeetCode SQL Stats</h3>
            <p className="text-base sm:text-lg md:text-xl">
              Only SQL problems are solved on this platform.
            </p>
            <p className="text-sm text-gray-500">
              Ranking: {data.profile.ranking}
            </p>
            <a
              href="https://leetcode.com/u/wajahathzaman/"
              className="btn btn-wide h-12 sm:h-14 bg-base-100 hover:bg-base-200 mt-3"
            >
              <img className="w-8 sm:w-10" src={leetcodeImg} alt="LeetCode Profile" />
            </a>
          </div>

          <div>
            {allItem && (
              <div className="card bg-base-100 shadow-md p-4 mb-6 mx-auto max-w-sm sm:max-w-md">
                <h3 className="font-bold text-lg">{allItem.difficulty}</h3>
                <p className="text-gray-500 text-base sm:text-lg">
                  Problems Solved: {allItem.count}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {otherItems.map((item, idx) => (
                <div key={idx} className="card bg-base-100 shadow-md p-4">
                  <h3 className="font-bold text-lg">{item.difficulty}</h3>
                  <p className="text-gray-500 text-base sm:text-lg">
                    Problems Solved: {item.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default SQL;
