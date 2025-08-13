import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utilities/api';

export default function UpdateDashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [tableauLink, setTableauLink] = useState('');
  const [steps, setSteps] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/dashboards/${id}`)
      .then(res => {
        const data = res.data;
        setTitle(data.title || '');
        setDescription(data.description || '');
        setTechnologies(data.technologies || '');
        setGithubLink(data.githubLink || '');
        setTableauLink(data.tableauLink || '');
        setSteps(data.steps || '');
        setExistingImageUrl(data.imageUrl || '');
      })
      .catch(err => console.error('Error fetching project:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('technologies', technologies);
      formData.append('githubLink', githubLink);
      formData.append('tableauLink', tableauLink);
      formData.append('steps', steps);

      if (newImageFile) {
        formData.append('imageUrl', newImageFile);
      }

      await api.put(`/dashboards/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Dashboard updated successfully!');
      navigate('/dashboards');
    } catch (err) {
      console.error('Error updating dashboard:', err);
      alert('Failed to update dashboard.');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 mt-10 flex items-center justify-center px-2 sm:px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-base-100 shadow-lg rounded-xl space-y-4 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl sm:text-3xl text-center font-bold mb-4">Update Dashboard</h2>

        <input
          type="text"
          placeholder="Dashboard Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border-2 text-md px-4 py-2 rounded-lg text-white w-full bg-base-200"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border-2 text-md px-4 py-2 rounded-lg text-white w-full bg-base-200"
          rows={3}
        />

        <input
          type="text"
          placeholder="Technologies (comma separated)"
          value={technologies}
          onChange={(e) => setTechnologies(e.target.value)}
          required
          className="border-2 text-md px-4 py-2 rounded-lg text-white w-full bg-base-200"
        />

        <input
          type="text"
          placeholder="GitHub Link"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          className="border-2 text-md px-4 py-2 rounded-lg text-white w-full bg-base-200"
        />

        <input
          type="text"
          placeholder="Tableau Link"
          value={tableauLink}
          onChange={(e) => setTableauLink(e.target.value)}
          className="border-2 text-md px-4 py-2 rounded-lg text-white w-full bg-base-200"
        />

        <textarea
          placeholder="Steps"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          className="border-2 text-md px-4 py-2 rounded-lg text-white w-full bg-base-200"
          rows={3}
        />

        {existingImageUrl && (
          <div className="mt-4 w-full">
            <p className="text-base-200 mb-2">Current Image:</p>
            <img
              src={existingImageUrl}
              alt="Existing Dashboard."
              className="w-full max-h-64 sm:max-h-80 object-cover rounded mb-2"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImageFile(e.target.files[0])}
          className="file-input file-input-ghost w-full"
        />

        <button
          type="submit"
          className="text-lg bg-blue-500 mt-6 sm:mt-10 transition-all text-slate-800 py-2 rounded-xl hover:bg-blue-900 hover:text-white w-full"
        >
          Update Dashboard
        </button>
      </form>
    </div>
  );
}
