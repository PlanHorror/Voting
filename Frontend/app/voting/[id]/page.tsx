"use client";

import React, { useState } from "react";

const vote = {
  title: "City Council Election 2025",
  description: "Choose your representative for the upcoming term.",
  endDate: "2025-06-30",
  candidates: [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Michael Smith" },
    { id: 3, name: "Sandra Lee" },
  ],
};

export default function VoteCastPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );
  const [keyInput, setKeyInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput || selectedCandidate === null) {
      alert("Please enter your key and select a candidate.");
      return;
    }

    // submit logic here
    console.log("Key:", keyInput, "Candidate:", selectedCandidate);
  };

  return (
    <div className="  flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{vote.title}</h1>
        <p className="text-sm text-gray-500 mb-4">{vote.description}</p>
        <p className="text-xs text-gray-400 mb-6">End date: {vote.endDate}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Vote Key
            </label>
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your key..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a Candidate
            </label>
            <div className="space-y-3">
              {vote.candidates.map((candidate) => (
                <label
                  key={candidate.id}
                  className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition ${
                    selectedCandidate === candidate.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}>
                  <input
                    type="radio"
                    name="candidate"
                    value={candidate.id}
                    onChange={() => setSelectedCandidate(candidate.id)}
                    className="form-radio text-blue-600 mr-3"
                    checked={selectedCandidate === candidate.id}
                  />
                  <span className="text-gray-800 font-medium">
                    {candidate.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg shadow hover:bg-blue-700 transition duration-200">
            Submit Vote
          </button>
        </form>
      </div>
    </div>
  );
}
