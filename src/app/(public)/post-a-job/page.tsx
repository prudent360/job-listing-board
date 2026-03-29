"use client";

import Link from "next/link";

const benefits = [
  {
    title: "Reach Targeted Talent",
    description: "Connect with qualified candidates actively looking for opportunities.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Simple Process",
    description: "Just send us the job details, and we'll handle the formatting and posting.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    title: "Quick Support",
    description: "Our team is available to help you with any questions about your listing.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
];

export default function PostAJobPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Hero Section */}
      <div className="mx-auto max-w-3xl px-4 pt-16 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Post a Job on Reekruitr
        </h1>
        <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
          We&apos;re currently accepting job postings directly via email. To post a job, please contact our team.
        </p>
      </div>

      {/* Contact Card */}
      <div className="mx-auto max-w-xl px-4 mb-16">
        <div
          className="rounded-2xl p-8 sm:p-10 text-center"
          style={{ backgroundColor: "var(--section-bg)" }}
        >
          <h2 className="text-xl font-bold mb-5">Contact Us to Post</h2>
          <a
            href="mailto:postajob@reekruitr.com"
            className="inline-flex items-center gap-2.5 rounded-xl px-8 py-4 text-base font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
            style={{ backgroundColor: "#1a1f2e" }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            postajob@reekruitr.com
          </a>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="mx-auto max-w-3xl px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center sm:text-left">
              <div
                className="mx-auto sm:mx-0 mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--badge-bg)", color: "var(--accent)" }}
              >
                {benefit.icon}
              </div>
              <h3 className="font-bold text-base mb-1.5">{benefit.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="border-t py-8 text-center"
        style={{ borderColor: "var(--card-border)" }}
      >
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold hover:opacity-80" style={{ color: "var(--accent)" }}>
            Sign in to manage your listings
          </Link>
        </p>
      </div>
    </div>
  );
}
