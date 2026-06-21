import type { CSSProperties } from "react";
import type { Metadata } from "next";
import type { PortfolioProject } from "../data/portfolioTypes";
import { getPortfolioData } from "../lib/portfolioStore";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  return {
    title: data.seo.projectsTitle,
    description: data.seo.projectsDescription,
  };
}

const pointerPositions = [
  { x: "86.35%", y: "14.11%" },
  { x: "39.04%", y: "13.58%" },
  { x: "95.73%", y: "35.15%" },
  { x: "98.98%", y: "31.86%" },
  { x: "96.67%", y: "45.88%" },
  { x: "7.13%", y: "49.33%" },
  { x: "96.41%", y: "24.74%" },
  { x: "12.60%", y: "55.23%" },
  { x: "3.98%", y: "80.81%" },
] as const;

function categoryIcon(category: PortfolioProject["category"]) {
  if (category === "Backend") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="20" height="8" x="2" y="2" rx="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" />
        <line x1="6" x2="6.01" y1="6" y2="6" />
        <line x1="6" x2="6.01" y1="18" y2="18" />
      </svg>
    );
  }

  if (category === "Mobile") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function primaryAction(project: PortfolioProject) {
  if (project.liveUrl) {
    return { label: "Live Demo", url: project.liveUrl, external: true };
  }

  if (project.githubUrl) {
    return { label: "View Code", url: project.githubUrl, external: true };
  }

  if (project.githubUrls?.frontend) {
    return { label: "Frontend Code", url: project.githubUrls.frontend, external: true };
  }

  return { label: "View Details", url: `#${project.id}`, external: false };
}

function secondaryActions(project: PortfolioProject) {
  const actions: Array<{ label: string; url: string }> = [];

  if (project.githubUrls?.frontend) {
    actions.push({ label: "Frontend", url: project.githubUrls.frontend });
  }

  if (project.githubUrls?.backend) {
    actions.push({ label: "Backend", url: project.githubUrls.backend });
  }

  if (project.githubUrls?.fullProject) {
    actions.push({ label: "Code", url: project.githubUrls.fullProject });
  }

  if (project.githubUrl) {
    actions.push({ label: "Code", url: project.githubUrl });
  }

  return actions.slice(0, 2);
}

export default async function ProjectsPage() {
  const data = await getPortfolioData();
  const { profile, projects, projectsPage } = data;

  return (
    <div className="projects-page">
      <div className="page-wrap">
        <header className="header">
          <div className="container header-inner">
            <a className="back-btn glass-card" href="/" aria-label="Back to portfolio">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </a>
            <h1 className="header-title">{projectsPage.title}</h1>
          </div>
        </header>

        <main className="main">
          <div className="container">
            <div className="hero-title">
              <h2>{projectsPage.heading}</h2>
              <p>
                {projectsPage.description.replace("{name}", profile.name)}
              </p>
            </div>

            <div className="projects-grid">
              {projects.map((project, index) => {
                const pointer = pointerPositions[index % pointerPositions.length];
                const style = {
                  "--pointer-x": pointer.x,
                  "--pointer-y": pointer.y,
                } as CSSProperties;
                const primary = primaryAction(project);
                const secondary = secondaryActions(project);

                return (
                  <article
                    key={project.id}
                    id={project.id}
                    className="project-card glass-card hover-lift hover-shine"
                    style={style}
                  >
                    <div className="project-glow" />
                    <div className="project-inner">
                      <div className="project-head">
                        <div className="project-icon glass-card">{categoryIcon(project.category)}</div>
                        <span className="project-badge">{project.category}</span>
                        <h3 className="project-name">{project.title}</h3>
                      </div>
                      <div className="project-body">
                        <p className="project-desc">{project.shortDescription}</p>
                        <div className="project-tags">
                          {project.technologies.slice(0, 8).map((tech) => (
                            <span key={tech} className="project-tag">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="project-actions">
                          <a
                            className="action-btn primary"
                            href={primary.url}
                            target={primary.external ? "_blank" : undefined}
                            rel={primary.external ? "noopener noreferrer" : undefined}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M15 3h6v6" />
                              <path d="M10 14 21 3" />
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            </svg>
                            {primary.label}
                          </a>

                          {secondary.map((action) => (
                            <a
                              key={`${project.id}-${action.label}`}
                              className="action-btn ghost"
                              href={action.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M15 3h6v6" />
                                <path d="M10 14 21 3" />
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              </svg>
                              {action.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
