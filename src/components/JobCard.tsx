"use client";

import Link from "next/link";

export interface JobCardData {
  id: number;
  slug?: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  posted: string;
  description: string;
  tags: string[];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export default function JobCard({ job }: { job: JobCardData }) {
  return (
    <Link
      href={`/job/${job.slug || job.id}`}
      className="group block rounded-xl border p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {job.logo}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold leading-snug group-hover:text-blue-500 transition-colors">
                {job.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {job.company}
              </p>
            </div>
            <span
              className="shrink-0 text-xs"
              style={{ color: "var(--muted)" }}
            >
              {job.posted}
            </span>
          </div>

          <p className="mt-2 text-sm line-clamp-2" style={{ color: "var(--muted)" }}>
            {stripHtml(job.description)}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </span>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}
            >
              {job.type}
            </span>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}
            >
              {job.salary}
            </span>
          </div>

          {job.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: "var(--section-bg)",
                    color: "var(--muted)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
