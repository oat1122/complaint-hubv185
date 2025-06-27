"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    console.log("Dashboard layout - session:", session);
    console.log("Dashboard layout - status:", status);

    if (!session) {
      console.log("No session, redirecting to signin");
      router.push("/auth/signin");
      return;
    }

    // Check if user has proper role
    if (!session.user.role || (session.user.role !== "ADMIN" && session.user.role !== "VIEWER")) {
      console.log("Invalid role, redirecting to unauthorized. Role:", session.user.role);
      router.push("/unauthorized");
      return;
    }

    console.log("Access granted for role:", session.user.role);
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">กำลังโหลด...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
