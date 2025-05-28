"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { Toaster, toast } from "sonner";
import { Role } from "@/shared/enum/role.enum";

export default function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on component mount and when localStorage changes
    const checkAuth = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
      setUserRole(AuthService.getUserRole());
    };

    checkAuth();

    // Listen for storage events (for when user logs in/out in another tab)
    window.addEventListener("storage", checkAuth);

    // Listen for our custom auth change event
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    toast.success("Successfully logged out");
    router.push("/");
  };

  return (
    <div className="w-full mb-10">
      <Toaster position="top-right" richColors />
      <nav className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
        <div className="w-1/5 p-5">
          <h1 className="text-2xl font-bold text-indigo-500">Voting System</h1>
        </div>

        <div className="flex justify-center space-x-8 text-lg font-medium w-3/5">
          <Link
            href="/"
            className="text-indigo-500 hover:text-blue-500 px-3 py-2">
            Home
          </Link>

          {userRole === Role.SUPERVISOR.toString() ? (
            // Supervisor Navigation Links
            <>
              <Link
                href="/supervisor/votes"
                className="text-gray-900 hover:text-blue-500 px-3 py-2">
                Vote Sessions
              </Link>
              <Link
                href="/supervisor/supervisors"
                className="text-gray-900 hover:text-blue-500 px-3 py-2">
                Supervisor
              </Link>
              <Link
                href="/supervisor/signers"
                className="text-gray-900 hover:text-blue-500 px-3 py-2">
                Signers
              </Link>
            </>
          ) : (
            // Regular User Navigation Links
            <>
              <Link
                href="/votes"
                className="text-gray-900 hover:text-blue-500 px-3 py-2">
                List votes
              </Link>
              <Link
                href="/voting"
                className="text-gray-900 hover:text-blue-500 px-3 py-2">
                Voting
              </Link>
              <Link
                href="/result"
                className="text-gray-900 hover:text-blue-500 px-3 py-2">
                Result
              </Link>
            </>
          )}
        </div>

        <div className="flex justify-end items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="px-5 py-2 border border-indigo-500 text-indigo-500 font-medium rounded-md hover:bg-indigo-500 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-600 transition-colors">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/profile`}
                className="px-5 py-2 border border-indigo-500 text-indigo-500 font-medium rounded-md hover:bg-indigo-500 hover:text-white transition-colors">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-600 transition-colors">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
