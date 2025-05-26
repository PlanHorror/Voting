"use client";

import React from "react";

const endedVotes = [
  {
    id: 1,
    title: "City Council Election 2025",
    endDate: "2025-06-30",
    candidates: [
      { name: "Alice Johnson", votes: 45 },
      { name: "Michael Smith", votes: 30 },
      { name: "Sandra Lee", votes: 25 },
    ],
  },
  {
    id: 2,
    title: "Park Renovation Funding",
    endDate: "2025-07-10",
    candidates: [
      { name: "Michael", votes: 40 },
      { name: "Sandra", votes: 40 },
    ],
  },
  {
    id: 3,
    title: "Education Budget Review",
    endDate: "2025-07-15",
    candidates: [
      { name: "John", votes: 0 },
      { name: "San", votes: 0 },
    ],
  },
];

function getWinners(candidates: { name: string; votes: number }[]) {
  const maxVotes = Math.max(...candidates.map((c) => c.votes));
  const winners = candidates.filter((c) => c.votes === maxVotes);
  if (maxVotes === 0) return { status: "No Votes", winners: [] };
  if (winners.length === 1) return { status: "Winner", winners };
  return { status: "Tie", winners };
}

export default function ResultsPage() {
  return (
    <div className=" py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Completed Votes
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {endedVotes.map((vote) => {
          const { status, winners } = getWinners(vote.candidates);

          return (
            <div
              key={vote.id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {vote.title}
                  </h2>
                  <p className="text-sm text-gray-500">Ended: {vote.endDate}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    status === "Winner"
                      ? "bg-green-100 text-green-800"
                      : status === "Tie"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                  {status}
                </span>
              </div>

              <ul className="space-y-2 mt-2">
                {vote.candidates.map((candidate) => {
                  const isWinner = winners.some(
                    (w) => w.name === candidate.name
                  );
                  return (
                    <li
                      key={candidate.name}
                      className={`flex justify-between px-4 py-2 rounded-lg ${
                        isWinner
                          ? "bg-green-50 font-semibold text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                      <span>{candidate.name}</span>
                      <span>
                        {candidate.votes} vote{candidate.votes !== 1 ? "s" : ""}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
