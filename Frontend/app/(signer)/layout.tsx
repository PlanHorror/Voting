"use client";

import RoleProtected from "@/app/components/RoleProtected";
import { Role } from "@/shared/enum/role.enum";

export default function SignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProtected allowedRoles={[Role.SIGNER.toString()]}>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Signer Dashboard
          </h1>
          {children}
        </div>
      </main>
    </RoleProtected>
  );
}
