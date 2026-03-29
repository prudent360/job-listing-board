"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  body: string;
  enabled: boolean;
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to Reekruitr!",
    description: "Sent to new users after registration",
    enabled: true,
    body: `<h2>Welcome to Reekruitr, {{firstName}}!</h2>
<p>Thank you for joining our platform. We're excited to help you find your next opportunity.</p>
<p>Here's what you can do:</p>
<ul>
  <li>Browse and apply to hundreds of job listings</li>
  <li>Set up your profile to get discovered by employers</li>
  <li>Track your applications in one place</li>
</ul>
<p>Best regards,<br/>The Reekruitr Team</p>`,
  },
  {
    id: "application_received",
    name: "Application Received",
    subject: "Application Received: {{jobTitle}}",
    description: "Sent to applicants when their application is submitted",
    enabled: true,
    body: `<h2>Application Submitted Successfully</h2>
<p>Hi {{firstName}},</p>
<p>Your application for <strong>{{jobTitle}}</strong> at <strong>{{company}}</strong> has been received.</p>
<p>The hiring team will review your application and get back to you soon.</p>
<p>Best regards,<br/>The Reekruitr Team</p>`,
  },
  {
    id: "job_approved",
    name: "Job Approved",
    subject: "Your job listing has been approved",
    description: "Sent to employers when their job is approved by admin",
    enabled: true,
    body: `<h2>Your Job Listing is Live!</h2>
<p>Hi {{firstName}},</p>
<p>Great news! Your job listing for <strong>{{jobTitle}}</strong> has been approved and is now live on Reekruitr.</p>
<p>You can view it here: <a href="{{jobUrl}}">View Listing</a></p>
<p>Best regards,<br/>The Reekruitr Team</p>`,
  },
  {
    id: "job_rejected",
    name: "Job Rejected",
    subject: "Update on your job listing",
    description: "Sent to employers when their job is rejected",
    enabled: true,
    body: `<h2>Job Listing Update</h2>
<p>Hi {{firstName}},</p>
<p>Unfortunately, your job listing for <strong>{{jobTitle}}</strong> was not approved. This could be due to missing information or policy violations.</p>
<p>Please review our guidelines and resubmit. If you have questions, contact us at postajob@reekruitr.com.</p>
<p>Best regards,<br/>The Reekruitr Team</p>`,
  },
  {
    id: "password_reset",
    name: "Password Reset",
    subject: "Reset Your Password",
    description: "Sent when a user requests a password reset",
    enabled: true,
    body: `<h2>Password Reset Request</h2>
<p>Hi {{firstName}},</p>
<p>We received a request to reset your password. Click the button below to create a new password:</p>
<p><a href="{{resetUrl}}" style="display:inline-block;padding:12px 24px;background:#e86c3a;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">Reset Password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
<p>Best regards,<br/>The Reekruitr Team</p>`,
  },
];

// Sample data for preview
const sampleData: Record<string, string> = {
  "{{firstName}}": "John",
  "{{lastName}}": "Doe",
  "{{email}}": "john@example.com",
  "{{jobTitle}}": "Senior React Developer",
  "{{company}}": "TechCorp",
  "{{jobUrl}}": "https://reekruitr.com/job/techcorp-is-hiring",
  "{{resetUrl}}": "https://reekruitr.com/reset/abc123",
};

