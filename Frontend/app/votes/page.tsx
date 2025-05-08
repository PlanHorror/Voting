"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_IMAGE = "/banner.jpg";

const votes = [
  {
    id: 1,
    title: "City Council Election 2025",
    description:
      "Vote for your city council representatives for the 2025 term.",
    endDate: "2025-06-30",
    totalCandidates: 8,
  },
  {
    id: 2,
    title: "Park Renovation Funding",
    description: "Should the city allocate $1M to renovate Riverside Park?",
    endDate: "2025-05-31",
    totalCandidates: 2,
  },
  {
    id: 3,
    title: "Education Budget Review",
    description:
      "Decide whether to approve the new education funding proposal.",
    endDate: "2025-07-15",
    totalCandidates: 3,
  },
];

export default function VoteListPage() {
  return (
    <div className="bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Available Votes
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {votes.map((vote) => (
          <div
            key={vote.id}
            className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg">
            <Image
              src={DEFAULT_IMAGE}
              alt="Vote Banner"
              width={500}
              height={300}
              className="w-full h-40 object-cover"
            />
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800">
                {vote.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">{vote.description}</p>

              <div className="mt-4 text-sm text-gray-500 space-y-1">
                <p>
                  <span className="font-medium text-gray-700">End Date:</span>{" "}
                  {vote.endDate}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Total Candidates:
                  </span>{" "}
                  {vote.totalCandidates}
                </p>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-150">
                  Take Key
                </button>
                <Link
                  className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-700 rounded hover:bg-green-50 transition duration-150"
                  href={`/votes/${vote.id}`}>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  More Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
