import type { Metadata } from "next";
import ProjectsFilterGrid from "../components/ProjectsFilterGrid";
import PortfolioAnalytics from "../components/PortfolioAnalytics";
import { getPortfolioData } from "../lib/portfolioStore";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  return {
    title: data.seo.projectsTitle,
    description: data.seo.projectsDescription,
  };
}

export default async function ProjectsPage() {
  const data = await getPortfolioData();
  const { profile, projects, projectsPage, projectCategories } = data;

  return (
    <>
      <PortfolioAnalytics page="/projects" />
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
              <p>{projectsPage.description.replace("{name}", profile.name)}</p>
            </div>

            <ProjectsFilterGrid
              projects={projects}
              categories={projectCategories}
              allLabel={projectsPage.allLabel}
            />
          </div>
        </main>
      </div>
    </div>
    </>
  );
}
