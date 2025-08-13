import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utilities/api";
import { useNavigate } from "react-router-dom";

const WebsiteDetailSection = () => {
    // Get the website ID from the URL parameters
    const { id } = useParams();

    // State to store the website data
    const [website, setWebsite] = useState(null);

    // State for data fetching status
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Effect to fetch the website data on component mount
    useEffect(() => {
        const fetchWebsite = async () => {
            // Check for a valid websiteId before making the API call
            if (!id) {
                setLoading(false);
                setError("Website ID not found in URL.");
                return;
            }

            try {
                setLoading(true);
                // Make a GET request to the backend to fetch the website data
                const response = await api.get(`/websites/${id}`);
                setWebsite(response.data);
            } catch (err) {
                console.error("Error fetching website:", err);
                setError("Failed to load website details. Please check your network and try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchWebsite();
    }, [id]); // The effect re-runs if websiteId changes

    // Display a loading message while data is being fetched
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-base-200 text-white text-lg">
                Loading...
            </div>
        );
    }

    // Display an error message if the fetch failed
    if (error) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-base-200 text-red-500 text-lg text-center p-4">
                {error}
            </div>
        );
    }

    // Render the website details if data is available
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-base-100 shadow-lg rounded-xl p-6 md:p-10 space-y-8">
                {/* Title and Edit Button */}
                <div className="flex justify-center items-center flex-wrap font-body gap-4">
                    <h1 className="text-3xl md:text-4xl  font-heading font-bold text-white flex leading-tight">
                        {website.title}
                    </h1>

                </div>

                {/* URL and Description */}
                <div className="space-y-4 px-10">
                    <p className="text-2xl text-gray-300">
                        <span className="font-semibold text-white">URL :</span>
                        <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-2">
                            {website.url}
                        </a>
                    </p>
                    <p className="text-gray-300 text-2xl leading-relaxed">{website.description}</p>
                </div>

                <div className="flex items-center justify-center">
                    {/* Thumbnail Image */}
                    {website.thumbnail ? (
                        <div className="w-2/3 h-2/3 rounded-lg overflow-hidden shadow-md">
                            <img
                                src={website.thumbnail}
                                alt={`${website.title} thumbnail`}
                                className="w-full object-cover"
                            />
                        </div>
                    ) : <div className="w-4/5 rounded-lg overflow-hidden shadow-md ">
                        <img
                            src="https://placehold.co/400x320/E5E7EB/4B5563?text=No+Image"
                            alt={`${website.title} thumbnail`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    }

                </div>



                {/* Features Section */}
                {website.features && website.features.length > 0 && (
                    <div className="px-10">
                        <h2 className="text-2xl md:text-2xl font-bold text-white mb-4">Features</h2>
                        <ul className="list-disc text-2xl list-inside space-y-2 text-gray-300">
                            {website.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Back Button */}
                <div className="flex items-center justify-center">
                    <button
                        onClick={() => navigate("/websites")}
                        className="btn text-xl font-body bg-gray-600 text-white rounded-lg px-8 py-3 hover:bg-gray-700 transition"
                    >
                        All Websites
                    </button>
                </div>

            </div>
        </div>
    );
};

export default WebsiteDetailSection;
