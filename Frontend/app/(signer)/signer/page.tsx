"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { AuthService } from "@/services/auth.service";
import { SignerService } from "@/services/signer.service";
import { VoteSessionDto } from "@/dto/vote-session.dto";

export default function SignerDashboardPage() {
  const [signerName, setSignerName] = useState("Guest");
  const [voteSessions, setVoteSessions] = useState<VoteSessionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    totalVotes: 0,
    avgParticipationRate: 0,
  });

  useEffect(() => {
    // Get the current user info
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Get the current user ID and username
        const signerId = AuthService.getUserId();
        const username = "Signer";
        setSignerName(username);

        if (signerId) {
          // 2. Fetch vote sessions assigned to this signer
          const sessions = await SignerService.getVoteSessionsBySigner();
          setVoteSessions(sessions);

          // 3. Calculate statistics from real data
          const activeSessionsCount = sessions.filter(
            // Compare end date with current date
            (session) => new Date(session.endDate) > new Date()
          ).length;
          const totalVotesCount = sessions.reduce((sum, session) => {
            return sum + session.votes.length;
          }, 0);
          console.log(totalVotesCount);
          // Calculate participation rate, handle potential division by zero
          let avgParticipation = 0;
          if (sessions.length > 0) {
            const participationSum = sessions.reduce((sum, session) => {
              return sum + session.voteParticipants.length;
            }, 0);
            avgParticipation = Math.round(
              (sessions.reduce((sum, session) => {
                return sum + session.votes.length;
              }, 0) /
                participationSum) *
                100
            );
          }

          // Update the statistics
          setStats({
            totalSessions: sessions.length,
            activeSessions: activeSessionsCount,
            totalVotes: totalVotesCount,
            avgParticipationRate: avgParticipation,
          });
        } else {
          toast.error("Unable to identify current user");
        }
      } catch (error) {
        console.error("Error fetching signer data:", error);
        toast.error("Failed to load your vote sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (endDate: Date | string) => {
    if (new Date(endDate) > new Date()) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
          Ended
        </span>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Toaster position="top-right" richColors />

      {/* Welcome Header */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {signerName}
            </h1>
            <p className="text-gray-600 mt-1">
              Here's an overview of your vote sessions and signing activities
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Vote Sessions</p>
              <p className="text-xl font-bold text-gray-800">
                {stats.totalSessions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Sessions</p>
              <p className="text-xl font-bold text-gray-800">
                {stats.activeSessions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Votes Cast</p>
              <p className="text-xl font-bold text-gray-800">
                {stats.totalVotes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Participation</p>
              <p className="text-xl font-bold text-gray-800">
                {stats.avgParticipationRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vote Sessions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Your Vote Sessions
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            These are the vote sessions where you are assigned as a signer
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Votes / Participants
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {voteSessions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500">
                      No vote sessions assigned to you yet
                    </td>
                  </tr>
                ) : (
                  voteSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {session.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {session.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(session.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(session.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {session.votes.length} /{" "}
                          {session.voteParticipants.length}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{
                              width: `${Math.round(
                                (session.votes.length /
                                  session.voteParticipants.length) *
                                  100
                              )}%`,
                            }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <Link
                          href={`/signer/${session.id}`}
                          className="text-blue-600 hover:text-blue-900">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Vote Activity
          </h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : voteSessions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No recent voting activity
            </p>
          ) : (
            <div className="space-y-6">
              {voteSessions.slice(0, 3).map((session) => (
                <div
                  key={`activity-${session.id}`}
                  className="flex items-start">
                  <div
                    className={`rounded-full p-2 ${
                      session.endDate > new Date()
                        ? "bg-green-100"
                        : "bg-gray-100"
                    } mr-4 mt-1`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${
                        session.endDate > new Date()
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-800">
                      {session.endDate > new Date()
                        ? "Ongoing Voting"
                        : "Voting Ended"}{" "}
                      : {session.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {session.endDate > new Date()
                        ? `${
                            session.votes.length
                          } votes so far. Ends on ${formatDate(
                            session.endDate
                          )}.`
                        : `Received ${session.votes.length} votes from ${session.voteParticipants.length} participants.`}
                    </p>
                    <div className="mt-2">
                      <Link
                        href={`/signer/sessions/${session.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800">
                        View detailed results →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
