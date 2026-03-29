import type { TemplateProps } from "./types";

function ContactLine({ items }: { items: string[] }) {
  const filtered = items.filter(Boolean);
  if (!filtered.length) return null;
  return (
    <div style={{ fontSize: "9pt", color: "#555", textAlign: "center", marginTop: 4 }}>
      {filtered.map((item, i) => (
        <span key={i}>
          {i > 0 && <span style={{ margin: "0 6px", color: "#bbb" }}>|</span>}
          {item}
        </span>
      ))}
    </div>
  );
}

function SectionHeading({ title, style }: { title: string; style?: React.CSSProperties }) {
  return (
    <div style={{ borderBottom: "1.5px solid #222", paddingBottom: 2, marginBottom: 6, marginTop: 14, ...style }}>
      <h2 style={{ fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>{title}</h2>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  const filtered = items.filter(Boolean);
  if (!filtered.length) return null;
  return (
    <ul style={{ margin: "2px 0 0 0", paddingLeft: 18 }}>
      {filtered.map((b, i) => (
        <li key={i} style={{ fontSize: "9.5pt", lineHeight: 1.5, marginBottom: 1 }}>{b}</li>
      ))}
    </ul>
  );
}

// ─── CLASSIC PROFESSIONAL ───
export function ClassicTemplate({ data }: TemplateProps) {
  return (
    <div style={{ fontFamily: "'Times New Roman', Georgia, serif", color: "#222", padding: "32px 40px", lineHeight: 1.4 }}>
      <h1 style={{ fontSize: "22pt", fontWeight: 700, textAlign: "center", margin: 0, letterSpacing: 1 }}>{data.fullName || "Your Name"}</h1>
      <ContactLine items={[data.email, data.phone, data.linkedin, data.github, data.portfolio, data.location]} />

      {data.summary && (
        <>
          <SectionHeading title="Summary" />
          <p style={{ fontSize: "9.5pt", margin: 0 }}>{data.summary}</p>
        </>
      )}

      {data.education.some(e => e.school) && (
        <>
          <SectionHeading title="Education" />
          {data.education.filter(e => e.school).map((edu, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "10pt" }}>{edu.school}</strong>
                <span style={{ fontSize: "9pt", color: "#555" }}>{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9.5pt" }}>
                <em>{[edu.degree, edu.field].filter(Boolean).join(" in ")}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</em>
                <span style={{ color: "#555" }}>{edu.location}</span>
              </div>
            </div>
          ))}
        </>
      )}

      {data.experience.some(e => e.company) && (
        <>
          <SectionHeading title="Experience" />
          {data.experience.filter(e => e.company).map((exp, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "10pt" }}>{exp.company}</strong>
                <span style={{ fontSize: "9pt", color: "#555" }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9.5pt" }}>
                <em>{exp.title}</em>
                <span style={{ color: "#555" }}>{exp.location}</span>
              </div>
              <Bullets items={exp.bullets} />
            </div>
          ))}
        </>
      )}

      {data.projects.some(p => p.name) && (
        <>
          <SectionHeading title="Projects" />
          {data.projects.filter(p => p.name).map((proj, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: "10pt" }}>
                <strong>{proj.name}</strong>
                {proj.tech && <span style={{ color: "#555" }}> | {proj.tech}</span>}
                {proj.link && <span style={{ color: "#555" }}> · {proj.link}</span>}
              </div>
              <Bullets items={proj.bullets} />
            </div>
          ))}
        </>
      )}

      {data.skills && (
        <>
          <SectionHeading title="Technical Skills" />
          <p style={{ fontSize: "9.5pt", margin: 0, whiteSpace: "pre-wrap" }}>{data.skills}</p>
        </>
      )}

      {data.achievements.some(Boolean) && (
        <>
          <SectionHeading title="Achievements" />
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {data.achievements.filter(Boolean).map((a, i) => (
              <li key={i} style={{ fontSize: "9.5pt", lineHeight: 1.5 }}>{a}</li>
            ))}
          </ul>
        </>
      )}

      {data.customSections.filter(s => s.title).map((sec, i) => (
        <div key={i}>
          <SectionHeading title={sec.title} />
          <p style={{ fontSize: "9.5pt", margin: 0, whiteSpace: "pre-wrap" }}>{sec.content}</p>
        </div>
      ))}
    </div>
  );
}

