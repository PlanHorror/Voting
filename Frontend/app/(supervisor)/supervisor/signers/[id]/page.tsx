"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { SignerService } from "@/services/signer.service";
import { SignerDto } from "@/dto/signer.dto";

export default function SignerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const signerId = params.id as string;

  const [signer, setSigner] = useState<SignerDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSigner = async () => {
      setLoading(true);
      try {
        const data = await SignerService.getSignerById(signerId);
        setSigner(data);
      } catch (error) {
        console.error("Error fetching signer:", error);
        toast.error("Failed to load signer details");
      } finally {
        setLoading(false);
      }
    };

    fetchSigner();
  }, [signerId]);

  const handleDeleteSigner = async () => {
    if (!signer) return;

    if (
      !confirm(
        `Are you sure you want to delete ${signer.username}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await SignerService.deleteSigner(signerId);
      toast.success("Signer deleted successfully");
      router.push("/supervisor/signers");
    } catch (error) {
      console.error("Error deleting signer:", error);
      toast.error("Failed to delete signer");
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!signer) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-700">
            Signer not found
          </h2>
          <p className="text-gray-500 mt-2">
            The signer you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
          <Link
            href="/supervisor/signers"
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Back to Signers List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Toaster position="top-right" richColors />

      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Link
            href="/supervisor/signers"
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
          <h1 className="text-2xl font-bold text-gray-800">Signer Details</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleDeleteSigner}
            disabled={isDeleting}
            className={`flex items-center px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors ${
              isDeleting ? "opacity-70 cursor-not-allowed" : ""
            }`}>
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete Signer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signer Information Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-2 bg-blue-500"></div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                  {signer.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    @{signer.username}
                  </h2>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mt-1 inline-block">
                    Active
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{signer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{signer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium text-gray-800">
                    {formatDateTime(signer.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-800">
                    {formatDateTime(signer.updatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Vote Sessions</p>
                  <p className="font-medium text-gray-800">
                    {signer._count.voteSessions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vote Sessions List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Vote Sessions
              </h2>
            </div>

            {signer.voteSessions && signer.voteSessions.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {signer.voteSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          href={`/supervisor/votes/${session.id}`}
                          className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors">
                          {session.title}
                        </Link>
                        <p className="text-gray-600 mt-1">
                          {session.description}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          new Date(session.endDate) > new Date()
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {new Date(session.endDate) > new Date()
                          ? "Active"
                          : "Ended"}
                      </span>
                    </div>
                    <div className="flex items-center mt-3 text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      End Date: {formatDate(session.endDate)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-300 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-700">
                  No vote sessions found
                </h3>
                <p className="text-gray-500 mt-1">
                  This signer hasn&apos;t been assigned to any vote sessions
                  yet.
                </p>
                <Link
                  href="/supervisor/votes/create"
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Create a Vote Session
                </Link>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Activity</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-sm text-blue-700 mb-1">
                    Active Vote Sessions
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {
                      signer.voteSessions.filter(
                        (session) => new Date(session.endDate) > new Date()
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <p className="text-sm text-green-700 mb-1">
                    Completed Vote Sessions
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    {
                      signer.voteSessions.filter(
                        (session) => new Date(session.endDate) <= new Date()
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
