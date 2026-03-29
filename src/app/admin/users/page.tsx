"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";

interface UserItem {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "", role: "STAFF" });

  const fetchUsers = () => {
    if (!token) return;
    fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const toggleActive = async (userId: number, isActive: boolean) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchUsers();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setShowCreate(false);
    setForm({ email: "", password: "", firstName: "", lastName: "", role: "STAFF" });
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        {isSuperAdmin && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {showCreate ? "Cancel" : "+ Create User"}
          </button>
        )}
      </div>

      {/* Create user form */}
      {showCreate && (
        <div
          className="rounded-xl border p-5 mb-6"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <h2 className="text-lg font-semibold mb-4">Create New User</h2>
          {error && (
            <div
              className="mb-4 rounded-lg border p-3 text-sm"
              style={{
                backgroundColor: "var(--error-bg)",
                borderColor: "var(--error-border)",
                color: "var(--error-text)",
              }}
            >
              {error}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
                className="rounded-lg px-4 py-3 text-sm border outline-none"
                style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--foreground)" }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
                className="rounded-lg px-4 py-3 text-sm border outline-none"
                style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--foreground)" }}
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full rounded-lg px-4 py-3 text-sm border outline-none"
              style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--foreground)" }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="rounded-lg px-4 py-3 text-sm border outline-none"
                style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--foreground)" }}
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="rounded-lg px-4 py-3 text-sm border outline-none"
                style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--foreground)" }}
              >
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {creating ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>
      )}

      {/* Users table */}
      <div
        className="rounded-xl border"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--card-border)" }}>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Name</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Email</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Role</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Status</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Joined</th>
                {(isSuperAdmin || currentUser?.role === "ADMIN") && (
                  <th className="text-left px-5 py-3 font-medium" style={{ color: "var(--muted)" }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0" style={{ borderColor: "var(--card-border)" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: "var(--accent)" }}
                      >
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <span className="font-medium">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3" style={{ color: "var(--muted)" }}>{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}
                    >
                      {u.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: u.isActive ? "#dcfce7" : "#fef2f2",
                        color: u.isActive ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3" style={{ color: "var(--muted)" }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  {(isSuperAdmin || currentUser?.role === "ADMIN") && (
                    <td className="px-5 py-3">
                      {u.id !== currentUser?.id && u.role !== "SUPER_ADMIN" && (
                        <button
                          onClick={() => toggleActive(u.id, u.isActive)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                          style={{
                            backgroundColor: u.isActive ? "#fef2f2" : "#dcfce7",
                            color: u.isActive ? "#dc2626" : "#16a34a",
                          }}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
