"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/utils";

interface Stats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  pendingJobs: number;
  approvedJobs: number;
  rejectedJobs: number;
  newUsersInPeriod: number;
  newJobsInPeriod: number;
  newApplicationsInPeriod: number;
}

interface RecentJob {
  id: number;
  title: string;
  company: string;
  status: string;
  createdAt: string;
  postedBy: { firstName: string; lastName: string };
}

interface RecentApplication {
  id: number;
  status: string;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
  job: { title: string; company: string };
}

interface RecentUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}



const periods = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "1 year", value: 365 },
];

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`/api/admin/stats?period=${period}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setRecentJobs(data.recentJobs || []);
        setRecentApplications(data.recentApplications || []);
        setRecentUsers(data.recentUsers || []);
      })
      .finally(() => setLoading(false));
  }, [token, period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5bcfb5] border-t-transparent" />
      </div>
    );
  }

  const statCards = stats
    ? [
        {
          label: "TOTAL JOBS",
          value: stats.totalJobs,
          sub: `+${stats.newJobsInPeriod} in period`,
          color: "#2a6f5e",
        },
        {
          label: "TOTAL USERS",
          value: stats.totalUsers,
          sub: `+${stats.newUsersInPeriod} new in period`,
          color: "#16a34a",
        },
        {
          label: "PENDING APPROVAL",
          value: stats.pendingJobs,
          sub: `${stats.approvedJobs} approved`,
          color: "#ea580c",
        },
        {
          label: "APPLICATIONS",
          value: stats.totalApplications,
          sub: `+${stats.newApplicationsInPeriod} in period`,
          color: "#9333ea",
        },
      ]
    : [];

  const statusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return { bg: "#dcfce7", text: "#16a34a" };
      case "PENDING": return { bg: "#fef3c7", text: "#d97706" };
      case "REJECTED": return { bg: "#fef2f2", text: "#dc2626" };
      default: return { bg: "#ecfdf5", text: "#2a6f5e" };
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: "var(--muted)" }}>Period:</span>
          <div
            className="flex rounded-lg border overflow-hidden"
            style={{ borderColor: "var(--card-border)" }}
          >
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className="px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: period === p.value ? "#1a3a30" : "transparent",
                  color: period === p.value ? "#fff" : "var(--foreground)",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border p-5"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            <p className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: card.color }}>
              {card.label}
            </p>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Two column: Recent Jobs + Recent Signups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Jobs */}
        <div
          className="rounded-xl border"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--card-border)" }}>
            <h2 className="text-lg font-semibold">Recent Jobs</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
            {recentJobs.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm" style={{ color: "var(--muted)" }}>No jobs yet</p>
            ) : (
              recentJobs.map((job) => {
                const sc = statusColor(job.status);
                return (
                  <div key={job.id} className="flex items-center justify-between px-5 py-3.5" style={{ borderColor: "var(--card-border)" }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{ backgroundColor: sc.bg, color: sc.text }}
                      >
                        {job.status === "APPROVED" ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ) : job.status === "PENDING" ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{job.title}</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>
                          {job.company} · {job.postedBy.firstName} {job.postedBy.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{ backgroundColor: sc.bg, color: sc.text }}
                      >
                        {job.status}
                      </span>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{timeAgo(job.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Signups */}
        <div
          className="rounded-xl border"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--card-border)" }}>
            <h2 className="text-lg font-semibold">Recent Signups</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
            {recentUsers.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm" style={{ color: "var(--muted)" }}>No users yet</p>
            ) : (
              recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-5 py-3.5" style={{ borderColor: "var(--card-border)" }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5bcfb5] text-xs font-bold text-white">
                      {u.firstName[0]}{u.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{u.firstName} {u.lastName}</p>
                      <p className="text-xs truncate" style={{ color: "var(--muted)" }}>{u.email}</p>
                    </div>
                  </div>
                  <span className="text-xs shrink-0 ml-3" style={{ color: "var(--muted)" }}>
                    {timeAgo(u.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div
        className="rounded-xl border"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--card-border)" }}>
          <h2 className="text-lg font-semibold">Recent Applications</h2>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
          {recentApplications.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm" style={{ color: "var(--muted)" }}>No applications yet</p>
          ) : (
            recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between px-5 py-3.5" style={{ borderColor: "var(--card-border)" }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2a6f5e] text-xs font-bold text-white">
                    {app.user.firstName[0]}{app.user.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{app.user.firstName} {app.user.lastName}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      Applied to {app.job.title} at {app.job.company}
                    </p>
                  </div>
                </div>
                <span className="text-xs shrink-0 ml-3" style={{ color: "var(--muted)" }}>
                  {timeAgo(app.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
