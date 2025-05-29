"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast, Toaster } from "sonner";
import ReactECharts from "echarts-for-react";
import { VoteSessionService } from "@/services/vote-session.service";
import { VoteSessionDto } from "@/dto/vote-session.dto";
import { VoteDto } from "@/dto/vote.dto";
import Link from "next/link";

export default function VoteSessionDetailPage() {
  const { id } = useParams();
  const [voteSession, setVoteSession] = useState<VoteSessionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [votesOverTime, setVotesOverTime] = useState<any>({});

  // Fetch vote session data
  useEffect(() => {
    const fetchVoteSession = async () => {
      if (typeof id !== "string") return;

      try {
        setLoading(true);
        const data = await VoteSessionService.getVoteSessionById(id);
        setVoteSession(data);

        // Process vote data for the chart once we have it
        if (data.votes && data.votes.length > 0) {
          processVoteDataForChart(data.votes);
        }
      } catch (error) {
        console.error("Error fetching vote session:", error);
        toast.error("Failed to load vote session");
      } finally {
        setLoading(false);
      }
    };

    fetchVoteSession();
  }, [id]);

  // Process votes to create time-based data for the chart
  const processVoteDataForChart = (votes: VoteDto[]) => {
    // Sort votes by timestamp
    const sortedVotes = [...votes].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Group votes by hour
    const votesByHour = new Map();
    const voteDates: string[] = [];
    const voteCounts: number[] = [];
    let cumulativeCount = 0;

    sortedVotes.forEach((vote) => {
      const date = new Date(vote.createdAt);
      const hourKey = `${date.toLocaleDateString()} ${date.getHours()}:00`;

      if (!votesByHour.has(hourKey)) {
        votesByHour.set(hourKey, 0);
        voteDates.push(hourKey);
      }

      const currentCount = votesByHour.get(hourKey) + 1;
      votesByHour.set(hourKey, currentCount);
    });

    // Build cumulative vote counts
    votesByHour.forEach((count) => {
      cumulativeCount += count;
      voteCounts.push(cumulativeCount);
    });

    // Create chart option
    const chartOption = {
      title: {
        text: "Votes Over Time",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params: any) {
          const date = params[0].name;
          const count = params[0].value;
          const hourlyCount = params.length > 1 ? params[1].value : 0;
          return `${date}<br/>Total Votes: ${count}<br/>Votes in this hour: ${hourlyCount}`;
        },
      },
      legend: {
        data: ["Cumulative Votes", "Hourly Votes"],
        bottom: 10,
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
        data: voteDates,
        axisLabel: {
          rotate: 45,
          interval: Math.ceil(voteDates.length / 10),
        },
      },
      yAxis: {
        type: "value",
        name: "Votes",
        minInterval: 1,
      },
      series: [
        {
          name: "Cumulative Votes",
          type: "line",
          data: voteCounts,
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
        {
          name: "Hourly Votes",
          type: "bar",
          data: Array.from(votesByHour.values()),
          barWidth: "60%",
          itemStyle: { color: "#10b981" },
        },
      ],
    };

    setVotesOverTime(chartOption);
  };

  // Format date for display
  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!voteSession) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl text-gray-600 mb-4">Vote Session Not Found</h2>
          <p className="text-gray-500 mb-6">
            The requested vote session could not be found.
          </p>
          <Link
            href="/signer"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Toaster position="top-right" richColors />

      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Link
          href="/signer"
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          {voteSession.title}
        </h1>
      </div>

      {/* Session Details Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-gray-600">{voteSession.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <span className="text-sm font-medium text-gray-500">
                End date:{" "}
                <span className="text-gray-800">
                  {formatDate(voteSession.endDate)}
                </span>
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  new Date() < new Date(voteSession.endDate)
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                {new Date() < new Date(voteSession.endDate)
                  ? "Active"
                  : "Ended"}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="block text-sm text-blue-800 font-medium">
              Total Votes
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {voteSession.votes?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Votes Over Time Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Votes Over Time
        </h2>
        <div className="h-80">
          {voteSession.votes?.length ? (
            <ReactECharts option={votesOverTime} style={{ height: "100%" }} />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">No vote data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Votes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Votes</h2>
          <p className="mt-1 text-sm text-gray-500">
            The most recent votes in this session (data hidden for privacy
            protection)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {voteSession.votes?.length ? (
                [...voteSession.votes]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .slice(0, 10)
                  .map((vote) => (
                    <tr key={vote.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {vote.id.substring(0, 2)}***
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(vote.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Recorded
                        </span>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-gray-500">
                    No votes recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
