"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import Image from "next/image";
import { timeAgo } from "@/lib/utils";

interface Job {
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
  createdAt: string;
  postedBy: { id: number; firstName: string; lastName: string };
  _count: { applications: number };
}

const PLACEHOLDER_IMAGES = [
  "/images/job-placeholder-1.png",
  "/images/job-placeholder-2.png",
  "/images/job-placeholder-3.png",
];

function getPlaceholderImage(id: number): string {
  return PLACEHOLDER_IMAGES[id % PLACEHOLDER_IMAGES.length];
}

/* ---- SVG Icon Components ---- */
function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

function CurrencyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  );
}

export default function JobDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Application state
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverNote, setCoverNote] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    fetch(`/api/jobs/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setJob(data.job))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push("/login");
      return;
    }
    setApplyError("");
    setApplying(true);

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId: job!.id, coverNote }),
    });

    const data = await res.json();
    setApplying(false);

    if (!res.ok) {
      setApplyError(data.error);
      return;
    }

    setApplied(true);
    setShowApplyForm(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-24 rounded" style={{ backgroundColor: "var(--section-bg)" }} />
          <div className="h-64 w-full rounded-2xl" style={{ backgroundColor: "var(--section-bg)" }} />
          <div className="h-8 w-3/4 rounded" style={{ backgroundColor: "var(--section-bg)" }} />
          <div className="h-4 w-1/3 rounded" style={{ backgroundColor: "var(--section-bg)" }} />
          <div className="flex gap-3">
            {[80, 80, 100].map((w, i) => (
              <div key={i} className="h-8 rounded-full" style={{ width: w, backgroundColor: "var(--section-bg)" }} />
            ))}
          </div>
          <div className="h-px" style={{ backgroundColor: "var(--card-border)" }} />
          <div className="space-y-3">
            {[100, 95, 80, 60, 90, 75, 85].map((w, i) => (
              <div key={i} className="h-4 rounded" style={{ width: `${w}%`, backgroundColor: "var(--section-bg)" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <svg className="mx-auto h-16 w-16" style={{ color: "var(--muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <h1 className="mt-4 text-2xl font-bold">Job Not Found</h1>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          This job listing may have been removed or is no longer available.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Browse All Jobs
        </Link>
      </div>
    );
  }

  const tags = job.tags ? job.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const postedDate = new Date(job.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jobDetails = [
    {
      icon: <LocationIcon className="h-6 w-6" />,
      label: "Location",
      value: job.location,
    },
    {
      icon: <BriefcaseIcon className="h-6 w-6" />,
      label: "Job Type",
      value: job.type,
    },
    {
      icon: <CurrencyIcon className="h-6 w-6" />,
      label: "Salary",
      value: job.salary,
    },
    {
      icon: <TagIcon className="h-6 w-6" />,
      label: "Category",
      value: job.category,
    },
  ];

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-8 pb-32">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-80 transition-opacity"
          style={{ color: "var(--accent)" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </Link>

        {/* Featured Image */}
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
          <Image
            src={getPlaceholderImage(job.id)}
            alt={`${job.company} workplace`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        {/* Posted date */}
        <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
          {job.company} · {postedDate}
        </p>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
          {job.title}
        </h1>

        {/* Subtitle / Location */}
        <p className="mt-2 text-lg" style={{ color: "var(--muted)" }}>
          {job.location}
        </p>

        {/* Job Details Card — moved up */}
        <div className="mt-6">
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5" style={{ color: "var(--muted)" }}>
              Job Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {jobDetails.map((item) => (
                <div key={item.label}>
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg mb-2"
                    style={{ backgroundColor: "var(--badge-bg)", color: "var(--accent)" }}
                  >
                    {item.icon}
                  </div>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{item.label}</p>
                  <p className="text-sm font-semibold mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-5 pt-5 border-t flex flex-wrap gap-2" style={{ borderColor: "var(--card-border)" }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                    style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px" style={{ backgroundColor: "var(--card-border)" }} />

        {/* Job Description */}
        <article>
          <h2 className="text-xl font-bold mb-4">About the Role</h2>
          <div
            className="job-description text-base leading-relaxed"
            style={{ color: "var(--muted)" }}
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </article>

        {/* Posted by + application count */}
        <div className="mt-6 flex items-center justify-between text-sm" style={{ color: "var(--muted)" }}>
          <span>Posted by {job.postedBy.firstName} {job.postedBy.lastName} · {timeAgo(job.createdAt)}</span>
          <span>{job._count.applications} application{job._count.applications !== 1 ? "s" : ""}</span>
        </div>

        {/* Inline apply form (shown when expanded) */}
        {showApplyForm && (
          <div className="mt-8">
            <div
              className="rounded-2xl border p-6 sm:p-8"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              <h3 className="text-lg font-bold mb-4">Submit Your Application</h3>

              {applyError && (
                <div
                  className="rounded-lg border p-3 text-sm mb-4"
                  style={{ backgroundColor: "var(--error-bg)", borderColor: "var(--error-border)", color: "var(--error-text)" }}
                >
                  {applyError}
                </div>
              )}

              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Cover Note <span className="font-normal" style={{ color: "var(--muted)" }}>(optional)</span>
                  </label>
                  <textarea
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    rows={5}
                    placeholder="Tell the hiring team why you're a great fit for this role..."
                    className="w-full rounded-xl px-4 py-3 text-sm border outline-none resize-none transition-colors focus:ring-2 focus:ring-blue-300"
                    style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--foreground)" }}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex-1 rounded-full py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    {applying ? "Submitting..." : "Submit Application"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowApplyForm(false); setApplyError(""); }}
                    className="rounded-full px-6 py-3 text-sm font-medium border transition-colors"
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

      {/* Sticky Apply Now bar at the bottom */}
      {!showApplyForm && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="mx-auto max-w-3xl px-4 py-4">
            {applied ? (
              <div className="flex items-center justify-center gap-2 py-2">
                <svg className="h-5 w-5" style={{ color: "#16a34a" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold" style={{ color: "#16a34a" }}>
                  Application Submitted! You&apos;ll hear back from {job.company} soon.
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="hidden sm:block min-w-0">
                  <p className="font-semibold truncate">{job.title}</p>
                  <p className="text-sm truncate" style={{ color: "var(--muted)" }}>{job.company} · {job.salary}</p>
                </div>
                {job.externalApplyUrl ? (
                  <a
                    href={job.externalApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto rounded-full px-10 py-3.5 text-base font-bold text-white text-center transition-all hover:opacity-90 hover:shadow-lg inline-flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#16a34a" }}
                  >
                    Apply on Company Site
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      if (!user) {
                        router.push("/login");
                        return;
                      }
                      setShowApplyForm(true);
                      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                    }}
                    className="w-full sm:w-auto rounded-full px-10 py-3.5 text-base font-bold text-white transition-all hover:opacity-90 hover:shadow-lg"
                    style={{ backgroundColor: "#16a34a" }}
                  >
                    Apply Now!
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
