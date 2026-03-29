"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProfileData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  location: string | null;
  linkedIn: string | null;
  github: string | null;
  role: string;
}

export default function ProfilePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    linkedIn: "",
    github: "",
  });

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setProfile(data.user);
          setForm({
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            phone: data.user.phone || "",
            location: data.user.location || "",
            linkedIn: data.user.linkedIn || "",
            github: data.user.github || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to update profile");
      return;
    }

    setProfile(data.user);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const inputStyles = {
    backgroundColor: "var(--input-bg)",
    borderColor: "var(--input-border)",
    color: "var(--foreground)",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e86c3a] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Profile Header */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1f2e 0%, #2d3450 100%)" }}
      >
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          {/* User Avatar Icon */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/20" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <svg className="h-12 w-12 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="mt-1 text-sm text-white/60">Manage your personal information</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="mx-auto max-w-2xl px-4 py-8">
        {error && (
          <div
            className="mb-6 rounded-lg border p-3 text-sm"
            style={{ backgroundColor: "var(--error-bg)", borderColor: "var(--error-border)", color: "var(--error-text)" }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="mb-6 rounded-lg border p-3 text-sm"
            style={{ backgroundColor: "#dcfce7", borderColor: "#bbf7d0", color: "#16a34a" }}
          >
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Email & Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full rounded-xl px-4 py-3.5 text-sm border outline-none opacity-60 cursor-not-allowed"
                style={inputStyles}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                  className="rounded-xl px-4 py-3.5 text-sm border outline-none"
                  style={inputStyles}
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                  className="rounded-xl px-4 py-3.5 text-sm border outline-none"
                  style={inputStyles}
                />
              </div>
            </div>
          </div>

          {/* Phone & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 1234567890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl px-4 py-3.5 text-sm border outline-none"
                style={inputStyles}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Location</label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full rounded-xl px-4 py-3.5 text-sm border outline-none"
                style={inputStyles}
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-semibold mb-2">LinkedIn Profile</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={form.linkedIn}
              onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
              className="w-full rounded-xl px-4 py-3.5 text-sm border outline-none"
              style={inputStyles}
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-semibold mb-2">GitHub Profile</label>
            <input
              type="url"
              placeholder="https://github.com/username"
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
              className="w-full rounded-xl px-4 py-3.5 text-sm border outline-none"
              style={inputStyles}
            />
          </div>

          {/* Role (read-only) */}
          <div>
            <label className="block text-sm font-semibold mb-2">Role</label>
            <input
              type="text"
              value={profile?.role?.replace(/_/g, " ") || ""}
              disabled
              className="w-full rounded-xl px-4 py-3.5 text-sm border outline-none opacity-60 cursor-not-allowed"
              style={inputStyles}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#1a1f2e" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
