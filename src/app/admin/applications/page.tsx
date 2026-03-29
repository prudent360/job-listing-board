"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/utils";

interface ApplicationItem {
  id: number;
  status: string;
  coverNote: string;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
  job: { title: string; company: string };
}



export default function AdminApplicationsPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    // Fetch all applications via the stats endpoint (which includes recent)
    // For a full list, we'd need a dedicated endpoint — let's use a simple approach
    fetch("/api/admin/applications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setApplications(d.applications || []))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5bcfb5] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Applications</h1>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--card-border)" }}>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Applicant</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Job</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Cover Note</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Status</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Applied</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center" style={{ color: "var(--muted)" }}>No applications yet</td></tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="border-b last:border-0" style={{ borderColor: "var(--card-border)" }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2a6f5e] text-xs font-bold text-white">
                          {app.user.firstName[0]}{app.user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium">{app.user.firstName} {app.user.lastName}</p>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>{app.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium">{app.job.title}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{app.job.company}</p>
                    </td>
                    <td className="px-5 py-3 max-w-[200px]">
                      <p className="text-sm truncate" style={{ color: "var(--muted)" }}>
                        {app.coverNote || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: "#ecfdf5", color: "#2a6f5e" }}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-3" style={{ color: "var(--muted)" }}>
                      {timeAgo(app.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
