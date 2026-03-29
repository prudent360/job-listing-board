/**
 * Shared utility functions for the Reekruitr application.
 */

/**
 * Returns a human-readable relative time string from a date string.
 * e.g., "just now", "5m ago", "3h ago", "2d ago"
 */
export function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Generates a URL-friendly slug from company name and job title.
 * e.g., "TechCorp", "Senior React Developer" → "techcorp-is-hiring-for-senior-react-developer"
 */
export function generateSlug(company: string, title: string): string {
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")   // remove special chars
      .replace(/\s+/g, "-")       // spaces to hyphens
      .replace(/-+/g, "-")        // collapse multiple hyphens
      .replace(/^-+|-+$/g, "");   // trim hyphens from edges

  const companySlug = slugify(company);
  const titleSlug = slugify(title);

  return `${companySlug}-is-hiring-for-${titleSlug}`;
}