// ─── ELEGANT ───
export function ElegantTemplate({ data }: TemplateProps) {
  const accent = "#2a6f5e";
  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: "#333", padding: "32px 40px", lineHeight: 1.4 }}>
      <h1 style={{ fontSize: "24pt", fontWeight: 300, textAlign: "center", margin: 0, color: accent, letterSpacing: 2 }}>{data.fullName || "Your Name"}</h1>
      <ContactLine items={[data.email, data.phone, data.linkedin, data.github, data.portfolio, data.location]} />

      {data.summary && (
        <>
          <SectionHeading title="Summary" style={{ borderColor: accent, color: accent }} />
          <p style={{ fontSize: "9.5pt", margin: 0 }}>{data.summary}</p>
        </>
      )}

      {data.education.some(e => e.school) && (
        <>
          <SectionHeading title="Education" style={{ borderColor: accent, color: accent }} />
          {data.education.filter(e => e.school).map((edu, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "10pt" }}>{edu.school}</strong>
                <span style={{ fontSize: "9pt", color: "#777" }}>{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</span>
              </div>
              <div style={{ fontSize: "9.5pt", color: "#555" }}>
                {[edu.degree, edu.field].filter(Boolean).join(" in ")}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""} — {edu.location}
              </div>
            </div>
          ))}
        </>
      )}

      {data.experience.some(e => e.company) && (
        <>
          <SectionHeading title="Experience" style={{ borderColor: accent, color: accent }} />
          {data.experience.filter(e => e.company).map((exp, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "10pt" }}>{exp.company}</strong>
                <span style={{ fontSize: "9pt", color: "#777" }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}</span>
              </div>
              <div style={{ fontSize: "9.5pt", fontStyle: "italic", color: "#555" }}>{exp.title} — {exp.location}</div>
              <Bullets items={exp.bullets} />
            </div>
          ))}
        </>
      )}

      {data.projects.some(p => p.name) && (
        <>
          <SectionHeading title="Projects" style={{ borderColor: accent, color: accent }} />
          {data.projects.filter(p => p.name).map((proj, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong style={{ fontSize: "10pt" }}>{proj.name}</strong>
              {proj.tech && <span style={{ color: "#777", fontSize: "9pt" }}> | {proj.tech}</span>}
              <Bullets items={proj.bullets} />
            </div>
          ))}
        </>
      )}

      {data.skills && (
        <>
          <SectionHeading title="Skills" style={{ borderColor: accent, color: accent }} />
          <p style={{ fontSize: "9.5pt", margin: 0, whiteSpace: "pre-wrap" }}>{data.skills}</p>
        </>
      )}

      {data.achievements.some(Boolean) && (
        <>
          <SectionHeading title="Achievements" style={{ borderColor: accent, color: accent }} />
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {data.achievements.filter(Boolean).map((a, i) => (
              <li key={i} style={{ fontSize: "9.5pt", lineHeight: 1.5 }}>{a}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ─── TWO-COLUMN ───
export function TwoColumnTemplate({ data }: TemplateProps) {
  const accent = "#2a6f5e";
  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: "#333", display: "flex", minHeight: "100%" }}>
      {/* Sidebar */}
      <div style={{ width: "35%", backgroundColor: accent, color: "#fff", padding: "32px 20px" }}>
        <h1 style={{ fontSize: "16pt", fontWeight: 700, margin: "0 0 4px 0", wordBreak: "break-word" }}>{data.fullName || "Your Name"}</h1>
        <div style={{ fontSize: "8pt", lineHeight: 1.6, marginTop: 12, opacity: 0.9 }}>
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.location && <div>{data.location}</div>}
          {data.linkedin && <div>{data.linkedin}</div>}
          {data.github && <div>{data.github}</div>}
          {data.portfolio && <div>{data.portfolio}</div>}
        </div>

        {data.skills && (
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: 3, marginBottom: 6 }}>Skills</h2>
            <p style={{ fontSize: "8.5pt", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap", opacity: 0.9 }}>{data.skills}</p>
          </div>
        )}

        {data.achievements.some(Boolean) && (
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: 3, marginBottom: 6 }}>Achievements</h2>
            <ul style={{ margin: 0, paddingLeft: 14, fontSize: "8.5pt", lineHeight: 1.6, opacity: 0.9 }}>
              {data.achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "32px 28px" }}>
        {data.summary && (
          <>
            <SectionHeading title="Summary" style={{ borderColor: accent }} />
            <p style={{ fontSize: "9.5pt", margin: 0 }}>{data.summary}</p>
          </>
        )}

        {data.experience.some(e => e.company) && (
          <>
            <SectionHeading title="Experience" style={{ borderColor: accent }} />
            {data.experience.filter(e => e.company).map((exp, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "10pt" }}>{exp.company}</strong>
                  <span style={{ fontSize: "8.5pt", color: "#777" }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}</span>
                </div>
                <div style={{ fontSize: "9pt", fontStyle: "italic", color: "#555" }}>{exp.title}</div>
                <Bullets items={exp.bullets} />
              </div>
            ))}
          </>
        )}

        {data.education.some(e => e.school) && (
          <>
            <SectionHeading title="Education" style={{ borderColor: accent }} />
            {data.education.filter(e => e.school).map((edu, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "10pt" }}>{edu.school}</strong>
                  <span style={{ fontSize: "8.5pt", color: "#777" }}>{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</span>
                </div>
                <div style={{ fontSize: "9pt", color: "#555" }}>
                  {[edu.degree, edu.field].filter(Boolean).join(" in ")}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                </div>
              </div>
            ))}
          </>
        )}

        {data.projects.some(p => p.name) && (
          <>
            <SectionHeading title="Projects" style={{ borderColor: accent }} />
            {data.projects.filter(p => p.name).map((proj, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <strong style={{ fontSize: "10pt" }}>{proj.name}</strong>
                {proj.tech && <span style={{ color: "#777", fontSize: "9pt" }}> | {proj.tech}</span>}
                <Bullets items={proj.bullets} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── MINIMAL CLEAN ───
export function MinimalTemplate({ data }: TemplateProps) {
  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: "#333", padding: "36px 44px", lineHeight: 1.45 }}>
      <h1 style={{ fontSize: "20pt", fontWeight: 600, margin: 0, borderBottom: "2px solid #333", paddingBottom: 6 }}>{data.fullName || "Your Name"}</h1>
      <div style={{ fontSize: "9pt", color: "#666", marginTop: 6, display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
        {[data.email, data.phone, data.location, data.linkedin, data.github, data.portfolio].filter(Boolean).map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>

      {data.summary && (
        <p style={{ fontSize: "9.5pt", marginTop: 14, color: "#444" }}>{data.summary}</p>
      )}

      {data.experience.some(e => e.company) && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#999", margin: "0 0 8px 0" }}>Experience</h2>
          {data.experience.filter(e => e.company).map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "10pt" }}><strong>{exp.title}</strong> at {exp.company}</span>
                <span style={{ fontSize: "8.5pt", color: "#888" }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}</span>
              </div>
              <Bullets items={exp.bullets} />
            </div>
          ))}
        </div>
      )}

      {data.education.some(e => e.school) && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#999", margin: "0 0 8px 0" }}>Education</h2>
          {data.education.filter(e => e.school).map((edu, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "10pt" }}><strong>{edu.school}</strong> — {[edu.degree, edu.field].filter(Boolean).join(" in ")}</span>
                <span style={{ fontSize: "8.5pt", color: "#888" }}>{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.projects.some(p => p.name) && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#999", margin: "0 0 8px 0" }}>Projects</h2>
          {data.projects.filter(p => p.name).map((proj, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong style={{ fontSize: "10pt" }}>{proj.name}</strong>
              {proj.tech && <span style={{ color: "#888", fontSize: "9pt" }}> — {proj.tech}</span>}
              <Bullets items={proj.bullets} />
            </div>
          ))}
        </div>
      )}

      {data.skills && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#999", margin: "0 0 6px 0" }}>Skills</h2>
          <p style={{ fontSize: "9.5pt", margin: 0, whiteSpace: "pre-wrap" }}>{data.skills}</p>
        </div>
      )}

      {data.achievements.some(Boolean) && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#999", margin: "0 0 6px 0" }}>Achievements</h2>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {data.achievements.filter(Boolean).map((a, i) => <li key={i} style={{ fontSize: "9.5pt", lineHeight: 1.5 }}>{a}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
