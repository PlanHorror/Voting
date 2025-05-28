"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { SignerService } from "@/services/signer.service";
import { SignerDto } from "@/dto/signer.dto";

export default function SignersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [signers, setSigners] = useState<SignerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch signers on component mount
  useEffect(() => {
    fetchSigners();
  }, []);

  const fetchSigners = async () => {
    try {
      setLoading(true);
      const fetchedSigners = await SignerService.getAllSigners();
      setSigners(fetchedSigners);
    } catch (error) {
      console.error("Error fetching signers:", error);
      toast.error("Failed to load signers");
    } finally {
      setLoading(false);
    }
  };

  // Filter signers based on search term
  const filteredSigners = signers.filter(
    (signer) =>
      signer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    // Confirm deletion
    if (
      !confirm(
        "Are you sure you want to delete this signer? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      await SignerService.deleteSigner(id);
      setSigners(signers.filter((signer) => signer.id !== id));
      toast.success("Signer deleted successfully");
    } catch (error) {
      console.error("Error deleting signer:", error);
      toast.error("Failed to delete signer");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <Toaster position="top-right" richColors />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Signers Management</h1>
        <Link
          href="/supervisor/signers/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New Signer
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search signers..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Total Signers: <span className="font-medium">{signers.length}</span>{" "}
            | Showing:{" "}
            <span className="font-medium">{filteredSigners.length}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredSigners.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-700">
            No signers found
          </h2>
          <p className="text-gray-500 mt-2">
            Try adjusting your search criteria or create a new signer.
          </p>
          <Link
            href="/supervisor/signers/create"
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Create New Signer
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSigners.map((signer) => (
            <div
              key={signer.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-2 bg-blue-500"></div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      @{signer.username}
                    </h3>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Active
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-gray-600">{signer.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-gray-600">{signer.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600">
                      Created: {formatDate(String(signer.createdAt))}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600">
                      {signer._count?.voteSessions || 0} vote sessions
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600">
                      Updated: {formatDate(String(signer.updatedAt))}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between">
                  <Link
                    href={`/supervisor/signers/${signer.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </Link>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDelete(signer.id)}
                      disabled={deletingId === signer.id}
                      className={`text-red-500 hover:text-red-700 text-sm font-medium ${
                        deletingId === signer.id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}>
                      {deletingId === signer.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
