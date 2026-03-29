export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  location: string;
  summary: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string;
  achievements: string[];
  customSections: CustomSection[];
}

export interface Education {
  school: string;
  location: string;
  degree: string;
  field: string;
  gpa: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Project {
  name: string;
  tech: string;
  link: string;
  bullets: string[];
}

export interface CustomSection {
  title: string;
  content: string;
}

export interface TemplateProps {
  data: ResumeData;
}

export const EMPTY_RESUME: ResumeData = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  location: "",
  summary: "",
  education: [{ school: "", location: "", degree: "", field: "", gpa: "", startDate: "", endDate: "" }],
  experience: [{ company: "", title: "", location: "", startDate: "", endDate: "", bullets: [""] }],
  projects: [{ name: "", tech: "", link: "", bullets: [""] }],
  skills: "",
  achievements: [""],
  customSections: [],
};

export const TEMPLATES = [
  { id: "classic", name: "Classic Professional", desc: "Single-column, ATS-friendly. Clean and professional." },
  { id: "elegant", name: "Elegant", desc: "Single-column with colored headings and subtle styling." },
  { id: "two-column", name: "Modern Two-Column", desc: "Modern layout with a colored sidebar for skills." },
  { id: "minimal", name: "Minimal Clean", desc: "Ultra-clean, whitespace-focused minimal design." },
] as const;

export type TemplateId = typeof TEMPLATES[number]["id"];
