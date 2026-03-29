"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("Reekruitr");
  const [tagline, setTagline] = useState("Find your next opportunity");
  const [accentColor, setAccentColor] = useState("#e86c3a");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputStyles = {
    backgroundColor: "var(--input-bg)",
    borderColor: "var(--input-border)",
    color: "var(--foreground)",
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate save — backend can be implemented later
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Logo & Branding</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Customize your site appearance and branding
        </p>
      </div>

      {success && (
        <div
          className="mb-6 rounded-lg border p-3 text-sm"
          style={{ backgroundColor: "#dcfce7", borderColor: "#bbf7d0", color: "#16a34a" }}
        >
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Logo Upload */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <h2 className="text-lg font-semibold mb-4">Site Logo</h2>
          <div className="flex items-start gap-6">
            <div
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl text-2xl font-bold text-white"
              style={{ backgroundColor: accentColor }}
            >
              R
            </div>
            <div className="flex-1">
              <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                Upload your company logo. Recommended size: 512×512px. Formats: PNG, SVG, or JPEG.
              </p>
              <label
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
                style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Upload Logo
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Favicon */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <h2 className="text-lg font-semibold mb-4">Favicon</h2>
          <div className="flex items-start gap-6">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: accentColor }}
            >
              R
            </div>
            <div className="flex-1">
              <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                The small icon shown in browser tabs. Recommended: 32×32px or 64×64px ICO/PNG.
              </p>
              <label
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
                style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Upload Favicon
                <input type="file" accept="image/*,.ico" className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Site Info */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <h2 className="text-lg font-semibold mb-4">Site Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted)" }}>Site Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 text-sm border outline-none"
                  style={inputStyles}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted)" }}>Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 text-sm border outline-none"
                  style={inputStyles}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted)" }}>Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-14 rounded-lg border cursor-pointer"
                  style={{ borderColor: "var(--input-border)" }}
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="rounded-lg px-4 py-3 text-sm border outline-none w-32"
                  style={inputStyles}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: "#e86c3a" }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
