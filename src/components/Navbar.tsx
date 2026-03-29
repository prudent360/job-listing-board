"use client";

import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "STAFF"];

const navLinks = [
  { label: "Remote", href: "/?location=Remote" },
  { label: "US", href: "/?location=US" },
  { label: "UK", href: "/?location=UK" },
  { label: "Resume", href: "/resume" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "";
  const isAdmin = user && ADMIN_ROLES.includes(user.role);
  const postJobHref = isAdmin ? "/admin/jobs" : "/post-a-job";

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        backgroundColor: theme === "dark" ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold" style={{ color: "var(--accent)" }}>
              Reekruitr
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: "var(--foreground)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 transition-colors hover:opacity-80"
              style={{ backgroundColor: "var(--section-bg)" }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {!loading && (
              <>
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:opacity-80"
                      style={{ backgroundColor: "var(--section-bg)" }}
                    >
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: "var(--accent)" }}
                      >
                        {initials}
                      </div>
                      <span className="hidden sm:block text-sm font-medium">
                        {user.firstName}
                      </span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 rounded-xl border shadow-lg py-1"
                        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
                      >
                        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--card-border)" }}>
                          <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>{user.email}</p>
                          <span
                            className="inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}
                          >
                            {user.role.replace("_", " ")}
                          </span>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full px-4 py-2.5 text-sm hover:opacity-80"
                          style={{ color: "var(--foreground)" }}
                        >
                          Profile
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="block w-full px-4 py-2.5 text-sm hover:opacity-80"
                            style={{ color: "var(--foreground)" }}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); setDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:opacity-80 text-red-500"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:inline-block text-sm font-medium hover:opacity-80"
                    style={{ color: "var(--foreground)" }}
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}

            <Link
              href={postJobHref}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Post a Job
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden rounded-lg p-2"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Sign In</Link>
            )}
            {user && (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-sm font-medium text-red-500">Sign Out</button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
