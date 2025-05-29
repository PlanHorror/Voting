"use client";

import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { SupervisorService } from "@/services/supervisor.service";
import { VoteSessionService } from "@/services/vote-session.service";
import { toast } from "sonner";
import { VoteSessionDto } from "@/dto/vote-session.dto";

export default function SupervisorDashboardPage() {
  // Stats data for the cards
  const [stats, setStats] = useState({
    totalVoteSessions: 0,
    activeVoteSessions: 0,
    totalSigners: 0,
    totalUsers: 0,
    totalParticipants: 0,
    avgParticipantsPerSession: 0,
  });

  // Data for charts
  const [monthlySessionsData, setMonthlySessionsData] = useState<number[]>([]);
  const [monthLabels, setMonthLabels] = useState<string[]>([]);
  const [userDistributionData, setUserDistributionData] = useState({
    regularUsers: 0,
    signers: 0,
    supervisors: 0,
  });
  const [voteOutcomesData, setVoteOutcomesData] = useState({
    winner: 0,
    tie: 0,
    noVotes: 0,
    inProgress: 0,
  });

  // Recent vote sessions
  const [recentSessions, setRecentSessions] = useState<VoteSessionDto[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchRecentSessions();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsData = await SupervisorService.getStats();
      setStats({
        ...stats,
        totalVoteSessions: statsData.totalVoteSessions,
        activeVoteSessions: statsData.activeVoteSessions, // Note: typo in DTO?
        totalSigners: statsData.totalSigners,
        totalUsers: statsData.supervisors + statsData.totalSigners,
        totalParticipants: statsData.totalParticipants,
        avgParticipantsPerSession: statsData.avgParticipantsPerSession,
      });

      // Fetch monthly sessions data
      const monthlyData = await SupervisorService.getMonthlySessions();
      const months = monthlyData.map((item) => item.month);
      const counts = monthlyData.map((item) => item.count);
      setMonthLabels(months);
      setMonthlySessionsData(counts);

      // Fetch account distribution
      const accountData = await SupervisorService.getAccountDistribution();
      setUserDistributionData({
        regularUsers: accountData.normalUsers,
        signers: accountData.signers,
        supervisors: accountData.supervisors,
      });

      // Fetch vote session outcomes
      const sessionOutcomes = await SupervisorService.getSessionDistribution();
      setVoteOutcomesData(sessionOutcomes);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentSessions = async () => {
    try {
      setSessionsLoading(true);
      const sessions = await VoteSessionService.getAllVoteSessions();

      // Sort by creation date (newest first)
      const sortedSessions = [...sessions].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Take just the most recent ones
      setRecentSessions(sortedSessions.slice(0, 5));
    } catch (error) {
      console.error("Error fetching recent sessions:", error);
      toast.error("Failed to load recent sessions");
    } finally {
      setSessionsLoading(false);
    }
  };

  // Determine session status
  const getSessionStatus = (session: VoteSessionDto) => {
    const now = new Date();
    const endDate = new Date(session.endDate);

    if (now < endDate) {
      return { label: "In Progress", color: "blue" };
    }

    // Session has ended - determine winner/tie/no votes
    if (!session.votes || session.votes.length === 0) {
      return { label: "No Votes", color: "gray" };
    }

    // Count votes by candidate
    const voteCounts = new Map<string, number>();
    session.candidates.forEach((candidate) => {
      voteCounts.set(candidate.id, 0);
    });

    session.votes.forEach((vote) => {
      if (vote.candidateId) {
        const currentCount = voteCounts.get(vote.candidateId) || 0;
        voteCounts.set(vote.candidateId, currentCount + 1);
      }
    });

    // Find max vote count
    const maxVotes = Math.max(...Array.from(voteCounts.values()));

    // Find candidates with max votes
    const winnersCount = Array.from(voteCounts.entries()).filter(
      ([, count]) => count === maxVotes
    ).length;

    if (winnersCount > 1) {
      return { label: "Tie", color: "yellow" };
    } else {
      return { label: "Winner", color: "green" };
    }
  };

  // Monthly vote sessions chart
  const votesOverTime = {
    xAxis: {
      type: "category",
      data:
        monthLabels.length > 0
          ? monthLabels
          : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      axisLabel: { color: "#666" },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#666" },
    },
    tooltip: { trigger: "axis" },
    series: [
      {
        name: "Vote Sessions",
        data:
          monthlySessionsData.length > 0
            ? monthlySessionsData
            : [3, 5, 2, 4, 3, 2, 1, 2, 4],
        type: "line",
        smooth: true,
        lineStyle: { width: 4, color: "#3b82f6" },
        itemStyle: { color: "#3b82f6" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(59, 130, 246, 0.5)" },
              { offset: 1, color: "rgba(59, 130, 246, 0.05)" },
            ],
          },
        },
      },
    ],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
  };

  // User distribution pie chart
  const userDistribution = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "center",
      data: ["Regular Users", "Signers", "Supervisors"],
    },
    series: [
      {
        name: "User Types",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: userDistributionData.regularUsers,
            name: "Regular Users",
            itemStyle: { color: "#3b82f6" },
          },
          {
            value: userDistributionData.signers,
            name: "Signers",
            itemStyle: { color: "#10b981" },
          },
          {
            value: userDistributionData.supervisors,
            name: "Supervisors",
            itemStyle: { color: "#f59e0b" },
          },
        ],
      },
    ],
  };

  // Vote results outcome distribution chart
  const voteResultsDistribution = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      bottom: 10,
      left: "center",
      data: ["Clear Winner", "Tie", "No Votes", "In Progress"],
    },
    series: [
      {
        name: "Vote Outcomes",
        type: "pie",
        radius: "65%",
        center: ["50%", "50%"],
        selectedMode: "single",
        itemStyle: { borderRadius: 5 },
        label: { formatter: "{b}: {d}%" },
        data: [
          {
            value: voteOutcomesData.winner,
            name: "Clear Winner",
            itemStyle: { color: "#10b981" },
          },
          {
            value: voteOutcomesData.tie,
            name: "Tie",
            itemStyle: { color: "#f59e0b" },
          },
          {
            value: voteOutcomesData.noVotes,
            name: "No Votes",
            itemStyle: { color: "#ef4444" },
          },
          {
            value: voteOutcomesData.inProgress,
            name: "In Progress",
            itemStyle: { color: "#6366f1" },
          },
        ],
      },
    ],
  };

  // Calculate participation data for recent sessions
  interface TooltipParams {
    name: string;
    data: number;
  }

  interface SeriesData {
    name: string;
    type: string;
    data: number[];
    itemStyle: {
      color: string;
    };
  }

  interface SessionParticipationChartData {
    tooltip: {
      trigger: string;
      axisPointer: {
        type: string;
      };
      formatter: (params: TooltipParams[]) => string;
    };
    legend: {
      data: string[];
    };
    grid: {
      left: string;
      right: string;
      bottom: string;
      top: string;
      containLabel: boolean;
    };
    xAxis: {
      type: string;
      data: string[];
      axisLabel: {
        interval: number;
        rotate: number;
        color: string;
      };
    };
    yAxis: {
      type: string;
      axisLabel: {
        color: string;
      };
    };
    series: SeriesData[];
  }

  const sessionParticipationData: SessionParticipationChartData = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: function (params: TooltipParams[]): string {
        const sessionName: string = params[0].name;
        const eligible: number = stats.totalUsers; // All users are eligible
        const participated: number = params[1].data; // Participants who got keys
        const rate: string = ((participated / eligible) * 100).toFixed(1);

        return `${sessionName}<br/>Eligible Users: ${eligible}<br/>Participants: ${participated}<br/>Participation Rate: ${rate}%`;
      },
    },
    legend: {
      data: ["Eligible Users", "Participants"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: recentSessions
        .slice(0, 6)
        .map((s: VoteSessionDto): string =>
          s.title.length > 10 ? s.title.substring(0, 10) + "..." : s.title
        ),
      axisLabel: {
        interval: 0,
        rotate: 30,
        color: "#666",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#666" },
    },
    series: [
      {
        name: "Eligible Users",
        type: "bar",
        data: recentSessions.slice(0, 6).map((): number => stats.totalUsers), // All users are eligible for each session
        itemStyle: { color: "#93c5fd" },
      },
      {
        name: "Participants",
        type: "bar",
        data: recentSessions
          .slice(0, 6)
          .map((s: VoteSessionDto): number => s.voteParticipants?.length || 0),
        itemStyle: { color: "#3b82f6" },
      },
    ],
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome, Supervisor</h2>
        <p className="opacity-90">
          Your complete dashboard for managing and monitoring voting activities
        </p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="w-1/2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="p-3 bg-gray-100 rounded-full">
                  <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Vote Sessions
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalVoteSessions}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
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
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">
                {stats.activeVoteSessions} active
              </span>
              <span className="text-sm text-gray-400 ml-2">right now</span>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Signers
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalSigners}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-blue-600">
                Verifying votes
              </span>
              <span className="text-sm text-gray-400 ml-2">
                and participants
              </span>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalUsers}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-purple-600">
                {stats.totalUsers - stats.totalSigners} voters
              </span>
              <span className="text-sm text-gray-400 ml-2">registered</span>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Participants
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalParticipants}
                </h3>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
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
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-amber-600">
                ~{stats.avgParticipantsPerSession}
              </span>
              <span className="text-sm text-gray-400 ml-2">
                avg per session
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vote Sessions Over Time */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Vote Sessions Over Time
          </h3>
          <div className="h-80">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ReactECharts option={votesOverTime} style={{ height: "100%" }} />
            )}
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            User Distribution
          </h3>
          <div className="h-80">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ReactECharts
                option={userDistribution}
                style={{ height: "100%" }}
              />
            )}
          </div>
        </div>

        {/* Vote Result Outcomes */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Vote Session Outcomes
          </h3>
          <div className="h-80">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ReactECharts
                option={voteResultsDistribution}
                style={{ height: "100%" }}
              />
            )}
          </div>
        </div>

        {/* Participation Rate by Session */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Participation Rate by Session
          </h3>
          <div className="h-80">
            {sessionsLoading ? (
              <div className="h-full w-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ReactECharts
                option={sessionParticipationData}
                style={{ height: "100%" }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Recent Vote Sessions */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Vote Sessions
          </h3>
          <button className="text-blue-600 text-sm hover:underline">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          {sessionsLoading ? (
            <div className="animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 mb-2 rounded"></div>
              ))}
            </div>
          ) : (
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
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentSessions.slice(0, 5).map((session) => {
                  const status = getSessionStatus(session);
                  const participated = session.voteParticipants?.length || 0; // People who got keys for this session
                  const voted = session.votes?.length || 0; // People who actually voted
                  // Eligible is all users in the system
                  const eligible = stats.totalUsers;

                  return (
                    <tr key={session.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(session.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">{participated}</span>
                        <span className="text-gray-400 mx-1">of</span>
                        <span>{eligible}</span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({voted} voted)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${status.color}-100 text-${status.color}-800`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {recentSessions.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-gray-500">
                      No vote sessions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
