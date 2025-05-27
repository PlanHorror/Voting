"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { VoteSessionService } from "@/services/vote-session.service";
import { AuthService } from "@/services/auth.service";
import { VoteSessionDto } from "@/dto/vote-session.dto";
import { toast } from "sonner";

export default function VotingList() {
  const [voteSessions, setVoteSessions] = useState<VoteSessionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<
    Record<string, { days: number; hours: number; minutes: number } | null>
  >({});

  // Check authentication status
  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());

    // Listen for auth changes
    const handleAuthChange = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  // Fetch vote sessions
  useEffect(() => {
    const fetchVoteSessions = async () => {
      try {
        const data = await VoteSessionService.getAllVoteSessions();
        setVoteSessions(data);

        // Initialize time remaining for each session
        const times: Record<string, string> = {};
        data.forEach((session) => {
          times[session.id] = isSessionActive(String(session.endDate))
            ? calculateTimeRemaining(String(session.endDate))
            : null;
        });
        setTimeRemaining(times);
      } catch (error) {
        console.error("Failed to fetch vote sessions:", error);
        toast.error("Failed to load vote sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchVoteSessions();
  }, []);

  // Update timers every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (voteSessions.length > 0) {
        const times: Record<string, string> = {};
        voteSessions.forEach((session) => {
          times[session.id] = isSessionActive(String(session.endDate))
            ? calculateTimeRemaining(String(session.endDate))
            : null;
        });
        setTimeRemaining(times);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [voteSessions]);

  const isSessionActive = (endDate: string): boolean => {
    const now = new Date();
    const sessionEndDate = new Date(endDate);
    return now < sessionEndDate;
  };

  const calculateTimeRemaining = (endDate: string) => {
    const now = new Date();
    const sessionEndDate = new Date(endDate);
    const difference = sessionEndDate.getTime() - now.getTime();

    if (difference <= 0) {
      return null;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  const handleVoteClick = (id: string) => {
    if (isAuthenticated) {
      toast.warning(
        "You should logout before voting to make vote information secure"
      );
      return;
    }

    // If not authenticated, navigate to voting page
    window.location.href = `/voting/${id}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Vote List
      </h2>
      <div className="space-y-4">
        {voteSessions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No votes available at this time
          </p>
        ) : (
          voteSessions.map((vote) => {
            const active = isSessionActive(String(vote.endDate));
            const time = timeRemaining[vote.id];

            return (
              <div
                key={vote.id}
                className="flex flex-col p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-800">
                    {vote.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                    {active ? "Active" : "Ended"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {vote.description}
                </p>

                {time && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span>Time remaining:</span>
                    <span className="font-medium">
                      {time.days}d {time.hours}h {time.minutes}m
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    Candidates: {vote.candidates?.length || 0}
                  </span>

                  <button
                    onClick={() => handleVoteClick(vote.id)}
                    disabled={!active}
                    className={`px-4 py-1.5 text-sm font-medium cursor-pointer ${
                      active
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    } rounded transition`}>
                    {active ? "Vote" : "Ended"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
