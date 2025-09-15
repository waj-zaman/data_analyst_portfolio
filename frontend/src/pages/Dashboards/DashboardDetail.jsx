import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utilities/api.js";
import TableauEmbed from "../../components/TableauEmbed.jsx";


function DashboardDetail() {
  const { id } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [codeContent, setCodeContent] = useState(""); // for GitHub Python code
  const [ingestionAfterCleaning, setIngestionAfterCleaning] = useState(""); const navigate = useNavigate();

  useEffect(() => {
    api.get(`/dashboards/${id}`)
      .then((res) => {
        const data = res.data;
        setDashboard(data);

        // Fetch csvToDB code if available
        if (data.csvToDB) {
          fetch(data.csvToDB)
            .then((res) => res.text())
            .then((text) => setCodeContent(text))
            .catch((err) => console.error("Error fetching csvToDB file:", err));
        }

        // Fetch ingestionAfterCleaning code if available
        if (data.ingestionAfterCleaning) {
          fetch(data.ingestionAfterCleaning)
            .then((res) => res.text())
            .then((text) => setIngestionAfterCleaning(text))
            .catch((err) => console.error("Error fetching ingestionAfterCleaning file:", err));
        }
      })
      .catch((err) => console.error("Error fetching dashboard:", err));
  }, [id]);

  if (!dashboard) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const validSteps = dashboard.steps?.filter(
    (step) => step && step.trim() !== ""
  );

  // Correct nbviewer URL generator
  const getNbviewerUrl = (rawUrl) => {
    if (!rawUrl) return null;
    return `https://nbviewer.org/url/${encodeURIComponent(rawUrl)}`;
  };

  return (
    <>
    <div className="flex flex-col justify-center h-screen lg:hidden">
      <h1 className="text-3xl font-heading text-black text-center">Please View in Desktop Site.</h1>
      <h3 className="text-black text-center mt-3 text-blue-800 font-heading text-xl"><a href={dashboard.githubLink}>Visit Github Link.</a></h3>
    </div>
    <div className="hidden lg:block">
      <section className="mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-screen-2xl text-base-200">
      <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-8 text-center">
        {dashboard.projectTitle}
      </h2>

      {/* Dataset Name */}
      <div className="flex pb-3 mt-4">
        <h3 className="text-2xl font-heading font-semibold">Dataset Name :</h3>
        <p className="text-2xl font-body pl-2">{dashboard.datasetName}</p>
      </div>

      {/* Dataset Category */}
      <div className="flex pb-3 mt-2">
        <h3 className="text-2xl font-heading font-semibold">Dataset Category :</h3>
        <p className="text-2xl font-body pl-2">{dashboard.datasetCategory}</p>
      </div>

      {/* Dataset Description */}
      <div className="flex pb-3 mt-2">
        <h3 className="text-2xl font-heading font-semibold">Dataset Description :</h3>
        <p className="text-2xl font-body pl-2">{dashboard.datasetDescription}</p>
      </div>

      {/* Problem Statement */}
      <div className="flex pb-3 mt-2">
        <h3 className="text-2xl font-heading font-semibold">Problem Statement :</h3>
        <p className="text-2xl font-body pl-2">{dashboard.problemStatement}</p>
      </div>

      {/* Analytical Questions */}
      <div className="pb-3 mt-2">
        <h3 className="text-2xl font-heading font-semibold">Analytical Questions :</h3>
        <ul className="list-disc list-inside pl-4 text-2xl font-body">
          {dashboard.analyticalQuestions?.map((q, i) => (
            <li className="pt-1" key={i}>{q}</li>
          ))}
        </ul>
      </div>

      {/* Technologies */}
      <div className="pb-3 mt-2">
        <h3 className="text-2xl font-heading font-semibold">Technologies :</h3>
        <ul className="list-disc list-inside pl-4 text-2xl font-body">
          {dashboard.technologies?.map((tech, i) => (
            <li key={i}>{tech}</li>
          ))}
        </ul>
      </div>

      {/* Python Code Viewer for EDA with SQL*/}
      {codeContent && (
        <div className="pb-8 mt-2">
          <h3 className="text-2xl font-heading font-semibold mt-4">Csv to Database using Python Script :</h3>
          <p className="font-body text-2xl pb-2">
            Scroll inside the window to view the code that automates data ingestion from CSV files.
          </p>
          <div
            className="bg-gray-900 text-green-300 font-mono text-sm rounded-lg shadow-md p-4 overflow-y-auto"
            style={{ maxHeight: "600px" }}
          >
            <pre className="whitespace-pre-wrap">{codeContent}</pre>
          </div>
        </div>
      )}

      {/* Notebook Viewer */}
      {dashboard.edaWithSQL && (
        <div className="pb-8 mt-2">
          <h3 className="text-2xl font-heading font-semibold mb-2">EDA with SQL :</h3>
          <p className="font-body text-2xl pb-2">
            Scroll inside the window to view the notebook.
          </p>

          <div className="rounded-lg shadow-md overflow-hidden" style={{ height: "800px" }}>
            <iframe
              src={`https://nbviewer.org/${dashboard.edaWithSQL}`}
              title="EDA SQL Notebook"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* Python Code Viewer for EDA with Python*/}
      {ingestionAfterCleaning && (
        <div className="pb-8 mt-2">
          <h3 className="text-2xl font-heading font-semibold mb-2">Post Cleaning Automation using Python Script :</h3>
          <p className="font-body text-2xl pb-2">
            Scroll inside the window to view the code that automates data cleaning and ingestion upon new data arrival.
          </p>
          <div
            className="bg-gray-900 text-green-300 font-mono text-sm rounded-lg shadow-md p-4 overflow-y-auto"
            style={{ maxHeight: "600px" }}
          >
            <pre className="whitespace-pre-wrap">{ingestionAfterCleaning}</pre>
          </div>
        </div>
      )}

      {/* Notebook Viewer */}
      {dashboard.edaWithPython && (
        <div className="pb-8 mt-2">
          <h3 className="text-2xl font-heading font-semibold mb-2">EDA with Python :</h3>
          <p className="font-body text-2xl pb-2">
            Scroll inside the window to view the notebook.
          </p>

          <div className="rounded-lg shadow-md overflow-hidden" style={{ height: "800px" }}>
            <iframe
              src={`https://nbviewer.org/${dashboard.edaWithPython}`}
              title="EDA SQL Notebook"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}


      {/* Tableau Embed */}
      <div className="my-12 mt-2">
        <h3 className="text-2xl font-heading font-semibold mb-2">
          Interactive Tableau Dashboard:
        </h3>
        <div className="rounded-lg overflow-visible">
          <TableauEmbed url={dashboard.tableauLink} />
        </div>

        <h3 className="font-heading text-2xl text-blue-800 mt-3">
          <a href={dashboard.tableauLink}>Tableau Public Page</a>
        </h3>
      </div>

      {/*Report Pdf */}
      {dashboard.report && (
        <div className="pb-8 mt-2">
          <h3 className="text-2xl font-heading font-semibold mb-2">Insights Report :</h3>
          <div className="rounded-lg shadow-md overflow-hidden" style={{ height: "800px" }}>
            <div style={{ height: "800px" }}>
              <iframe
                src={dashboard.report}
                width="100%"
                height="100%"
                style={{ border: "none" }}
              />
            </div>

          </div>
        </div>
      )}


      {/*Solution Pdf */}
      {dashboard.report.length > 0 && (
        <div className="pb-8 mt-2">
          <h3 className="text-2xl font-heading font-semibold mb-2">Solution Approach :</h3>
          <div className="rounded-lg shadow-md overflow-hidden" style={{ height: "800px" }}>
            <div style={{ height: "800px" }}>
              <iframe
                src={dashboard.approach}
                width="100%"
                height="100%"
                style={{ border: "none" }}
              />
            </div>

          </div>
        </div>
      )}

      {/*GitHub link */}
      <div>
        <h2 className="text-2xl font-heading text-blue-800 mt-2">
          <a href={dashboard.githubLink}>Github</a>
        </h2>
      </div>

      {/* Back button */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => navigate("/dashboards")}
          className="btn text-xl font-body bg-gray-600 text-white rounded-lg px-8 py-3 hover:bg-gray-700 transition"
        >
          All Dashboards
        </button>
      </div>
    </section >

    </div>
    

    </>
      );
}

export default DashboardDetail;
