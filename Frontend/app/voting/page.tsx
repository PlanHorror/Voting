"use client";

import Link from "next/link";
import React from "react";

const simpleVotes = [
  {
    id: 1,
    title: "Local Transportation Policy",
  },
  {
    id: 2,
    title: "New School Construction",
  },
  {
    id: 3,
    title: "Environmental Protection Plan",
  },
];

export default function VotingList() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Vote List
      </h2>
      <div className="space-y-4">
        {simpleVotes.map((vote) => (
          <div
            key={vote.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition">
            <h3 className="text-base font-medium text-gray-800">
              {vote.title}
            </h3>
            <Link
              className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              href={`/voting/${vote.id}`}>
              Vote
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
