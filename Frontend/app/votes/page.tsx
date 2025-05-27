"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { VoteSessionService } from "@/services/vote-session.service";
import { VoteSessionDto } from "@/dto/vote-session.dto";
import { toast } from "sonner";

const DEFAULT_IMAGE = "/banner.jpg";

export default function VoteListPage() {
  const [voteSessions, setVoteSessions] = useState<VoteSessionDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoteSessions = async () => {
      try {
        const data = await VoteSessionService.getAllVoteSessions();
        setVoteSessions(data);
      } catch (error: unknown) {
        console.error("Failed to fetch vote sessions:", error);
        toast.error("Failed to load vote sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchVoteSessions();
  }, []);

  const isSessionActive = (endDate: string): boolean => {
    const now = new Date();
    const sessionEndDate = new Date(endDate);
    return now < sessionEndDate;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (voteSessions.length === 0) {
    return (
      <div className="bg-gray-100 py-10 px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Available Votes
        </h1>
        <div className="text-center py-20 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
          <h2 className="text-xl text-gray-600">
            No votes available at this time
          </h2>
          <p className="mt-2 text-gray-500">
            Check back later for upcoming votes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-10 px-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Available Votes
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {voteSessions.map((session) => {
          const active = isSessionActive(String(session.endDate));

          return (
            <div
              key={session.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg relative">
              {/* Status Badge */}
              <div
                className={`absolute top-0 right-0 m-4 px-3 py-1 font-semibold text-white rounded-full ${
                  active ? "bg-green-500" : "bg-red-500"
                }`}>
                {active ? "Active" : "Ended"}
              </div>

              <Image
                src={DEFAULT_IMAGE}
                alt="Vote Banner"
                width={500}
                height={300}
                className={`w-full h-40 object-cover ${
                  !active && "opacity-70 grayscale"
                }`}
              />

              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  {session.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {session.description}
                </p>

                <div className="mt-4 text-sm text-gray-500 space-y-1">
                  <p>
                    <span className="font-medium text-gray-700">Status:</span>{" "}
                    <span
                      className={
                        active
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }>
                      {active ? "Open for voting" : "Voting closed"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">End Date:</span>{" "}
                    {new Date(session.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Total Candidates:
                    </span>{" "}
                    {session.candidates?.length || 0}
                  </p>
                </div>

                <div className="mt-6 flex justify-end w-full">
                  <Link
                    className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-700 rounded transition duration-150 hover:bg-green-200 w-full justify-center"
                    href={`/votes/${session.id}`}>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    More Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
