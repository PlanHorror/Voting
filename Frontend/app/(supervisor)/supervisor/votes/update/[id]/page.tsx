"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { VoteSessionService } from "@/services/vote-session.service";
import { AuthService } from "@/services/auth.service";
import { SignerService } from "@/services/signer.service";
import { CandidateCreateDto } from "@/dto/candidate.dto";
import { SignerDto } from "@/dto/signer.dto";
import { VoteSessionDto } from "@/dto/vote-session.dto";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import Link from "next/link";

interface CandidateInputProps {
  index: number;
  candidate: CandidateCreateDto;
  updateCandidate: (index: number, candidate: CandidateCreateDto) => void;
  removeCandidate: (index: number) => void;
}

// Candidate component for dynamic form
const CandidateInput = ({
  index,
  candidate,
  updateCandidate,
  removeCandidate,
}: CandidateInputProps) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white mb-4 shadow-sm hover:shadow transition-all">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-medium text-blue-800">
          Candidate #{index + 1}
        </h3>
        <button
          type="button"
          onClick={() => removeCandidate(index)}
          className="text-red-500 hover:text-red-700 text-sm flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Remove
        </button>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name*
        </label>
        <input
          type="text"
          value={candidate.name}
          onChange={(e) =>
            updateCandidate(index, { ...candidate, name: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter candidate name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description*
        </label>
        <textarea
          value={candidate.description}
          onChange={(e) =>
            updateCandidate(index, {
              ...candidate,
              description: e.target.value,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter candidate description"
          rows={3}
          required
        />
      </div>
    </div>
  );
};

export default function UpdateVoteSessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [signers, setSigners] = useState<SignerDto[]>([]);
  const [loadingSigners, setLoadingSigners] = useState(true);
  const [originalSession, setOriginalSession] = useState<VoteSessionDto | null>(
    null
  );

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    endDate: "",
    supervisorId: "",
    signerId: "",
  });

  // Format date function for API
  const formatDateForApi = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  // Format date function for UI display (YYYY-MM-DD)
  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Get minimum valid end date (either original end date or today, whichever is later)
  const getMinEndDate = (): string => {
    if (!originalSession) return "";

    const originalDate = new Date(originalSession.endDate);
    const today = new Date();

    return originalDate > today
      ? formatDateForInput(originalSession.endDate.toString())
      : dayjs().format("YYYY-MM-DD");
  };

  const [candidates, setCandidates] = useState<CandidateCreateDto[]>([
    { name: "", description: "" },
    { name: "", description: "" },
  ]);

  const [errors, setErrors] = useState({
    title: "",
    endDate: "",
    supervisorId: "",
    signerId: "",
    candidates: "",
  });

  // Fetch original vote session and signers on component mount
  useEffect(() => {
    if (!sessionId) {
      toast.error("No vote session ID provided");
      router.push("/supervisor/votes");
      return;
    }

    const fetchVoteSession = async () => {
      try {
        setIsLoading(true);
        const session = await VoteSessionService.getVoteSessionById(sessionId);
        setOriginalSession(session);

        // Initialize form data with session values
        setFormData({
          title: session.title,
          description: session.description || "",
          endDate: formatDateForInput(session.endDate.toString()),
          supervisorId: session.supervisorId,
          signerId: session.signerId,
        });

        // Initialize candidates from session data
        if (session.candidates && session.candidates.length > 0) {
          setCandidates(
            session.candidates.map((c) => ({
              name: c.name,
              description: c.description || "",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching vote session:", error);
        toast.error("Failed to load vote session data");
        router.push("/supervisor/votes");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSigners = async () => {
      try {
        setLoadingSigners(true);
        const fetchedSigners = await SignerService.getAllSigners();
        setSigners(fetchedSigners);
      } catch (error) {
        console.error("Error fetching signers:", error);
        toast.error("Failed to load signers");
      } finally {
        setLoadingSigners(false);
      }
    };

    fetchVoteSession();
    fetchSigners();
  }, [sessionId, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is modified
    if (name in errors && errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const updateCandidate = (
    index: number,
    updatedCandidate: CandidateCreateDto
  ): void => {
    const newCandidates = [...candidates];
    newCandidates[index] = updatedCandidate;
    setCandidates(newCandidates);

    // Clear candidate error if we have at least 2 complete candidates
    if (errors.candidates) {
      const completeCandidate = newCandidates.filter(
        (c) => c.name.trim() !== "" && c.description.trim() !== ""
      );
      if (completeCandidate.length >= 2) {
        setErrors({
          ...errors,
          candidates: "",
        });
      }
    }
  };

  const addCandidate = () => {
    setCandidates([...candidates, { name: "", description: "" }]);
  };

  const removeCandidate = (index: number) => {
    if (candidates.length <= 2) {
      toast.error("At least two candidates are required");
      return;
    }

    const newCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(newCandidates);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    // End date validation
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
      isValid = false;
    }

    // Signer validation
    if (!formData.signerId) {
      newErrors.signerId = "Signer is required";
      isValid = false;
    }

    // Candidates validation - ensure both name and description are provided
    const validCandidates = candidates.filter(
      (c) => c.name.trim() !== "" && c.description.trim() !== ""
    );

    if (validCandidates.length < 2) {
      newErrors.candidates =
        "At least two candidates with both name and description are required";
      isValid = false;
    }

    // Check if any candidate has name but missing description or vice versa
    const incompleteCandidate = candidates.find(
      (c) =>
        (c.name.trim() !== "" && c.description.trim() === "") ||
        (c.name.trim() === "" && c.description.trim() !== "")
    );

    if (incompleteCandidate) {
      newErrors.candidates =
        "All candidates must have both name and description filled";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Additional validation to ensure no field is empty
    if (!formData.title.trim() || !formData.endDate || !formData.signerId) {
      toast.error("All required fields must be filled");
      return;
    }

    if (!validateForm() || !sessionId || !originalSession) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the vote session data
      const voteSessionData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        endDate: formatDateForApi(formData.endDate),
        supervisorId: formData.supervisorId || AuthService.getUserId() || "",
      };

      // Filter and validate candidates - ensure both name and description are provided
      const validCandidates = candidates
        .filter((c) => c.name.trim() !== "" && c.description.trim() !== "")
        .map((c) => ({
          name: c.name.trim(),
          description: c.description.trim(),
        }));

      if (validCandidates.length < 2) {
        toast.error("At least two complete candidates are required");
        return;
      }

      // 1. Update the vote session
      await VoteSessionService.updateVoteSession(sessionId, voteSessionData);

      // 2. Delete all existing candidates
      await VoteSessionService.deleteAllCandidatesForVoteSession(sessionId);

      // 3. Create new candidates
      if (validCandidates.length > 0) {
        await VoteSessionService.createManyCandidates(
          sessionId,
          validCandidates
        );
      }

      toast.success("Vote session updated successfully!");
      router.push("/supervisor/votes");
    } catch (error) {
      console.error("Error updating vote session:", error);
      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 400) {
          toast.error("Invalid vote session data. Please check your entries.");
        } else if (error.response && error.response.status === 401) {
          toast.error("You're not authorized to update vote sessions.");
          router.push("/login");
        } else {
          toast.error("Failed to update vote session. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Update Vote Session
        </h1>
        <button
          onClick={() => router.push("/supervisor/votes")}
          className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-50 p-6 rounded-lg shadow">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Update vote session by modifying the fields below. All
                candidates must have both name and description. Any changes to
                candidates will replace the existing ones.
              </p>
            </div>
          </div>
        </div>

        {/* Session Details Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Session Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter vote session title"
                required
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date*
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={getMinEndDate()}
                className={`w-full px-3 py-2 border ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.endDate && (
                <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                End date must be on or after the original date
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter session description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signer*
              </label>
              {loadingSigners ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="text-gray-500">Loading signers...</span>
                </div>
              ) : (
                <select
                  name="signerId"
                  value={formData.signerId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.signerId ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                  required
                  disabled={signers.length === 0}>
                  <option value="">Select a signer</option>
                  {signers.length > 0 ? (
                    signers.map((signer) => (
                      <option key={signer.id} value={signer.id}>
                        {signer.username}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No signers available
                    </option>
                  )}
                </select>
              )}
              {errors.signerId && (
                <p className="mt-1 text-xs text-red-500">{errors.signerId}</p>
              )}
              {signers.length === 0 && !loadingSigners && (
                <p className="mt-1 text-xs text-yellow-600">
                  No signers found. Please{" "}
                  <Link href="/supervisor/signers" className="underline">
                    create a signer
                  </Link>{" "}
                  first.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Candidates Section */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Candidates</h2>
            <button
              type="button"
              onClick={addCandidate}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Candidate
            </button>
          </div>

          {errors.candidates && (
            <div className="mb-4 p-2 border border-red-200 rounded bg-red-50 text-sm text-red-600">
              {errors.candidates}
            </div>
          )}

          <div className="space-y-4">
            {candidates.map((candidate, index) => (
              <CandidateInput
                key={index}
                index={index}
                candidate={candidate}
                updateCandidate={updateCandidate}
                removeCandidate={removeCandidate}
              />
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={addCandidate}
              className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Another Candidate
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/supervisor/votes")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="submit"
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting || loadingSigners || signers.length === 0}>
            {isSubmitting && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Update Vote Session
          </button>
        </div>
      </form>
    </div>
  );
}
