import { promises as fs } from "fs";
import path from "path";
import { defaultPortfolioData } from "../data/defaultPortfolio";
import type { PortfolioData } from "../data/portfolioTypes";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "portfolio.json");

function mergeWithDefaults(partial: Partial<PortfolioData>): PortfolioData {
  return {
    ...defaultPortfolioData,
    ...partial,
    profile: { ...defaultPortfolioData.profile, ...partial.profile },
    heroButtons: { ...defaultPortfolioData.heroButtons, ...partial.heroButtons },
    about: { ...defaultPortfolioData.about, ...partial.about },
    projectsSection: {
      ...defaultPortfolioData.projectsSection,
      ...partial.projectsSection,
    },
    projectsPage: { ...defaultPortfolioData.projectsPage, ...partial.projectsPage },
    contact: { ...defaultPortfolioData.contact, ...partial.contact },
    sections: { ...defaultPortfolioData.sections, ...partial.sections },
    seo: { ...defaultPortfolioData.seo, ...partial.seo },
    heroStats: partial.heroStats ?? defaultPortfolioData.heroStats,
    skills: partial.skills ?? defaultPortfolioData.skills,
    projects: partial.projects ?? defaultPortfolioData.projects,
    navigation: partial.navigation ?? defaultPortfolioData.navigation,
  };
}

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<PortfolioData>;
    return mergeWithDefaults(parsed);
  } catch {
    return defaultPortfolioData;
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function getFeaturedProjects(data: PortfolioData) {
  const count = Math.max(0, data.projectsSection.featuredCount);
  return data.projects.slice(0, count);
}
