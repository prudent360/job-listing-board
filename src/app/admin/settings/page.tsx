"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import Image from "next/image";

export default function SettingsPage() {
  const { token } = useAuth();
  const { settings: currentSettings, refresh } = useSiteSettings();

  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");
  const [accentColor, setAccentColor] = useState("#e86c3a");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "favicon" | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Sync from context on first load
  useEffect(() => {
    setSiteName(currentSettings.siteName);
    setTagline(currentSettings.tagline);
    setAccentColor(currentSettings.accentColor);
    setLogoUrl(currentSettings.logoUrl);
    setFaviconUrl(currentSettings.faviconUrl);
  }, [currentSettings]);

  const inputStyles = {
    backgroundColor: "var(--input-bg)",
    borderColor: "var(--input-border)",
    color: "var(--foreground)",
  };

  const uploadFile = async (file: File, type: "logo" | "favicon") => {
    setUploading(type);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (type === "logo") {
        setLogoUrl(data.url);
      } else {
        setFaviconUrl(data.url);
      }

      setSuccess(`${type === "logo" ? "Logo" : "Favicon"} uploaded! Click "Save Changes" to apply.`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: {
            siteName,
            tagline,
            accentColor,
            logoUrl,
            faviconUrl,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      refresh(); // Update the global context
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
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
          {success}
        </div>
      )}

      {error && (
        <div
          className="mb-6 rounded-lg border p-3 text-sm"
          style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca", color: "#dc2626" }}
        >
          {error}
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
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl overflow-hidden border" style={{ borderColor: "var(--card-border)", backgroundColor: "var(--section-bg)" }}>
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={96} height={96} className="h-full w-full object-contain" />
              ) : (
                <span className="text-2xl font-bold" style={{ color: "var(--accent)" }}>R</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                Upload your company logo. Recommended size: 512x512px. Formats: PNG, SVG, or JPEG.
              </p>
              <div className="flex items-center gap-3">
                <label
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity ${uploading === "logo" ? "opacity-50 pointer-events-none" : ""}`}
                  style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {uploading === "logo" ? "Uploading..." : "Upload Logo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadFile(file, "logo");
                      e.target.value = "";
                    }}
                  />
                </label>
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl("")}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg overflow-hidden border" style={{ borderColor: "var(--card-border)", backgroundColor: "var(--section-bg)" }}>
              {faviconUrl ? (
                <Image src={faviconUrl} alt="Favicon" width={32} height={32} className="h-full w-full object-contain" />
              ) : (
                <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>R</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                The small icon shown in browser tabs. Recommended: 32x32px or 64x64px ICO/PNG.
              </p>
              <div className="flex items-center gap-3">
                <label
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity ${uploading === "favicon" ? "opacity-50 pointer-events-none" : ""}`}
                  style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {uploading === "favicon" ? "Uploading..." : "Upload Favicon"}
                  <input
                    type="file"
                    accept="image/*,.ico"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadFile(file, "favicon");
                      e.target.value = "";
                    }}
                  />
                </label>
                {faviconUrl && (
                  <button
                    type="button"
                    onClick={() => setFaviconUrl("")}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
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
                <div className="h-10 w-10 rounded-lg" style={{ backgroundColor: accentColor }} />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          <div className="rounded-lg border p-4 flex items-center gap-3" style={{ borderColor: "var(--card-border)", backgroundColor: "var(--section-bg)" }}>
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo preview" width={32} height={32} className="h-8 w-8 rounded-lg object-contain" />
            ) : (
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: accentColor }}>
                {siteName[0] || "R"}
              </div>
            )}
            <span className="text-xl font-bold" style={{ color: accentColor }}>{siteName || "Reekruitr"}</span>
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
