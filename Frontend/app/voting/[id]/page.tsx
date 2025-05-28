"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { VoteSessionService } from "@/services/vote-session.service";
import { VoteSessionDto } from "@/dto/vote-session.dto";
import { CandidateDto } from "@/dto/candidate.dto";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function VoteCastPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = params;

  const [voteSession, setVoteSession] = useState<VoteSessionDto | null>(null);
  const [candidates, setCandidates] = useState<CandidateDto[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );
  const [keyInput, setKeyInput] = useState(searchParams.get("key") || "");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch vote session data
  useEffect(() => {
    const fetchVoteSession = async () => {
      if (!id || typeof id !== "string") {
        toast.error("Invalid vote session ID");
        router.push("/voting");
        return;
      }

      try {
        setLoading(true);
        const data = await VoteSessionService.getVoteSessionById(id);

        // Check if vote session is active
        const isActive = new Date() < new Date(data.endDate);
        if (!isActive) {
          toast.error("This vote session has ended");
          router.push("/voting");
          return;
        }

        setVoteSession(data);
        setCandidates(data.candidates || []);
      } catch (error) {
        console.error("Failed to fetch vote session:", error);
        toast.error("Failed to load vote session");
        router.push("/voting");
      } finally {
        setLoading(false);
      }
    };

    fetchVoteSession();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyInput || !selectedCandidate) {
      toast.error("Please enter your key and select a candidate");
      return;
    }

    if (!voteSession) {
      toast.error("Vote session data not available");
      return;
    }

    try {
      setSubmitting(true);
      // Cast vote
      await VoteSessionService.castVote(
        voteSession.id,
        selectedCandidate,
        keyInput
      );

      toast.success("Your vote has been cast successfully!");

      // Redirect to results page after successful vote
      setTimeout(() => {
        router.push("/result");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          if (
            error.response.status === 400 ||
            error.response.status === 404 ||
            error.response.status === 409
          ) {
            toast.error("Invalid key or you have already voted");
          } else {
            toast.error("Failed to cast vote");
          }
        } else {
          toast.error("Failed to connect to voting service");
        }
      }
    } finally {
      setSubmitting(false);
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
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600">
          Vote session not found
        </h1>
        <p className="mt-4 text-gray-600">
          The requested vote session could not be loaded
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {voteSession.title}
        </h1>
        <p className="text-sm text-gray-500 mb-4">{voteSession.description}</p>
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs text-gray-400">
            End date: {new Date(voteSession.endDate).toLocaleDateString()}
          </p>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Anonymous Voting
          </span>
        </div>

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
              readOnly={!!searchParams.get("key")}
            />
            {!!searchParams.get("key") && (
              <p className="mt-1 text-xs text-blue-600">
                Your key has been pre-filled from the previous page
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a Candidate
            </label>
            <div className="space-y-3">
              {candidates.map((candidate) => {
                // console.log(candidate.hashId);
                return (
                  <label
                    key={candidate.hashId}
                    className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition ${
                      selectedCandidate === candidate.hashId
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}>
                    <input
                      type="radio"
                      name="candidate"
                      value={candidate.hashId}
                      onChange={() => setSelectedCandidate(candidate.hashId)}
                      className="form-radio text-blue-600 mr-3"
                      checked={selectedCandidate === candidate.hashId}
                    />
                    <span className="text-gray-800 font-medium">
                      {candidate.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full ${
              submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2.5 rounded-lg shadow transition duration-200`}>
            {submitting ? "Submitting..." : "Submit Vote"}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Your vote is anonymous and cannot be traced back to you
          </p>
        </form>
      </div>
    </div>
  );
}
