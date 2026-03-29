"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "STAFF"];

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !ADMIN_ROLES.includes(user.role))) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
            style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
          />
          <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
