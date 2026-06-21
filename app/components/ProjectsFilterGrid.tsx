"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { PortfolioProject, ProjectCategory } from "../data/portfolioTypes";
import { getProjectCategoryLabel } from "../lib/projectUtils";

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

type ProjectsFilterGridProps = {
  projects: PortfolioProject[];
  categories: ProjectCategory[];
  allLabel: string;
};

function projectIcon() {
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

  return null;
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

export default function ProjectsFilterGrid({
  projects,
  categories,
  allLabel,
}: ProjectsFilterGridProps) {
  const [activeCategoryId, setActiveCategoryId] = useState("all");

  const filteredProjects = useMemo(() => {
    if (activeCategoryId === "all") {
      return projects;
    }

    return projects.filter((project) => project.categoryId === activeCategoryId);
  }, [activeCategoryId, projects]);

  return (
    <>
      <div className="projects-filter-bar" role="tablist" aria-label="Filter projects by category">
        <button
          type="button"
          role="tab"
          aria-selected={activeCategoryId === "all"}
          className={`projects-filter-btn${activeCategoryId === "all" ? " active" : ""}`}
          onClick={() => setActiveCategoryId("all")}
        >
          {allLabel}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={activeCategoryId === category.id}
            className={`projects-filter-btn${activeCategoryId === category.id ? " active" : ""}`}
            onClick={() => setActiveCategoryId(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <p className="projects-filter-empty">No projects in this category yet.</p>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project, index) => {
            const pointer = pointerPositions[index % pointerPositions.length];
            const style = {
              "--pointer-x": pointer.x,
              "--pointer-y": pointer.y,
            } as CSSProperties;
            const primary = primaryAction(project);
            const secondary = secondaryActions(project);
            const categoryLabel = getProjectCategoryLabel(project, categories);

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
                    <div className="project-icon glass-card">{projectIcon()}</div>
                    <span className="project-badge">{categoryLabel}</span>
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
                      {primary && (
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
                      )}

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
      )}
    </>
  );
}
