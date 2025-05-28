"use client";

import RoleProtected from "@/app/components/RoleProtected";
import { Role } from "@/shared/enum/role.enum";

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProtected allowedRoles={[Role.SUPERVISOR.toString()]}>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">{children}</div>
      </main>
    </RoleProtected>
  );
}
