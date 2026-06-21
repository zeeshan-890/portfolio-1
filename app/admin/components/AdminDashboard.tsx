"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PortfolioData, PortfolioProject } from "@/app/data/portfolioTypes";
import {
  ProjectEditor,
  StatListEditor,
  StringListEditor,
  TagInput,
  TextAreaField,
  TextField,
  ToggleField,
} from "./AdminFields";
import ResumeManager from "./ResumeManager";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "hero", label: "Hero & Stats" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
  { id: "navigation", label: "Navigation" },
  { id: "sections", label: "Sections" },
  { id: "seo", label: "SEO" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function createProjectId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || `project-${Date.now()}`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [tab, setTab] = useState<TabId>("profile");
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const res = await fetch("/api/portfolio");
    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as { error?: string; details?: string } | null;
      const message = payload?.details
        ? `${payload.error ?? "Failed to load portfolio data"}: ${payload.details}`
        : payload?.error ?? "Failed to load portfolio data";
      setStatus({ type: "error", message });
      setLoading(false);
      return;
    }
    const json = (await res.json()) as PortfolioData;
    setData(json);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setStatus(null);

    const res = await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setStatus({ type: "success", message: "Portfolio saved successfully!" });
    } else {
      const payload = (await res.json().catch(() => null)) as { error?: string; details?: string } | null;
      const message = payload?.details
        ? `${payload.error ?? "Failed to save"}: ${payload.details}`
        : payload?.error ?? "Failed to save. Check your session and try again.";
      setStatus({ type: "error", message });
    }
    setSaving(false);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function update(updater: (prev: PortfolioData) => PortfolioData) {
    setData((prev) => (prev ? updater(prev) : prev));
  }

  function moveProject(index: number, direction: -1 | 1) {
    update((prev) => {
      const next = [...prev.projects];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, projects: next };
    });
  }

  function addProject() {
    const newProject: PortfolioProject = {
      id: `new-project-${Date.now()}`,
      title: "New Project",
      shortDescription: "",
      technologies: [],
      category: "Full Stack",
    };
    update((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
  }

  if (loading) {
    return (
      <div className="admin-login">
        <p>Loading portfolio data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-login">
        <p className="admin-status error">Could not load portfolio data.</p>
        <button type="button" className="admin-btn" onClick={loadData}>
          Retry
        </button>
      </div>
    );
  }

  const tabLabels: Record<TabId, string> = {
    profile: "Profile",
    hero: "Hero & Stats",
    skills: "Skills",
    about: "About",
    projects: "Projects",
    contact: "Contact",
    navigation: "Navigation",
    sections: "Section Visibility",
    seo: "SEO & Metadata",
  };

  return (
    <div className="admin-shell">
        <aside className="admin-sidebar">
          <h1>Portfolio Admin</h1>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`admin-nav-btn${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
          <div className="admin-sidebar-footer">
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn">
              View Site
            </a>
            <button type="button" className="admin-btn admin-btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-header">
            <h2>{tabLabels[tab]}</h2>
            <div className="admin-actions">
              <button type="button" className="admin-btn" onClick={loadData}>
                Reload
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {status && <div className={`admin-status ${status.type}`}>{status.message}</div>}

          {tab === "profile" && (
            <div className="admin-panel">
              <div className="admin-grid">
                <TextField
                  label="Full Name"
                  value={data.profile.name}
                  onChange={(name) => update((p) => ({ ...p, profile: { ...p.profile, name } }))}
                />
                <TextField
                  label="First Name (display split)"
                  value={data.profile.firstName}
                  onChange={(firstName) =>
                    update((p) => ({ ...p, profile: { ...p.profile, firstName } }))
                  }
                />
                <TextField
                  label="Role / Job Title"
                  value={data.profile.role}
                  onChange={(role) => update((p) => ({ ...p, profile: { ...p.profile, role } }))}
                />
                <TextField
                  label="Email"
                  type="email"
                  value={data.profile.email}
                  onChange={(email) => update((p) => ({ ...p, profile: { ...p.profile, email } }))}
                />
                <TextField
                  label="Location"
                  value={data.profile.location}
                  onChange={(location) =>
                    update((p) => ({ ...p, profile: { ...p.profile, location } }))
                  }
                />
                <TextField
                  label="LinkedIn URL"
                  value={data.profile.linkedin}
                  onChange={(linkedin) =>
                    update((p) => ({ ...p, profile: { ...p.profile, linkedin } }))
                  }
                />
                <TextField
                  label="GitHub URL"
                  value={data.profile.github}
                  onChange={(github) => update((p) => ({ ...p, profile: { ...p.profile, github } }))}
                />
                <ResumeManager
                  resumes={data.resumes}
                  onResumesChange={(resumes) => update((p) => ({ ...p, resumes }))}
                />
                <TextField
                  label="Profile Image Path"
                  value={data.profile.imagePath}
                  onChange={(imagePath) =>
                    update((p) => ({ ...p, profile: { ...p.profile, imagePath } }))
                  }
                  placeholder="/profilepic.png"
                />
                <TextField
                  label="Availability Text"
                  value={data.profile.availabilityText}
                  onChange={(availabilityText) =>
                    update((p) => ({ ...p, profile: { ...p.profile, availabilityText } }))
                  }
                />
                <TextAreaField
                  label="Tagline"
                  value={data.profile.tagline}
                  onChange={(tagline) => update((p) => ({ ...p, profile: { ...p.profile, tagline } }))}
                />
              </div>
            </div>
          )}

          {tab === "hero" && (
            <>
              <div className="admin-panel">
                <h3>Hero Buttons</h3>
                <div className="admin-grid">
                  <TextField
                    label="Download CV Button"
                    value={data.heroButtons.downloadCv}
                    onChange={(downloadCv) =>
                      update((p) => ({ ...p, heroButtons: { ...p.heroButtons, downloadCv } }))
                    }
                  />
                  <TextField
                    label="View Work Button"
                    value={data.heroButtons.viewWork}
                    onChange={(viewWork) =>
                      update((p) => ({ ...p, heroButtons: { ...p.heroButtons, viewWork } }))
                    }
                  />
                </div>
              </div>
              <StatListEditor
                stats={data.heroStats}
                onChange={(heroStats) => update((p) => ({ ...p, heroStats }))}
              />
            </>
          )}

          {tab === "skills" && (
            <div>
              <div className="admin-panel">
                <p className="admin-panel-hint">
                  Add up to 6 skill categories. Layout: 1–3 stack in one column; 4 uses 2 full
                  rows (2×2); 5–6 use 3 rows with 2 columns each.
                </p>
                <p className="admin-panel-hint">
                  {data.skills.length}/6 categories added
                </p>
              </div>
              {data.skills.map((category, catIndex) => (
                <div key={catIndex} className="admin-panel">
                  <div className="admin-list-item-header">
                    <h3>Skill Category {catIndex + 1}</h3>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger"
                      onClick={() =>
                        update((p) => ({
                          ...p,
                          skills: p.skills.filter((_, i) => i !== catIndex),
                        }))
                      }
                    >
                      Remove Category
                    </button>
                  </div>
                  <div className="admin-grid">
                    <TextField
                      label="Category Title"
                      value={category.title}
                      onChange={(title) => {
                        const next = [...data.skills];
                        next[catIndex] = { ...category, title };
                        update((p) => ({ ...p, skills: next }));
                      }}
                    />
                    <TagInput
                      label="Skills"
                      tags={category.skills}
                      onChange={(skills) => {
                        const next = [...data.skills];
                        next[catIndex] = { ...category, skills };
                        update((p) => ({ ...p, skills: next }));
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="admin-btn"
                disabled={data.skills.length >= 6}
                onClick={() =>
                  update((p) => ({
                    ...p,
                    skills: [...p.skills, { title: "New Category", skills: [] }],
                  }))
                }
              >
                + Add Skill Category
              </button>
            </div>
          )}

          {tab === "about" && (
            <>
              <div className="admin-panel">
                <div className="admin-grid">
                  <TextField
                    label="Section Heading"
                    value={data.about.heading}
                    onChange={(heading) =>
                      update((p) => ({ ...p, about: { ...p.about, heading } }))
                    }
                  />
                  <TextField
                    label="Achievements Subheading"
                    value={data.about.subheading}
                    onChange={(subheading) =>
                      update((p) => ({ ...p, about: { ...p.about, subheading } }))
                    }
                  />
                </div>
              </div>
              <StringListEditor
                label="About Paragraphs"
                items={data.about.paragraphs}
                onChange={(paragraphs) => update((p) => ({ ...p, about: { ...p.about, paragraphs } }))}
                itemLabel="Paragraph"
              />
              <StringListEditor
                label="Achievements"
                items={data.about.achievements}
                onChange={(achievements) =>
                  update((p) => ({ ...p, about: { ...p.about, achievements } }))
                }
                itemLabel="Achievement"
              />
            </>
          )}

          {tab === "projects" && (
            <>
              <div className="admin-panel">
                <h3>Homepage Projects Section</h3>
                <div className="admin-grid">
                  <TextField
                    label="Section Heading"
                    value={data.projectsSection.heading}
                    onChange={(heading) =>
                      update((p) => ({
                        ...p,
                        projectsSection: { ...p.projectsSection, heading },
                      }))
                    }
                  />
                  <TextField
                    label="View All Label"
                    value={data.projectsSection.viewAllLabel}
                    onChange={(viewAllLabel) =>
                      update((p) => ({
                        ...p,
                        projectsSection: { ...p.projectsSection, viewAllLabel },
                      }))
                    }
                  />
                  <TextField
                    label="Featured Count (homepage)"
                    type="number"
                    value={String(data.projectsSection.featuredCount)}
                    onChange={(v) =>
                      update((p) => ({
                        ...p,
                        projectsSection: {
                          ...p.projectsSection,
                          featuredCount: Math.max(0, parseInt(v, 10) || 0),
                        },
                      }))
                    }
                  />
                  <TextAreaField
                    label="Section Subtext"
                    value={data.projectsSection.subtext}
                    onChange={(subtext) =>
                      update((p) => ({
                        ...p,
                        projectsSection: { ...p.projectsSection, subtext },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="admin-panel">
                <h3>All Projects Page</h3>
                <div className="admin-grid">
                  <TextField
                    label="Page Title"
                    value={data.projectsPage.title}
                    onChange={(title) =>
                      update((p) => ({ ...p, projectsPage: { ...p.projectsPage, title } }))
                    }
                  />
                  <TextField
                    label="Page Heading"
                    value={data.projectsPage.heading}
                    onChange={(heading) =>
                      update((p) => ({ ...p, projectsPage: { ...p.projectsPage, heading } }))
                    }
                  />
                  <TextAreaField
                    label="Page Description"
                    value={data.projectsPage.description}
                    onChange={(description) =>
                      update((p) => ({ ...p, projectsPage: { ...p.projectsPage, description } }))
                    }
                  />
                </div>
              </div>
              <div className="admin-panel">
                <div className="admin-list-item-header">
                  <h3>All Projects ({data.projects.length})</h3>
                  <button type="button" className="admin-btn admin-btn-primary" onClick={addProject}>
                    + Add Project
                  </button>
                </div>
                {data.projects.length === 0 ? (
                  <p className="admin-empty">No projects yet. Add your first project above.</p>
                ) : (
                  data.projects.map((project, index) => (
                    <ProjectEditor
                      key={`${project.id}-${index}`}
                      project={project}
                      index={index}
                      onChange={(updated) => {
                        const next = [...data.projects];
                        if (updated.title !== project.title && updated.id.startsWith("new-project-")) {
                          updated.id = createProjectId(updated.title);
                        }
                        next[index] = updated;
                        update((p) => ({ ...p, projects: next }));
                      }}
                      onRemove={() =>
                        update((p) => ({
                          ...p,
                          projects: p.projects.filter((_, i) => i !== index),
                        }))
                      }
                      onMoveUp={() => moveProject(index, -1)}
                      onMoveDown={() => moveProject(index, 1)}
                      canMoveUp={index > 0}
                      canMoveDown={index < data.projects.length - 1}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {tab === "contact" && (
            <div className="admin-panel">
              <div className="admin-grid">
                <TextField
                  label="Section Heading"
                  value={data.contact.heading}
                  onChange={(heading) => update((p) => ({ ...p, contact: { ...p.contact, heading } }))}
                />
                <TextField
                  label="Form Card Title"
                  value={data.contact.formTitle}
                  onChange={(formTitle) =>
                    update((p) => ({ ...p, contact: { ...p.contact, formTitle } }))
                  }
                />
                <TextField
                  label="Info Card Title"
                  value={data.contact.infoTitle}
                  onChange={(infoTitle) =>
                    update((p) => ({ ...p, contact: { ...p.contact, infoTitle } }))
                  }
                />
                <TextField
                  label="Social Section Title"
                  value={data.contact.socialTitle}
                  onChange={(socialTitle) =>
                    update((p) => ({ ...p, contact: { ...p.contact, socialTitle } }))
                  }
                />
                <TextField
                  label="Submit Button Label"
                  value={data.contact.submitLabel}
                  onChange={(submitLabel) =>
                    update((p) => ({ ...p, contact: { ...p.contact, submitLabel } }))
                  }
                />
                <TextField
                  label="Name Placeholder"
                  value={data.contact.namePlaceholder}
                  onChange={(namePlaceholder) =>
                    update((p) => ({ ...p, contact: { ...p.contact, namePlaceholder } }))
                  }
                />
                <TextField
                  label="Email Placeholder"
                  value={data.contact.emailPlaceholder}
                  onChange={(emailPlaceholder) =>
                    update((p) => ({ ...p, contact: { ...p.contact, emailPlaceholder } }))
                  }
                />
                <TextField
                  label="Message Placeholder"
                  value={data.contact.messagePlaceholder}
                  onChange={(messagePlaceholder) =>
                    update((p) => ({ ...p, contact: { ...p.contact, messagePlaceholder } }))
                  }
                />
                <TextAreaField
                  label="Section Subtext"
                  value={data.contact.subtext}
                  onChange={(subtext) => update((p) => ({ ...p, contact: { ...p.contact, subtext } }))}
                />
                <TextAreaField
                  label="Info Card Text"
                  value={data.contact.infoText}
                  onChange={(infoText) => update((p) => ({ ...p, contact: { ...p.contact, infoText } }))}
                />
              </div>
            </div>
          )}

          {tab === "navigation" && (
            <div className="admin-panel">
              <h3>Navigation Items</h3>
              {data.navigation.map((item, index) => (
                <div key={item.id} className="admin-list-item">
                  <div className="admin-grid">
                    <TextField
                      label={`Label (${item.id})`}
                      value={item.label}
                      onChange={(label) => {
                        const next = [...data.navigation];
                        next[index] = { ...item, label };
                        update((p) => ({ ...p, navigation: next }));
                      }}
                    />
                    <ToggleField
                      label="Visible in navigation"
                      checked={item.enabled}
                      onChange={(enabled) => {
                        const next = [...data.navigation];
                        next[index] = { ...item, enabled };
                        update((p) => ({ ...p, navigation: next }));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "sections" && (
            <div className="admin-panel">
              <h3>Show / Hide Sections</h3>
              <ToggleField
                label="Hero Section"
                checked={data.sections.hero}
                onChange={(hero) => update((p) => ({ ...p, sections: { ...p.sections, hero } }))}
              />
              <ToggleField
                label="Skills Cards"
                checked={data.sections.skills}
                onChange={(skills) => update((p) => ({ ...p, sections: { ...p.sections, skills } }))}
              />
              <ToggleField
                label="About Card"
                checked={data.sections.aboutCard}
                onChange={(aboutCard) =>
                  update((p) => ({ ...p, sections: { ...p.sections, aboutCard } }))
                }
              />
              <ToggleField
                label="Projects Section"
                checked={data.sections.projects}
                onChange={(projects) =>
                  update((p) => ({ ...p, sections: { ...p.sections, projects } }))
                }
              />
              <ToggleField
                label="Contact Section"
                checked={data.sections.contact}
                onChange={(contact) =>
                  update((p) => ({ ...p, sections: { ...p.sections, contact } }))
                }
              />
            </div>
          )}

          {tab === "seo" && (
            <div className="admin-panel">
              <div className="admin-grid">
                <TextField
                  label="Homepage Title"
                  value={data.seo.title}
                  onChange={(title) => update((p) => ({ ...p, seo: { ...p.seo, title } }))}
                />
                <TextField
                  label="Projects Page Title"
                  value={data.seo.projectsTitle}
                  onChange={(projectsTitle) =>
                    update((p) => ({ ...p, seo: { ...p.seo, projectsTitle } }))
                  }
                />
                <TextAreaField
                  label="Homepage Meta Description"
                  value={data.seo.description}
                  onChange={(description) =>
                    update((p) => ({ ...p, seo: { ...p.seo, description } }))
                  }
                />
                <TextAreaField
                  label="Projects Page Meta Description"
                  value={data.seo.projectsDescription}
                  onChange={(projectsDescription) =>
                    update((p) => ({ ...p, seo: { ...p.seo, projectsDescription } }))
                  }
                />
              </div>
            </div>
          )}
        </main>
      </div>
  );
}
