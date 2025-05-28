"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

export default function LoginPage() {
  const [loginType, setLoginType] = useState<"user" | "supervisor" | "signer">(
    "user"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState(""); // citizenId or username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const renderIDLabel = () => {
    switch (loginType) {
      case "user":
        return "Citizen ID";
      case "supervisor":
        return "Username";
      case "signer":
        return "Username";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      let response;

      switch (loginType) {
        case "user":
          response = await AuthService.userLogin({
            citizenId: identifier,
            password,
          });
          toast.success("User login successful");
          router.push("/"); // Regular users go to home
          break;
        case "supervisor":
          response = await AuthService.supervisorLogin({
            username: identifier,
            password,
          });
          toast.success("Supervisor login successful");
          router.push("/supervisor"); // Supervisors go to supervisor dashboard
          break;
        case "signer":
          response = await AuthService.signerLogin({
            username: identifier,
            password,
          });
          toast.success("Signer login successful");
          router.push("/signer"); // Signers go to signer dashboard
          break;
      }

      console.log("Login successful:", response);
    } catch (error) {
      console.debug("Login error:", error);
      toast.error("Wrong username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <Toaster position="top-right" richColors />
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-center text-gray-900">
          {loginType === "user"
            ? "User Login"
            : loginType === "supervisor"
            ? "Supervisor Login"
            : "Signer Login"}
        </h2>

        <div className="flex justify-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setLoginType("user")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              loginType === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}>
            User
          </button>
          <button
            type="button"
            onClick={() => setLoginType("supervisor")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              loginType === "supervisor"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}>
            Supervisor
          </button>
          <button
            type="button"
            onClick={() => setLoginType("signer")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              loginType === "signer"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}>
            Signer
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="id"
              className="block mb-2 text-sm font-medium text-gray-700">
              {renderIDLabel()}
            </label>
            <input
              type="text"
              id="id"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              aria-label={renderIDLabel()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                aria-label="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 hover:text-gray-700">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 mt-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
