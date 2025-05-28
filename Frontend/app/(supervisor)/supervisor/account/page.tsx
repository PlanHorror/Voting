"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { SupervisorService } from "@/services/supervisor.service";
import { SupervisorDto } from "@/dto/supervisor.dto";
import { AuthService } from "@/services/auth.service";
import Link from "next/link";

export default function SupervisorAccountsPage() {
  const [supervisors, setSupervisors] = useState<SupervisorDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch supervisors and current user ID on component mount
  useEffect(() => {
    // Get current user id
    const userId = AuthService.getUserId();
    console.log("Current User ID:", userId);
    setCurrentUserId(userId);

    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      setLoading(true);
      const data = await SupervisorService.getAllSupervisors();
      setSupervisors(data);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
      toast.error("Failed to load supervisors");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Confirm deletion
    if (
      !confirm(
        "Are you sure you want to delete this supervisor? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      await SupervisorService.deleteSupervisor(id);
      setSupervisors(supervisors.filter((supervisor) => supervisor.id !== id));
      toast.success("Supervisor deleted successfully");
    } catch (error) {
      console.error("Error deleting supervisor:", error);
      toast.error("Failed to delete supervisor");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="mb-8">
        {/* Header with "Create Supervisor" button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Supervisor Accounts
          </h1>
          <Link
            href="/supervisor/account/create"
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
            Create New Supervisor
          </Link>
        </div>
        <p className="text-gray-600 mt-1">
          Manage supervisor accounts for the voting system
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-700">
            Total Supervisors
          </h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {supervisors.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-700">Recently Added</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {
              supervisors.filter(
                (s) =>
                  new Date(s.createdAt) >
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length
            }
          </p>
          <p className="text-xs text-gray-500 mt-1">In the last 30 days</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-700">
            Recently Updated
          </h2>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {
              supervisors.filter(
                (s) =>
                  new Date(s.updatedAt) >
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length
            }
          </p>
          <p className="text-xs text-gray-500 mt-1">In the last 30 days</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : supervisors.length === 0 ? (
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
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-700">
            No supervisors found
          </h2>
          <p className="text-gray-500 mt-2">
            There are currently no supervisor accounts in the system
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {supervisors.map((supervisor) => (
                  <tr
                    key={supervisor.id}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                          {supervisor.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {supervisor.username}
                          {supervisor.id === currentUserId && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {formatDate(supervisor.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {formatDate(supervisor.updatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {supervisor.id !== currentUserId ? (
                        <button
                          onClick={() => handleDelete(supervisor.id)}
                          disabled={deletingId === supervisor.id}
                          className={`text-red-600 hover:text-red-900 ${
                            deletingId === supervisor.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}>
                          {deletingId === supervisor.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      ) : (
                        <span className="text-gray-400">(Current account)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
        <div className="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-500 mr-2 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="font-medium text-yellow-800">
              Important Security Note
            </h3>
            <p className="text-yellow-700 mt-1">
              Supervisors have full access to create and manage vote sessions.
              Only delete supervisor accounts when absolutely necessary. Each
              deletion is logged for security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