function fillTemplate(body: string, subject: string) {
  let filledBody = body;
  let filledSubject = subject;
  for (const [key, value] of Object.entries(sampleData)) {
    filledBody = filledBody.replaceAll(key, value);
    filledSubject = filledSubject.replaceAll(key, value);
  }
  return { filledBody, filledSubject };
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [previewing, setPreviewing] = useState<EmailTemplate | null>(null);
  const [editBody, setEditBody] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  // Force re-mount the editor by changing the key
  const [editorKey, setEditorKey] = useState(0);

  const inputStyles = {
    backgroundColor: "var(--input-bg)",
    borderColor: "var(--input-border)",
    color: "var(--foreground)",
  };

  const openEdit = (template: EmailTemplate) => {
    setEditing(template);
    setEditBody(template.body);
    setEditSubject(template.subject);
    setEditorKey((k) => k + 1);
  };

  const handleSave = () => {
    if (!editing) return;
    setSaving(true);
    setTimeout(() => {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editing.id ? { ...t, subject: editSubject, body: editBody } : t
        )
      );
      setSaving(false);
      setEditing(null);
      setSuccess("Template saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    }, 600);
  };

  const toggleEnabled = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Customize the emails sent to users and employers
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

      {/* Available Variables */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ backgroundColor: "var(--section-bg)", borderColor: "var(--card-border)" }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>AVAILABLE VARIABLES</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(sampleData).map((v) => (
            <code
              key={v}
              className="rounded-md px-2 py-1 text-xs font-mono"
              style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}
            >
              {v}
            </code>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`rounded-xl border p-5 transition-opacity ${!template.enabled ? "opacity-50" : ""}`}
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 shrink-0" style={{ color: template.enabled ? "var(--accent)" : "var(--muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <h3 className="font-semibold">{template.name}</h3>
                  {!template.enabled && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
                      DISABLED
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{template.description}</p>
                <p className="mt-0.5 text-xs font-mono" style={{ color: "var(--muted)" }}>Subject: {template.subject}</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setPreviewing(template)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium"
                  style={{ backgroundColor: "var(--section-bg)", color: "var(--foreground)" }}
                  title="Preview"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => openEdit(template)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium"
                  style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
                  title="Edit"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                {/* Enable/Disable Toggle */}
                <button
                  onClick={() => toggleEnabled(template.id)}
                  className="relative h-6 w-11 rounded-full transition-colors"
                  style={{ backgroundColor: template.enabled ? "#16a34a" : "#d1d5db" }}
                  title={template.enabled ? "Disable template" : "Enable template"}
                >
                  <span
                    className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                    style={{ transform: template.enabled ? "translateX(20px)" : "translateX(0)" }}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewing && (() => {
        const { filledBody, filledSubject } = fillTemplate(previewing.body, previewing.subject);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
            <div
              className="w-full max-w-2xl rounded-2xl border max-h-[90vh] overflow-hidden flex flex-col"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              {/* Preview Header */}
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--card-border)" }}>
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>PREVIEW</p>
                  <h2 className="text-lg font-bold mt-1">{previewing.name}</h2>
                </div>
                <button
                  onClick={() => setPreviewing(null)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg hover:opacity-70"
                  style={{ backgroundColor: "var(--section-bg)" }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Email Envelope */}
              <div className="px-6 py-4 border-b text-sm space-y-1.5" style={{ borderColor: "var(--card-border)", backgroundColor: "var(--section-bg)" }}>
                <div className="flex gap-2">
                  <span className="font-medium w-16 shrink-0" style={{ color: "var(--muted)" }}>From:</span>
                  <span>Reekruitr &lt;noreply@reekruitr.com&gt;</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium w-16 shrink-0" style={{ color: "var(--muted)" }}>To:</span>
                  <span>John Doe &lt;john@example.com&gt;</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium w-16 shrink-0" style={{ color: "var(--muted)" }}>Subject:</span>
                  <span className="font-semibold">{filledSubject}</span>
                </div>
              </div>

              {/* Email Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div
                  className="rounded-xl border p-6 sm:p-8 text-sm leading-relaxed"
                  style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", color: "#333333" }}
                >
                  {/* Logo bar */}
                  <div className="text-center mb-6 pb-4 border-b" style={{ borderColor: "#e5e7eb" }}>
                    <div className="inline-flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: "#e86c3a" }}>R</div>
                      <span className="text-lg font-bold" style={{ color: "#1a1f2e" }}>Reekruitr</span>
                    </div>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: filledBody }} />
                  {/* Footer */}
                  <div className="mt-8 pt-4 border-t text-center text-xs" style={{ borderColor: "#e5e7eb", color: "#9ca3af" }}>
                    <p>&copy; 2026 Reekruitr. All rights reserved.</p>
                    <p className="mt-1">You&apos;re receiving this because you have an account on Reekruitr.</p>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="flex gap-3 p-6 border-t" style={{ borderColor: "var(--card-border)" }}>
                <button
                  onClick={() => { setPreviewing(null); openEdit(previewing); }}
                  className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white"
                  style={{ backgroundColor: "#e86c3a" }}
                >
                  Edit Template
                </button>
                <button
                  onClick={() => setPreviewing(null)}
                  className="rounded-lg px-6 py-2.5 text-sm font-medium border"
                  style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Edit Modal with WYSIWYG */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div
            className="w-full max-w-3xl rounded-2xl border max-h-[90vh] overflow-hidden flex flex-col"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--card-border)" }}>
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>EDITING TEMPLATE</p>
                <h2 className="text-lg font-bold mt-1">{editing.name}</h2>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:opacity-70"
                style={{ backgroundColor: "var(--section-bg)" }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted)" }}>Subject Line</label>
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 text-sm border outline-none"
                  style={inputStyles}
                />
              </div>

              {/* WYSIWYG Editor */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted)" }}>Email Body</label>
                <RichTextEditor
                  key={editorKey}
                  content={editBody}
                  onChange={(html) => setEditBody(html)}
                  placeholder="Write your email template..."
                />
              </div>

              {/* Variable helper */}
              <div
                className="rounded-lg p-3"
                style={{ backgroundColor: "var(--section-bg)" }}
              >
                <p className="text-[11px] font-semibold mb-2" style={{ color: "var(--muted)" }}>INSERT VARIABLE</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(sampleData).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        // Copy to clipboard
                        navigator.clipboard.writeText(v);
                        setSuccess(`Copied ${v} — paste it in the editor`);
                        setTimeout(() => setSuccess(""), 2000);
                      }}
                      className="rounded-md px-2 py-1 text-xs font-mono cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}
                      title={`Click to copy ${v}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex gap-3 p-6 border-t" style={{ borderColor: "var(--card-border)" }}>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: "#e86c3a" }}
              >
                {saving ? "Saving..." : "Save Template"}
              </button>
              <button
                onClick={() => setPreviewing(editing)}
                className="rounded-lg px-6 py-2.5 text-sm font-medium border"
                style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
              >
                Preview
              </button>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg px-6 py-2.5 text-sm font-medium"
                style={{ color: "var(--muted)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
