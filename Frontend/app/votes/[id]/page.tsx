"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { VoteSessionService } from "@/services/vote-session.service";
import { AuthService } from "@/services/auth.service";
import { VoteSessionDto } from "@/dto/vote-session.dto";
import { CandidateDto } from "@/dto/candidate.dto";
import { toast } from "sonner";

const DEFAULT_IMAGE = "/banner.jpg";

export default function VoteDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [voteSession, setVoteSession] = useState<VoteSessionDto | null>(null);
  const [candidates, setCandidates] = useState<CandidateDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Add new state for key modal
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [voteKey, setVoteKey] = useState<string | null>(null);
  const [keyLoading, setKeyLoading] = useState(false);

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

  useEffect(() => {
    const fetchVoteSessionData = async () => {
      try {
        if (typeof id !== "string") {
          toast.error("Invalid vote session ID");
          router.push("/votes");
          return;
        }

        const sessionData = await VoteSessionService.getVoteSessionById(id);

        // Use candidates from the session data directly
        setVoteSession(sessionData);
        setCandidates(sessionData.candidates || []);

        const endDate = new Date(sessionData.endDate);
        setIsSessionActive(new Date() < endDate);
      } catch (error) {
        console.error("Failed to fetch vote session details:", error);
        toast.error("Failed to load vote session details");
        router.push("/votes");
      } finally {
        setLoading(false);
      }
    };

    fetchVoteSessionData();
  }, [id, router]);

  // Update countdown timer every second
  useEffect(() => {
    if (!voteSession) return;

    const endDate = new Date(voteSession.endDate);

    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsSessionActive(false);
        setTimeRemaining(null);
        return;
      }

      setIsSessionActive(true);

      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [voteSession]);

  const handleGetKey = async () => {
    if (!voteSession || !isSessionActive) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      toast.info("Please login to continue");
      router.push("/login");
      return;
    }

    setKeyLoading(true);

    try {
      const response = await VoteSessionService.getVoteParticipantKey(
        voteSession.id
      );

      // Show key to user in a modal
      setVoteKey(response.key);
      setShowKeyModal(true);
    } catch (error: any) {
      // Check for specific error status
      if (error.response && error.response.status === 400) {
        toast.error("You have already taken a key for this vote session");
      } else {
        toast.error("Something went wrong when attempting to get a key");
      }
    } finally {
      setKeyLoading(false);
    }
  };

  // Handle closing the modal and navigating
  const handleCloseKeyModal = () => {
    setShowKeyModal(false);
    setVoteKey(null);
  };

  // Handle copying key to clipboard
  const handleCopyKey = () => {
    if (voteKey) {
      navigator.clipboard.writeText(voteKey);
      toast.success("Key copied to clipboard");
    }
  };

  // Handle proceeding to vote page
  const handleProceedToVote = () => {
    if (voteKey && voteSession) {
      router.push(`/voting?sessionId=${voteSession.id}&key=${voteKey}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!voteSession) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          Vote session not found
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Key Modal */}
      {showKeyModal && voteKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-red-600 mb-2">Important!</h3>
            <p className="text-gray-700 mb-4">
              This is your voting key. It will be shown only once. Please save
              it somewhere safe. You will need this key to cast your vote.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <p className="font-mono text-center break-all select-all text-lg">
                {voteKey}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleCopyKey}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                Copy Key
              </button>
              <button
                onClick={handleProceedToVote}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded transition">
                I&aposve Saved My Key - Proceed to Vote
              </button>
              <button
                onClick={handleCloseKeyModal}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition mt-2">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Image */}
      <div className="relative w-full h-64 mb-6 overflow-hidden rounded-xl shadow-lg">
        <Image
          src={DEFAULT_IMAGE}
          alt={voteSession.title}
          fill
          style={{ objectFit: "cover" }}
          priority
          className="transition-transform hover:scale-105 duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="absolute bottom-0 p-6 w-full">
            <h1 className="text-3xl font-bold text-white mb-2">
              {voteSession.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Description and Status Section */}
        <div className="p-6 border-b border-gray-100">
          <p className="text-gray-700 text-lg mb-4">
            {voteSession?.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded-full text-white text-xs ${
                    isSessionActive ? "bg-green-500" : "bg-red-500"
                  }`}>
                  {isSessionActive ? "Active" : "Ended"}
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">End Date:</span>{" "}
                {voteSession &&
                  new Date(voteSession.endDate).toLocaleDateString()}{" "}
                at{" "}
                {voteSession &&
                  new Date(voteSession.endDate).toLocaleTimeString()}
              </p>
            </div>

            {/* Vote Button - Modified for loading state */}
            <div>
              <button
                onClick={handleGetKey}
                disabled={!isSessionActive || keyLoading}
                className={`px-6 py-3 ${
                  isSessionActive && !keyLoading
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white rounded-full transition shadow-md hover:shadow-lg font-medium`}>
                {!isSessionActive
                  ? "Vote Ended"
                  : keyLoading
                  ? "Loading..."
                  : isAuthenticated
                  ? "Take Key & Vote"
                  : "Login to Vote"}
              </button>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        {timeRemaining && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              Time Remaining
            </h2>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white shadow-md rounded-lg p-3 min-w-[80px] flex-1">
                <div className="text-2xl font-bold text-blue-600">
                  {timeRemaining.days}
                </div>
                <div className="text-xs text-gray-600">Days</div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-3 min-w-[80px] flex-1">
                <div className="text-2xl font-bold text-blue-600">
                  {timeRemaining.hours}
                </div>
                <div className="text-xs text-gray-600">Hours</div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-3 min-w-[80px] flex-1">
                <div className="text-2xl font-bold text-blue-600">
                  {timeRemaining.minutes}
                </div>
                <div className="text-xs text-gray-600">Minutes</div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-3 min-w-[80px] flex-1">
                <div className="text-2xl font-bold text-blue-600">
                  {timeRemaining.seconds}
                </div>
                <div className="text-xs text-gray-600">Seconds</div>
              </div>
            </div>
          </div>
        )}

        {/* Candidates Section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Candidates
          </h2>
          {candidates.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600 italic">
                No candidates available for this vote session.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                      {candidate.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {candidate.description}
                      </p>
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
