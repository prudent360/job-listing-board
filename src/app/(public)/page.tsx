"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Hero from "@/components/Hero";
import JobCard from "@/components/JobCard";

interface Job {
  id: number;
  slug: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  description: string;
  tags: string;
  status: string;
  createdAt: string;
  postedBy: { id: number; firstName: string; lastName: string; email: string };
}

interface Category {
  name: string;
  count: number;
}

const LOCATIONS = ["All Locations", "Remote", "US", "UK"];

function HomeContent() {
  const searchParams = useSearchParams();
  const initialLocation = searchParams.get("location") || "All Locations";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState(
    LOCATIONS.includes(initialLocation) ? initialLocation : "All Locations"
  );

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  // Update location filter when URL params change
  useEffect(() => {
    const loc = searchParams.get("location");
    if (loc && LOCATIONS.includes(loc)) {
      setSelectedLocation(loc);
    }
  }, [searchParams]);

  const categories: Category[] = useMemo(() => {
    const cats: Record<string, number> = {};
    jobs.forEach((job) => {
      cats[job.category] = (cats[job.category] || 0) + 1;
    });
    return [
      { name: "All", count: jobs.length },
      ...Object.entries(cats)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, count]) => ({ name, count })),
    ];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || job.category === selectedCategory;

      const matchesLocation =
        selectedLocation === "All Locations" ||
        (selectedLocation === "Remote" && job.location === "Remote") ||
        (selectedLocation === "US" && job.location.includes("US")) ||
        (selectedLocation === "UK" && job.location.includes("UK"));

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [jobs, searchQuery, selectedCategory, selectedLocation]);

  return (
    <>
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        jobCount={jobs.length}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          /* Loading skeleton */
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                {[80, 100, 60, 70, 90, 100, 80].map((w, i) => (
                  <div
                    key={i}
                    className="rounded-full h-9 animate-pulse"
                    style={{
                      width: `${w}px`,
                      backgroundColor: "var(--section-bg)",
                    }}
                  />
                ))}
              </div>
              <div
                className="rounded-lg h-9 w-36 animate-pulse"
                style={{ backgroundColor: "var(--section-bg)" }}
              />
            </div>
            <div
              className="h-5 w-40 rounded animate-pulse mb-4"
              style={{ backgroundColor: "var(--section-bg)" }}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-5 animate-pulse"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="h-12 w-12 rounded-lg shrink-0"
                      style={{ backgroundColor: "var(--section-bg)" }}
                    />
                    <div className="flex-1 space-y-3">
                      <div
                        className="h-4 rounded w-3/4"
                        style={{ backgroundColor: "var(--section-bg)" }}
                      />
                      <div
                        className="h-3 rounded w-1/2"
                        style={{ backgroundColor: "var(--section-bg)" }}
                      />
                      <div
                        className="h-3 rounded w-full"
                        style={{ backgroundColor: "var(--section-bg)" }}
                      />
                      <div className="flex gap-2">
                        <div
                          className="h-6 rounded-full w-16"
                          style={{ backgroundColor: "var(--section-bg)" }}
                        />
                        <div
                          className="h-6 rounded-full w-16"
                          style={{ backgroundColor: "var(--section-bg)" }}
                        />
                        <div
                          className="h-6 rounded-full w-20"
                          style={{ backgroundColor: "var(--section-bg)" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Filters row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor:
                        selectedCategory === cat.name
                          ? "var(--accent)"
                          : "var(--section-bg)",
                      color:
                        selectedCategory === cat.name
                          ? "#fff"
                          : "var(--foreground)",
                    }}
                  >
                    {cat.name}
                    <span className="ml-1.5 opacity-70">({cat.count})</span>
                  </button>
                ))}
              </div>

              {/* Location dropdown */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="rounded-lg px-4 py-2 text-sm border outline-none"
                style={{
                  backgroundColor: "var(--input-bg)",
                  borderColor: "var(--input-border)",
                  color: "var(--foreground)",
                }}
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count */}
            <p className="mb-4 text-sm" style={{ color: "var(--muted)" }}>
              Showing {filteredJobs.length} of {jobs.length} jobs
            </p>

            {/* Job listing grid */}
            {filteredJobs.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={{
                      id: job.id,
                      slug: job.slug,
                      title: job.title,
                      company: job.company,
                      logo: job.company
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase(),
                      location: job.location,
                      type: job.type,
                      salary: job.salary,
                      category: job.category,
                      posted: new Date(job.createdAt).toLocaleDateString(),
                      description: job.description,
                      tags: job.tags
                        ? job.tags.split(",").map((t) => t.trim())
                        : [],
                    }}
                  />
                ))}
              </div>
            ) : (
              <div
                className="rounded-xl border p-12 text-center"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                }}
              >
                <svg
                  className="mx-auto h-12 w-12"
                  style={{ color: "var(--muted)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-semibold">No jobs found</h3>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  Try adjusting your search or filters to find what you&apos;re
                  looking for.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
