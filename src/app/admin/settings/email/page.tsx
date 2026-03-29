"use client";

import { useState } from "react";

export default function EmailSettingsPage() {
  const [form, setForm] = useState({
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPass: "",
    smtpEncryption: "TLS",
    fromName: "Reekruitr",
    fromEmail: "noreply@reekruitr.com",
  });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [success, setSuccess] = useState("");

  const inputStyles = {
    backgroundColor: "var(--input-bg)",
    borderColor: "var(--input-border)",
    color: "var(--foreground)",
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess("SMTP settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    }, 800);
  };

  const handleTestEmail = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      setSuccess("Test email sent! Check your inbox.");
      setTimeout(() => setSuccess(""), 3000);
    }, 1500);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Email & SMTP</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Configure your email delivery settings
        </p>
      </div>

      {success && (
        <div
          className="mb-6 rounded-lg border p-3 text-sm"
          style={{ backgroundColor: "#dcfce7", borderColor: "#bbf7d0", color: "#16a34a" }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SMTP Server */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <h2 className="text-lg font-semibold mb-4">SMTP Server</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted)" }}>SMTP Host</label>
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  value={form.smtpHost}
                  onChange={(e) => setForm({ ...form, smtpHost: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 text-sm border outline-none"
                  style={inputStyles}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted)" }}>SMTP Port</label>
                <input
                  type="text"
                  placeholder="587"
                  value={form.smtpPort}
                  onChange={(e) => setForm({ ...form, smtpPort: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 text-sm border outline-none"
                  style={inputStyles}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted)" }}>Username</label>
                <input
                  type="text"
                  placeholder="your@email.com"
                  value={form.smtpUser}
                  onChange={(e) => setForm({ ...form, smtpUser: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 text-sm border outline-none"
                  style={inputStyles}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted)" }}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.smtpPass}
                  onChange={(e) => setForm({ ...form, smtpPass: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 text-sm border outline-none"
                  style={inputStyles}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted)" }}>Encryption</label>
              <select
                value={form.smtpEncryption}
                onChange={(e) => setForm({ ...form, smtpEncryption: e.target.value })}
                className="rounded-lg px-4 py-3 text-sm border outline-none"
                style={inputStyles}
              >
                <option>TLS</option>
                <option>SSL</option>
                <option>None</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sender Info */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <h2 className="text-lg font-semibold mb-4">Default Sender</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted)" }}>From Name</label>
              <input
                type="text"
                value={form.fromName}
                onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                className="w-full rounded-lg px-4 py-3 text-sm border outline-none"
                style={inputStyles}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted)" }}>From Email</label>
              <input
                type="email"
                value={form.fromEmail}
                onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
                className="w-full rounded-lg px-4 py-3 text-sm border outline-none"
                style={inputStyles}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "#e86c3a" }}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          <button
            type="button"
            onClick={handleTestEmail}
            disabled={testing}
            className="rounded-lg px-6 py-2.5 text-sm font-medium border disabled:opacity-50"
            style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
          >
            {testing ? "Sending..." : "Send Test Email"}
          </button>
        </div>
      </form>
    </div>
  );
}
