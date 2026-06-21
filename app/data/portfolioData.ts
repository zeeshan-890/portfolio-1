export type {
  SkillCategory,
  PortfolioProject,
  PortfolioData,
  PortfolioResume,
  NavItem,
  SectionVisibility,
} from "./portfolioTypes";

export { defaultPortfolioData } from "./defaultPortfolio";

// Legacy re-exports — prefer getPortfolioData() from @/app/lib/portfolioStore
import { defaultPortfolioData } from "./defaultPortfolio";

export const profile = defaultPortfolioData.profile;
export const heroStats = defaultPortfolioData.heroStats;
export const skills = defaultPortfolioData.skills;
export const aboutParagraphs = defaultPortfolioData.about.paragraphs;
export const achievements = defaultPortfolioData.about.achievements;
export const projects = defaultPortfolioData.projects;
export const featuredProjects = defaultPortfolioData.projects.filter(
  (project) => project.showOnHomepage
);
