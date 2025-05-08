"use client";

import { useParams } from "next/navigation";
import React from "react";

const vote = {
  title: "City Council Election 2025",
  description:
    "Vote for your city council representatives for the 2025 term. Choose wisely among the candidates listed below.",
  endDate: "2025-06-30",
  candidates: [
    {
      id: 1,
      name: "Alice Johnson",
      description:
        "A long-time resident with a focus on education and community programs.",
    },
    {
      id: 2,
      name: "Michael Smith",
      description:
        "Entrepreneur and advocate for small business support and infrastructure.",
    },
    {
      id: 3,
      name: "Sandra Lee",
      description:
        "Environmental scientist prioritizing sustainability and green city policies.",
    },
  ],
};

export default function VoteDetailPage() {
  const id = useParams();
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{vote.title}</h1>
      <p className="text-gray-600 mb-2">{vote.description}</p>
      <p className="text-sm text-gray-500 mb-6">
        <span className="font-medium">End Date:</span> {vote.endDate}
      </p>

      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Candidates</h2>
        <ul className="space-y-4">
          {vote.candidates.map((candidate) => (
            <li
              key={candidate.id}
              className="p-5 border border-gray-200 rounded bg-white shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-800">
                {candidate.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {candidate.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Take Key
        </button>
      </div>
    </div>
  );
}
