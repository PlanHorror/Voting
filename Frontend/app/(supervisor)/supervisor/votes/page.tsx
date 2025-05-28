"use client";

import React, { useEffect, useState } from "react";
import { VoteSessionService } from "@/services/vote-session.service";
import { VoteSessionDto } from "@/dto/vote-session.dto";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SupervisorVotesPage() {
  const [voteSessions, setVoteSessions] = useState<VoteSessionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSessions, setExpandedSessions] = useState<
    Record<string, boolean>
  >({});
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchVoteSessions();
  }, []);

  const fetchVoteSessions = async () => {
    try {
      setLoading(true);
      // This will get vote sessions for the logged-in supervisor
      const sessions = await VoteSessionService.getVoteSessionsBySupervisorId(
        ""
      );

      // Sort by creation date (newest first)
      const sortedSessions = [...sessions].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      console.log("Fetched vote sessions:", sortedSessions);
      setVoteSessions(sortedSessions);
    } catch (error) {
      console.error("Failed to fetch vote sessions:", error);
      toast.error("Failed to load vote sessions");
    } finally {
      setLoading(false);
    }
  };

  const isSessionActive = (endDate: Date): boolean => {
    return new Date() < new Date(endDate);
  };

  const toggleSessionExpand = (sessionId: string) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this vote session? This action cannot be undone."
      )
    ) {
      try {
        setDeletingSession(sessionId);
        await VoteSessionService.deleteVoteSession(sessionId);
        toast.success("Vote session deleted successfully");
        fetchVoteSessions(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete vote session:", error);
        toast.error("Failed to delete vote session");
      } finally {
        setDeletingSession(null);
      }
    }
  };

  const handleUpdateSession = (sessionId: string) => {
    router.push(`/supervisor/votes/update/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Vote Sessions</h1>
        <Link
          href="/supervisor/votes/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Create New Vote Session
        </Link>
      </div>

      {voteSessions.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl text-gray-600 mb-4">No Vote Sessions Found</h2>
          <p className="text-gray-500 mb-6">
            You haven't created any vote sessions yet. Create your first vote
            session to get started.
          </p>
          <Link
            href="/supervisor/votes/create"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Create First Vote Session
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {voteSessions.map((session) => {
            const isActive = isSessionActive(session.endDate);
            const isExpanded = expandedSessions[session.id] || false;
            const totalVotes = session.votes?.length || 0;
            const totalParticipants = session.voteParticipants?.length || 0;

            return (
              <div
                key={session.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                {/* Card Header - Always visible */}
                <div
                  className="p-5 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleSessionExpand(session.id)}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-md ${
                          isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                        {isActive ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {session.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {isActive ? "Ends" : "Ended"}:{" "}
                          <span className="font-medium text-gray-700">
                            {new Date(session.endDate).toLocaleDateString()}
                          </span>
                        </p>
                        <div className="flex gap-2 text-sm">
                          <span className="text-blue-600">
                            {totalVotes} votes
                          </span>
                          <span>•</span>
                          <span className="text-purple-600">
                            {totalParticipants} participants
                          </span>
                        </div>
                      </div>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          isExpanded ? "transform rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    {/* Session Details */}
                    <div className="p-5 bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-600 mb-4">
                        {session.description || "No description provided"}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white p-3 rounded border border-gray-200 text-center">
                          <p className="text-sm text-gray-500">Signer</p>
                          <p className="font-medium">
                            {session.signer.username || "Not assigned"}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200  text-center">
                          <p className="text-sm text-gray-500">
                            Participation Rate
                          </p>
                          <p className="font-medium">
                            {totalParticipants > 0
                              ? `${Math.round(
                                  (totalVotes / totalParticipants) * 100
                                )}%`
                              : "N/A"}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200  text-center">
                          <p className="text-sm text-gray-500">Status</p>
                          <p
                            className={`font-medium ${
                              isActive ? "text-green-600" : "text-red-600"
                            }`}>
                            {isActive ? "Active" : "Ended"}
                          </p>
                        </div>
                      </div>

                      {/* Candidates */}
                      <h4 className="font-medium text-gray-700 mb-2">
                        Candidates
                      </h4>
                      <div className="bg-white rounded border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Votes
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {session.candidates?.length > 0 ? (
                              session.candidates.map((candidate) => {
                                const candidateVotes =
                                  session.votes?.filter(
                                    (vote) => vote.candidateId === candidate.id
                                  ).length || 0;
                                return (
                                  <tr key={candidate.id}>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="font-medium text-gray-900">
                                        {candidate.name}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                      {candidate.description ||
                                        "No description"}
                                    </td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                      <span className="px-2 py-1 text-blue-800 bg-blue-100 rounded-full font-medium text-sm">
                                        {candidateVotes} votes
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="px-4 py-4 text-center text-gray-500">
                                  No candidates for this vote session
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                      {isActive && (
                        <button
                          onClick={() => handleUpdateSession(session.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                          Update Session
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        disabled={deletingSession === session.id}
                        className={`px-4 py-2 text-white rounded transition ${
                          deletingSession === session.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}>
                        {deletingSession === session.id
                          ? "Deleting..."
                          : "Delete Session"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
