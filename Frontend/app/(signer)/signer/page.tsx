"use client";

import React from "react";

export default function SignerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Welcome, Signer
        </h2>
        <p className="text-gray-600">
          This is your dashboard where you can manage your signing activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Pending Signatures
          </h3>
          <p className="text-gray-600">
            You have 0 documents waiting for your signature.
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-medium text-green-800 mb-2">
            Completed Signatures
          </h3>
          <p className="text-gray-600">You have signed 0 documents.</p>
        </div>
      </div>
    </div>
  );
}
