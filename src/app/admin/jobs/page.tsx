"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

interface JobItem {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  description: string;
  tags: string;
  externalApplyUrl: string | null;
  status: string;
  createdAt: string;
  postedBy: { id: number; firstName: string; lastName: string; email: string };
}

const categories = ["Engineering", "Design", "Data", "Marketing", "Management", "Healthcare", "Other"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance"];

export default function AdminJobsPage() {
  const { token, user } = useAuth();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");

  // Edit state
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: "", company: "", location: "", type: "Full-time", salary: "",
    category: "Engineering", description: "", tags: "", externalApplyUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "", company: "", location: "", type: "Full-time", salary: "",
    category: "Engineering", description: "", tags: "", externalApplyUrl: "",
  });

  const fetchJobs = () => {
    if (!token) return;
    fetch("/api/jobs?all=true", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { setError(data.error); return; }
    setShowCreate(false);
    setForm({ title: "", company: "", location: "", type: "Full-time", salary: "", category: "Engineering", description: "", tags: "", externalApplyUrl: "" });
    fetchJobs();
  };

  const handleAction = async (jobId: number, action: "approve" | "reject") => {
    await fetch(`/api/jobs/${jobId}/${action}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchJobs();
  };

  const openEdit = (job: JobItem) => {
    setEditingJob(job);
    setEditForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      category: job.category,
      description: job.description || "",
      tags: job.tags || "",
      externalApplyUrl: job.externalApplyUrl || "",
    });
    setEditError("");
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    setEditError("");
    setSaving(true);

    const res = await fetch(`/api/jobs/${editingJob.id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setEditError(data.error || "Failed to update job");
      return;
    }

    setEditingJob(null);
    fetchJobs();
  };

  const handleDelete = async (jobId: number) => {
    setDeletingId(jobId);
    await fetch(`/api/jobs/${jobId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeletingId(null);
    fetchJobs();
  };

  const filteredJobs = filter === "ALL" ? jobs : jobs.filter((j) => j.status === filter);
  const isSuperAdminOrAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const statusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return { bg: "#dcfce7", text: "#16a34a" };
      case "PENDING": return { bg: "#fef3c7", text: "#d97706" };
      case "REJECTED": return { bg: "#fef2f2", text: "#dc2626" };
      default: return { bg: "#ecfdf5", text: "#2a6f5e" };
    }
  };

  const inputStyles = {
    backgroundColor: "var(--input-bg)",
    borderColor: "var(--input-border)",
    color: "var(--foreground)",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2a6f5e] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: "#2a6f5e" }}
        >
          {showCreate ? "Cancel" : "+ Create Job"}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div
          className="rounded-xl border p-5 mb-6"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <h2 className="text-lg font-semibold mb-4">Post a New Job</h2>
          {error && (
            <div className="mb-4 rounded-lg border p-3 text-sm" style={{ backgroundColor: "var(--error-bg)", borderColor: "var(--error-border)", color: "var(--error-text)" }}>{error}</div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Job Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles} />
              <input type="text" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required className="rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input type="text" placeholder="Location (e.g. Remote)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required className="rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles} />
              <input type="text" placeholder="Salary (e.g. $100k-$140k)" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} required className="rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles} />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles}>
                {jobTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
              <input type="text" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Job Description</label>
              <RichTextEditor
                content={form.description}
                onChange={(html) => setForm({ ...form, description: html })}
                placeholder="Write a detailed job description..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>External Apply URL <span className="font-normal">(optional — if set, the Apply button will link here instead)</span></label>
              <input type="url" placeholder="https://company.com/careers/apply" value={form.externalApplyUrl} onChange={(e) => setForm({ ...form, externalApplyUrl: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles} />
            </div>
            <button type="submit" disabled={creating} className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50" style={{ backgroundColor: "#2a6f5e" }}>
              {creating ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: filter === f ? "#1a3a30" : "var(--section-bg)",
              color: filter === f ? "#fff" : "var(--foreground)",
            }}
          >
            {f} ({f === "ALL" ? jobs.length : jobs.filter((j) => j.status === f).length})
          </button>
        ))}
      </div>

      {/* Jobs table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--card-border)" }}>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Job</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Location</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Status</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Posted By</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Date</th>
                {isSuperAdminOrAdmin && <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center" style={{ color: "var(--muted)" }}>No jobs found</td></tr>
              ) : (
                filteredJobs.map((job) => {
                  const sc = statusColor(job.status);
                  return (
                    <tr key={job.id} className="border-b last:border-0" style={{ borderColor: "var(--card-border)" }}>
                      <td className="px-5 py-3">
                        <p className="font-medium">{job.title}</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>{job.company} · {job.salary}</p>
                      </td>
                      <td className="px-5 py-3" style={{ color: "var(--muted)" }}>{job.location}</td>
                      <td className="px-5 py-3">
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-5 py-3" style={{ color: "var(--muted)" }}>
                        {job.postedBy.firstName} {job.postedBy.lastName}
                      </td>
                      <td className="px-5 py-3" style={{ color: "var(--muted)" }}>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      {isSuperAdminOrAdmin && (
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            {job.status === "PENDING" && (
                              <>
                                <button onClick={() => handleAction(job.id, "approve")} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}>Approve</button>
                                <button onClick={() => handleAction(job.id, "reject")} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>Reject</button>
                              </>
                            )}
                            <button
                              onClick={() => openEdit(job)}
                              className="rounded-lg px-3 py-1.5 text-xs font-medium"
                              style={{ backgroundColor: "#ecfdf5", color: "#2a6f5e" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${job.title}"? This will also remove all applications.`)) {
                                  handleDelete(job.id);
                                }
                              }}
                              disabled={deletingId === job.id}
                              className="rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                              style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}
                            >
                              {deletingId === job.id ? "..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div
            className="w-full max-w-2xl rounded-2xl border p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Edit Job</h2>
              <button
                onClick={() => setEditingJob(null)}
                className="h-8 w-8 flex items-center justify-center rounded-lg transition-colors hover:opacity-70"
                style={{ backgroundColor: "var(--section-bg)" }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {editError && (
              <div className="mb-4 rounded-lg border p-3 text-sm" style={{ backgroundColor: "var(--error-bg)", borderColor: "var(--error-border)", color: "var(--error-text)" }}>
                {editError}
              </div>
            )}

            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Job Title</label>
                  <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required className="w-full rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Company</label>
                  <input type="text" value={editForm.company} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} required className="w-full rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Location</label>
                  <input type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} required className="w-full rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Salary</label>
                  <input type="text" value={editForm.salary} onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })} required className="w-full rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Category</label>
                  <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Job Type</label>
                  <select value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles}>
                    {jobTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Tags</label>
                  <input type="text" placeholder="React, TypeScript, Node.js" value={editForm.tags} onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Description</label>
                <RichTextEditor
                  content={editForm.description}
                  onChange={(html) => setEditForm({ ...editForm, description: html })}
                  placeholder="Write a detailed job description..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>External Apply URL <span className="font-normal">(optional)</span></label>
                <input type="url" placeholder="https://company.com/careers/apply" value={editForm.externalApplyUrl} onChange={(e) => setEditForm({ ...editForm, externalApplyUrl: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm border outline-none" style={inputStyles} />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: "#2a6f5e" }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="rounded-lg px-6 py-2.5 text-sm font-medium border"
                  style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
