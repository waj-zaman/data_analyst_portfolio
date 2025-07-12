import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utilities/api.js";
import TableauEmbed from "../components/TableauEmbed.jsx";

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch((err) => console.error("Error fetching project details:", err));
  }, [id]);

  if (!project) {
    return <div className="text-center py-20">Loading...</div>;
  }

  // Clean steps: remove empty/null/whitespace-only strings
  const validSteps = project.steps?.filter(
    (step) => step && step.trim() !== ""
  );

  return (
    <section className="mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-screen-xl text-base-200">
      <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-8 text-center">
        {project.title}
      </h2>

      <div className="mb-12">
        <h3 className="font-heading font-bold text-2xl sm:text-3xl pt-6 pb-4">
          Description:
        </h3>
        <p className="font-body text-lg sm:text-xl text-slate-300 leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="mb-12">
        <h3 className="font-heading font-bold text-2xl sm:text-3xl pb-4">
          Interactive Dashboard:
        </h3>
        <div className="rounded-lg overflow-visible">
          <TableauEmbed url={project.tableauLink} />
        </div>
      </div>

      {validSteps && validSteps.length > 0 && (
        <div className="mb-12">
          <h3 className="font-heading font-bold text-2xl sm:text-3xl pb-4">
            Steps:
          </h3>
          <ul className="space-y-4 sm:space-y-2">
            {validSteps.map((step, index) => (
              <li
                key={index}
                className="bg-base-100 text-white p-4 rounded-lg shadow-md border border-base-300 text-lg sm:text-xl"
              >
                <span className="font-semibold mr-2">Step {index + 1}:</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default ProjectDetail;
