"use client";
import { AuthService } from "@/services/auth.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RoleProtected({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userRole = AuthService.getUserRole();
    setRole(userRole);
    setLoading(false);
    console.log("User role:", userRole, "Allowed roles:", allowedRoles);
    // Show toast notification if user doesn't have required role
    if (
      !loading &&
      ((!userRole && userRole !== "0") || !allowedRoles.includes(userRole))
    ) {
      toast.error(
        "Access denied. You don't have permission to view this content.",
        {
          duration: 4000,
        }
      );

      // Optional: Redirect to home page after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [allowedRoles, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-4">
        <div className="text-xl font-semibold text-red-600 mb-4">
          Access Denied
        </div>
        <div className="text-center text-gray-700">
          You do not have permission to view this content.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
