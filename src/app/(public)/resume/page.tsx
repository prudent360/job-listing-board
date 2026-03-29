"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import {
  EMPTY_RESUME,
  TEMPLATES,
  type ResumeData,
  type TemplateId,
  type Education,
  type Experience,
  type Project,
} from "@/components/resume/types";
import {
  ClassicTemplate,
  ElegantTemplate,
  TwoColumnTemplate,
  MinimalTemplate,
} from "@/components/resume/templates";

const templateComponents: Record<TemplateId, React.FC<{ data: ResumeData }>> = {
  classic: ClassicTemplate,
  elegant: ElegantTemplate,
  "two-column": TwoColumnTemplate,
  minimal: MinimalTemplate,
};

/* ─── Reusable form field ─── */
function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2 text-sm border outline-none focus:ring-2 focus:ring-[#5bcfb5]/40"
        style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--foreground)" }}
      />
    </div>
  );
}

/* ─── Section wrapper with collapsible ─── */
function FormSection({ title, icon, children, defaultOpen = true }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 font-semibold text-sm">
          {icon} {title}
        </span>
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 space-y-3">{children}</div>}
    </div>
  );
}

/* ─── Remove button ─── */
function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-red-400 hover:text-red-600 transition-colors" title="Remove">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}

export default function ResumeBuilderPage() {
  const { user } = useAuth();
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ResumeData>({ ...EMPTY_RESUME });
  const [template, setTemplate] = useState<TemplateId>("classic");
  const [downloading, setDownloading] = useState(false);
  const [tab, setTab] = useState<"form" | "preview">("form");

  const update = useCallback(<K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const arr = [...data.education];
    arr[index] = { ...arr[index], [field]: value };
    update("education", arr);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | string[]) => {
    const arr = [...data.experience];
    arr[index] = { ...arr[index], [field]: value };
    update("experience", arr);
  };

  const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
    const arr = [...data.projects];
    arr[index] = { ...arr[index], [field]: value };
    update("projects", arr);
  };

  const handleDownload = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!previewRef.current) return;
    setDownloading(true);

    const html2pdf = (await import("html2pdf.js")).default;
    const element = previewRef.current;

    await html2pdf()
      .set({
        margin: 0,
        filename: `${data.fullName || "resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(element)
      .save();

    setDownloading(false);
  };

  const handleReset = () => {
    if (confirm("Reset all fields? This cannot be undone.")) {
      setData({ ...EMPTY_RESUME });
    }
  };

  const TemplateComponent = templateComponents[template];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Resume Builder</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Build your professional resume — choose a template, fill in your details, and download as PDF.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium border transition-colors"
            style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {downloading ? "Generating..." : user ? "Download PDF" : "Sign in to Download"}
          </button>
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="lg:hidden flex rounded-lg border overflow-hidden mb-4" style={{ borderColor: "var(--card-border)" }}>
        <button onClick={() => setTab("form")} className="flex-1 px-4 py-2.5 text-sm font-medium" style={{ backgroundColor: tab === "form" ? "var(--accent)" : "transparent", color: tab === "form" ? "#fff" : "var(--foreground)" }}>
          Form Editor
        </button>
        <button onClick={() => setTab("preview")} className="flex-1 px-4 py-2.5 text-sm font-medium" style={{ backgroundColor: tab === "preview" ? "var(--accent)" : "transparent", color: tab === "preview" ? "#fff" : "var(--foreground)" }}>
          Live Preview
        </button>
      </div>

      <div className="flex gap-6">
        {/* LEFT: Template chooser + Form editor */}
        <div className={`w-full lg:w-[440px] shrink-0 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-1 ${tab === "preview" ? "hidden lg:block" : ""}`}>
          {/* Template chooser */}
          <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>Choose Template</p>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className="text-left rounded-lg border p-3 transition-all"
                  style={{
                    borderColor: template === t.id ? "var(--accent)" : "var(--card-border)",
                    backgroundColor: template === t.id ? "var(--badge-bg)" : "transparent",
                  }}
                >
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <FormSection title="Personal Information" icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>} defaultOpen={true}>
            <div className="grid grid-cols-1 gap-3">
              <Field label="Full Name" value={data.fullName} onChange={(v) => update("fullName", v)} placeholder="John Doe" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Email" value={data.email} onChange={(v) => update("email", v)} placeholder="john@example.com" type="email" />
                <Field label="Phone" value={data.phone} onChange={(v) => update("phone", v)} placeholder="+1 234 567 890" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="LinkedIn" value={data.linkedin} onChange={(v) => update("linkedin", v)} placeholder="linkedin.com/in/john" />
                <Field label="GitHub" value={data.github} onChange={(v) => update("github", v)} placeholder="github.com/john" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Portfolio" value={data.portfolio} onChange={(v) => update("portfolio", v)} placeholder="johndoe.dev" />
                <Field label="Location" value={data.location} onChange={(v) => update("location", v)} placeholder="New York, NY" />
              </div>
            </div>
          </FormSection>

          {/* Summary */}
          <FormSection title="Professional Summary" icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>} defaultOpen={false}>
            <textarea
              value={data.summary}
              onChange={(e) => update("summary", e.target.value)}
              rows={3}
              placeholder="Brief professional summary..."
              className="w-full rounded-lg px-3 py-2 text-sm border outline-none resize-none"
              style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--foreground)" }}
            />
          </FormSection>

          {/* Education */}
          <FormSection title="Education" icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15v-3.75m0 0h10.5" /></svg>} defaultOpen={false}>
            {data.education.map((edu, i) => (
              <div key={i} className="space-y-2 pb-3 mb-3 border-b last:border-0 last:pb-0 last:mb-0" style={{ borderColor: "var(--card-border)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Education #{i + 1}</span>
                  {data.education.length > 1 && <RemoveBtn onClick={() => update("education", data.education.filter((_, j) => j !== i))} />}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="School" value={edu.school} onChange={(v) => updateEducation(i, "school", v)} placeholder="MIT" />
                  <Field label="Location" value={edu.location} onChange={(v) => updateEducation(i, "location", v)} placeholder="Cambridge, MA" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Degree" value={edu.degree} onChange={(v) => updateEducation(i, "degree", v)} placeholder="Bachelor of Science" />
                  <Field label="Field of Study" value={edu.field} onChange={(v) => updateEducation(i, "field", v)} placeholder="Computer Science" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Field label="GPA" value={edu.gpa} onChange={(v) => updateEducation(i, "gpa", v)} placeholder="3.8" />
                  <Field label="Start Date" value={edu.startDate} onChange={(v) => updateEducation(i, "startDate", v)} placeholder="Aug 2020" />
                  <Field label="End Date" value={edu.endDate} onChange={(v) => updateEducation(i, "endDate", v)} placeholder="May 2024" />
                </div>
              </div>
            ))}
            <button
              onClick={() => update("education", [...data.education, { school: "", location: "", degree: "", field: "", gpa: "", startDate: "", endDate: "" }])}
              className="text-sm font-medium mt-1" style={{ color: "var(--accent)" }}
            >+ Add Education</button>
          </FormSection>

          {/* Experience */}
          <FormSection title="Experience" icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>} defaultOpen={false}>
            {data.experience.map((exp, i) => (
              <div key={i} className="space-y-2 pb-3 mb-3 border-b last:border-0 last:pb-0 last:mb-0" style={{ borderColor: "var(--card-border)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Experience #{i + 1}</span>
                  {data.experience.length > 1 && <RemoveBtn onClick={() => update("experience", data.experience.filter((_, j) => j !== i))} />}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Company" value={exp.company} onChange={(v) => updateExperience(i, "company", v)} placeholder="Google" />
                  <Field label="Job Title" value={exp.title} onChange={(v) => updateExperience(i, "title", v)} placeholder="Software Engineer" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Location" value={exp.location} onChange={(v) => updateExperience(i, "location", v)} placeholder="San Francisco" />
                  <Field label="Start Date" value={exp.startDate} onChange={(v) => updateExperience(i, "startDate", v)} placeholder="Jan 2023" />
                  <Field label="End Date" value={exp.endDate} onChange={(v) => updateExperience(i, "endDate", v)} placeholder="Present" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>Bullet Points</label>
                  {exp.bullets.map((b, bi) => (
                    <div key={bi} className="flex gap-2 mb-1.5">
                      <input
                        value={b}
                        onChange={(e) => {
                          const bullets = [...exp.bullets];
                          bullets[bi] = e.target.value;
                          updateExperience(i, "bullets", bullets);
                        }}
                        placeholder="Describe an achievement..."
                        className="flex-1 rounded-lg px-3 py-2 text-sm border outline-none"
                        style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--foreground)" }}
                      />
                      {exp.bullets.length > 1 && (
                        <button onClick={() => updateExperience(i, "bullets", exp.bullets.filter((_, j) => j !== bi))} className="text-red-400 hover:text-red-600"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => updateExperience(i, "bullets", [...exp.bullets, ""])} className="text-xs font-medium" style={{ color: "var(--accent)" }}>+ Add Bullet</button>
                </div>
              </div>
            ))}
            <button
              onClick={() => update("experience", [...data.experience, { company: "", title: "", location: "", startDate: "", endDate: "", bullets: [""] }])}
              className="text-sm font-medium mt-1" style={{ color: "var(--accent)" }}
            >+ Add Experience</button>
          </FormSection>

          {/* Projects */}
          <FormSection title="Projects" icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>} defaultOpen={false}>
            {data.projects.map((proj, i) => (
              <div key={i} className="space-y-2 pb-3 mb-3 border-b last:border-0 last:pb-0 last:mb-0" style={{ borderColor: "var(--card-border)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Project #{i + 1}</span>
                  {data.projects.length > 1 && <RemoveBtn onClick={() => update("projects", data.projects.filter((_, j) => j !== i))} />}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Project Name" value={proj.name} onChange={(v) => updateProject(i, "name", v)} placeholder="My App" />
                  <Field label="Technologies" value={proj.tech} onChange={(v) => updateProject(i, "tech", v)} placeholder="React, Node.js" />
                </div>
                <Field label="Link" value={proj.link} onChange={(v) => updateProject(i, "link", v)} placeholder="github.com/user/project" />
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>Bullet Points</label>
                  {proj.bullets.map((b, bi) => (
                    <div key={bi} className="flex gap-2 mb-1.5">
                      <input
                        value={b}
                        onChange={(e) => {
                          const bullets = [...proj.bullets];
                          bullets[bi] = e.target.value;
                          updateProject(i, "bullets", bullets);
                        }}
                        placeholder="Describe what you built..."
                        className="flex-1 rounded-lg px-3 py-2 text-sm border outline-none"
                        style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--foreground)" }}
                      />
                      {proj.bullets.length > 1 && (
                        <button onClick={() => updateProject(i, "bullets", proj.bullets.filter((_, j) => j !== bi))} className="text-red-400 hover:text-red-600"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => updateProject(i, "bullets", [...proj.bullets, ""])} className="text-xs font-medium" style={{ color: "var(--accent)" }}>+ Add Bullet</button>
                </div>
              </div>
            ))}
            <button
              onClick={() => update("projects", [...data.projects, { name: "", tech: "", link: "", bullets: [""] }])}
              className="text-sm font-medium mt-1" style={{ color: "var(--accent)" }}
            >+ Add Project</button>
          </FormSection>

          {/* Skills */}
          <FormSection title="Technical Skills" icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L3.2 12.68a2.25 2.25 0 003.18 3.18l2.62-3.18zm0 0l1.56-1.56m4.24 4.24l5.1-5.1m0 0l3.12 2.61a2.25 2.25 0 01-3.18 3.18l-2.62-3.18zm0 0l-1.56-1.56M13.5 3.75h.008v.008H13.5V3.75zm5.25 0h.008v.008h-.008V3.75zM8.25 3.75h.008v.008H8.25V3.75zm13.5 8.25h.008v.008h-.008V12zm0 5.25h.008v.008h-.008v-.008zm-13.5 0h.008v.008H8.25v-.008z" /></svg>} defaultOpen={false}>
            <textarea
              value={data.skills}
              onChange={(e) => update("skills", e.target.value)}
              rows={4}
              placeholder={"Languages: JavaScript, Python, Go\nFrameworks: React, Next.js, Django\nTools: Docker, AWS, Git"}
              className="w-full rounded-lg px-3 py-2 text-sm border outline-none resize-none"
              style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--foreground)" }}
            />
          </FormSection>

          {/* Achievements */}
          <FormSection title="Achievements" icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.568 6.023 6.023 0 01-2.77-.568" /></svg>} defaultOpen={false}>
            {data.achievements.map((a, i) => (
              <div key={i} className="flex gap-2 mb-1.5">
                <input
                  value={a}
                  onChange={(e) => {
                    const arr = [...data.achievements];
                    arr[i] = e.target.value;
                    update("achievements", arr);
                  }}
                  placeholder="Dean's List, Hackathon winner..."
                  className="flex-1 rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--foreground)" }}
                />
                {data.achievements.length > 1 && (
                  <button onClick={() => update("achievements", data.achievements.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                )}
              </div>
            ))}
            <button onClick={() => update("achievements", [...data.achievements, ""])} className="text-sm font-medium mt-1" style={{ color: "var(--accent)" }}>+ Add Achievement</button>
          </FormSection>

          {/* Custom Sections */}
          <FormSection title="Custom Sections" icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>} defaultOpen={false}>
            {data.customSections.map((sec, i) => (
              <div key={i} className="space-y-2 pb-3 mb-3 border-b last:border-0" style={{ borderColor: "var(--card-border)" }}>
                <div className="flex items-center justify-between">
                  <Field label="Section Title" value={sec.title} onChange={(v) => {
                    const arr = [...data.customSections];
                    arr[i] = { ...arr[i], title: v };
                    update("customSections", arr);
                  }} placeholder="Hobbies, Certifications..." />
                  <RemoveBtn onClick={() => update("customSections", data.customSections.filter((_, j) => j !== i))} />
                </div>
                <textarea
                  value={sec.content}
                  onChange={(e) => {
                    const arr = [...data.customSections];
                    arr[i] = { ...arr[i], content: e.target.value };
                    update("customSections", arr);
                  }}
                  rows={3}
                  placeholder="Section content..."
                  className="w-full rounded-lg px-3 py-2 text-sm border outline-none resize-none"
                  style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--foreground)" }}
                />
              </div>
            ))}
            <button onClick={() => update("customSections", [...data.customSections, { title: "", content: "" }])} className="text-sm font-medium" style={{ color: "var(--accent)" }}>+ Add Custom Section</button>
          </FormSection>
        </div>

        {/* RIGHT: Live Preview */}
        <div className={`flex-1 min-w-0 ${tab === "form" ? "hidden lg:block" : ""}`}>
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Live Preview — {TEMPLATES.find(t => t.id === template)?.name}</p>
            </div>
            <div
              className="rounded-xl border shadow-sm overflow-hidden"
              style={{ backgroundColor: "#fff", borderColor: "var(--card-border)" }}
            >
              <div
                ref={previewRef}
                style={{ width: "100%", minHeight: 600, aspectRatio: "8.5/11", backgroundColor: "#fff", color: "#222" }}
              >
                <TemplateComponent data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
