"use client";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  jobCount: number;
}

export default function Hero({ searchQuery, onSearchChange, jobCount }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      style={{
        background: "linear-gradient(135deg, var(--hero-gradient-from), var(--hero-gradient-to))",
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Find Your Next Career Move
        </h1>
        <p className="mt-4 text-lg text-blue-100 sm:text-xl">
          Join thousands of professionals who have found their dream jobs through Reekruitr.
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-200">
          <div className="flex -space-x-2">
            {["bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400", "bg-pink-400"].map((color, i) => (
              <div
                key={i}
                className={`h-8 w-8 rounded-full border-2 border-white ${color} flex items-center justify-center text-xs font-bold text-white`}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <span>Loved by 10,000+ professionals</span>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl py-4 pl-12 pr-4 text-base shadow-lg outline-none transition-shadow focus:ring-2 focus:ring-blue-300"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--foreground)",
                border: "1px solid var(--card-border)",
              }}
            />
          </div>
          <button
            className="rounded-xl px-8 py-4 text-base font-semibold text-white shadow-lg transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Search
          </button>
        </div>

        <p className="mt-4 text-sm text-blue-200">
          {jobCount} active jobs available · Remote & Global opportunities
        </p>
      </div>
    </section>
  );
}
