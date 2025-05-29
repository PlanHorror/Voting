"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { UserService } from "@/services/user.service";
import { UserUpdateDto } from "@/dto/auth.dto";
import { AxiosError } from "axios";
import { AuthService } from "@/services/auth.service";

export default function UserProfilePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Form data
  const [formData, setFormData] = useState<{
    citizenId: string;
    phone: string;
    old_password: string;
    new_password: string;
    confirm_password: string;
  }>({
    citizenId: "",
    phone: "",
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Form errors
  const [errors, setErrors] = useState({
    citizenId: "",
    phone: "",
    old_password: "",
    new_password: "",
    confirm_password: "",
    general: "",
  });

  // Fetch current user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const profile = await UserService.getUserProfile();

        // Initialize form with current data
        setFormData({
          citizenId: profile.citizenId || "",
          phone: profile.phone || "",
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load your profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Check if password fields should be shown
  useEffect(() => {
    setShowPasswordFields(formData.old_password.length > 0);
  }, [formData.old_password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      citizenId: "",
      phone: "",
      old_password: "",
      new_password: "",
      confirm_password: "",
      general: "",
    };

    // Citizen ID validation (13 digits for Thai ID)
    if (!formData.citizenId.trim()) {
      newErrors.citizenId = "Citizen ID is required";
      isValid = false;
    } else if (!/^\d{13}$/.test(formData.citizenId)) {
      newErrors.citizenId = "Citizen ID must be 13 digits";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
      isValid = false;
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits starting with 0";
      isValid = false;
    }

    // Password validation (only if old_password is provided)
    if (formData.old_password) {
      if (!formData.new_password) {
        newErrors.new_password =
          "New password is required when changing password";
        isValid = false;
      } else if (formData.new_password.length < 8) {
        newErrors.new_password = "Password must be at least 8 characters";
        isValid = false;
      } else if (
        !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(formData.new_password)
      ) {
        newErrors.new_password =
          "Password must contain at least one number, one uppercase and one lowercase letter";
        isValid = false;
      }

      // Confirm password validation
      if (formData.new_password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create update DTO
      const updateData: UserUpdateDto = {
        citizenId: formData.citizenId,
        phone: formData.phone,
      };

      // Only add password fields if old_password is provided
      if (formData.old_password) {
        updateData.old_password = formData.old_password;
        updateData.new_password = formData.new_password;
        updateData.confirm_password = formData.confirm_password;
      }

      await UserService.updateUser(updateData);
      toast.success("Profile updated successfully!");

      // Get user role and redirect accordingly
      const userRole = AuthService.getUserRole();
      setTimeout(() => {
        if (userRole === "SIGNER") {
          router.push("/signer");
        } else if (userRole === "SUPERVISOR") {
          router.push("/supervisor");
        } else {
          router.push("/"); // Default route for regular users
        }
      }, 1000); // Short delay to show the success message
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.error("Invalid form data. Please check your inputs.");
        } else if (error.response?.status === 401) {
          toast.error("Incorrect current password");
        } else if (error.response?.status === 409) {
          toast.error("This citizen ID or phone number is already in use.");
        } else {
          toast.error("Failed to update profile. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-1">
            Update your personal information and password
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Citizen ID Field */}
            <div className="mb-6">
              <label
                htmlFor="citizenId"
                className="block text-sm font-medium text-gray-700 mb-1">
                Citizen ID*
              </label>
              <input
                type="text"
                id="citizenId"
                name="citizenId"
                value={formData.citizenId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.citizenId ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter 13-digit citizen ID"
              />
              {errors.citizenId && (
                <p className="mt-1 text-xs text-red-500">{errors.citizenId}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Your 13-digit Thai citizen ID
              </p>
            </div>

            {/* Phone Field */}
            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number*
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter 10-digit phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Format: 0XXXXXXXXX (10 digits starting with 0)
              </p>
            </div>

            <div className="border-t border-gray-200 my-6 pt-6">
              <h3 className="text-md font-medium text-gray-800 mb-4">
                Change Password (Optional)
              </h3>

              {/* Current Password Field */}
              <div className="mb-6">
                <label
                  htmlFor="old_password"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="old_password"
                    name="old_password"
                    value={formData.old_password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.old_password ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 hover:text-gray-700">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.old_password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.old_password}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Leave blank if you don't want to change your password
                </p>
              </div>

              {showPasswordFields && (
                <>
                  {/* New Password Field */}
                  <div className="mb-6">
                    <label
                      htmlFor="new_password"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      New Password*
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="new_password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          errors.new_password
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Create a new strong password"
                      />
                    </div>
                    {errors.new_password && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.new_password}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters with one number,
                      one uppercase and one lowercase letter.
                    </p>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-6">
                    <label
                      htmlFor="confirm_password"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password*
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirm_password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errors.confirm_password
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Confirm your new password"
                    />
                    {errors.confirm_password && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.confirm_password}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-200">
              <Link
                href="/"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                Cancel
              </Link>
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}>
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-500 mr-2 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-green-800">
              Account Security
            </h3>
            <p className="text-xs text-green-600 mt-1">
              Keeping your contact information up to date ensures you receive
              important notifications about your account and voting activities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
