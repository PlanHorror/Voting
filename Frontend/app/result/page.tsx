"use client";

import React, { useState, useEffect } from "react";
import { VoteSessionService } from "@/services/vote-session.service";
import { VoteSessionDto } from "@/dto/vote-session.dto";
import { toast } from "sonner";

function calculateResults(voteSession: VoteSessionDto) {
  if (!voteSession.candidates || voteSession.candidates.length === 0) {
    return { status: "No Candidates", winners: [] };
  }

  // Check if vote session has ended
  const isEnded = new Date() > new Date(voteSession.endDate);

  // Calculate votes for each candidate
  const candidatesWithVotes = voteSession.candidates.map((candidate) => {
    const voteCount =
      voteSession.votes?.filter((vote) => vote.candidateId === candidate.id)
        .length || 0;
    return {
      id: candidate.id,
      name: candidate.name,
      votes: voteCount,
    };
  });

  // Find maximum votes
  const maxVotes = Math.max(...candidatesWithVotes.map((c) => c.votes), 0);

  // Find winners (candidates with max votes)
  const winners = candidatesWithVotes.filter((c) => c.votes === maxVotes);

  // Determine status
  if (!isEnded) {
    return { status: "In Progress", winners: [], candidatesWithVotes };
  }
  if (maxVotes === 0) {
    return { status: "No Votes", winners: [], candidatesWithVotes };
  }
  if (winners.length === 1) {
    return { status: "Winner", winners, candidatesWithVotes };
  }
  return { status: "Tie", winners, candidatesWithVotes };
}

export default function ResultsPage() {
  const [voteSessions, setVoteSessions] = useState<VoteSessionDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoteSessions = async () => {
      try {
        const data = await VoteSessionService.getAllVoteSessions();
        setVoteSessions(data);
      } catch (error) {
        console.error("Failed to fetch vote sessions:", error);
        toast.error("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchVoteSessions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Sort vote sessions by end date (most recent ended first)
  const sortedVoteSessions = [...voteSessions].sort(
    (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
  );

  return (
    <div className="py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Vote Results
      </h1>

      {voteSessions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
          <h2 className="text-xl text-gray-600">No vote results available</h2>
          <p className="mt-2 text-gray-500">
            Check back later for vote results
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {sortedVoteSessions.map((voteSession) => {
            const { status, winners, candidatesWithVotes } =
              calculateResults(voteSession);
            const isEnded = new Date() > new Date(voteSession.endDate);

            return (
              <div
                key={voteSession.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {voteSession.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {isEnded
                        ? `Ended: ${new Date(
                            voteSession.endDate
                          ).toLocaleDateString()}`
                        : `Ends: ${new Date(
                            voteSession.endDate
                          ).toLocaleDateString()}`}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      status === "Winner"
                        ? "bg-green-100 text-green-800"
                        : status === "Tie"
                        ? "bg-yellow-100 text-yellow-800"
                        : status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-200 text-gray-700"
                    }`}>
                    {status}
                  </span>
                </div>

                <ul className="space-y-2 mt-2">
                  {candidatesWithVotes?.map((candidate) => {
                    const isWinner = winners.some((w) => w.id === candidate.id);
                    return (
                      <li
                        key={candidate.id}
                        className={`flex justify-between px-4 py-2 rounded-lg ${
                          isWinner && isEnded
                            ? "bg-green-50 font-semibold text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                        <span>{candidate.name}</span>
                        <span>
                          {candidate.votes} vote
                          {candidate.votes !== 1 ? "s" : ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
