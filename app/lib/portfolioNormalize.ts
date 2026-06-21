import { defaultPortfolioData } from "../data/defaultPortfolio";
import type { PortfolioData, PortfolioProject, SkillCategory, NavItem, PortfolioResume } from "../data/portfolioTypes";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeProject(value: unknown, index: number): PortfolioProject {
  const source = isRecord(value) ? value : {};
  const category = source.category;
  const validCategory =
    category === "Full Stack" ||
    category === "Frontend" ||
    category === "Backend" ||
    category === "Mobile"
      ? category
      : "Full Stack";

  const githubUrlsSource = isRecord(source.githubUrls) ? source.githubUrls : undefined;

  return {
    id: asString(source.id, `project-${index + 1}`),
    title: asString(source.title, "Untitled Project"),
    shortDescription: asString(source.shortDescription, ""),
    technologies: asStringArray(source.technologies, []),
    category: validCategory,
    liveUrl: typeof source.liveUrl === "string" ? source.liveUrl : undefined,
    githubUrl: typeof source.githubUrl === "string" ? source.githubUrl : undefined,
    githubUrls: githubUrlsSource
      ? {
          frontend:
            typeof githubUrlsSource.frontend === "string"
              ? githubUrlsSource.frontend
              : undefined,
          backend:
            typeof githubUrlsSource.backend === "string"
              ? githubUrlsSource.backend
              : undefined,
          fullProject:
            typeof githubUrlsSource.fullProject === "string"
              ? githubUrlsSource.fullProject
              : undefined,
        }
      : undefined,
  };
}

function normalizeSkills(value: unknown): SkillCategory[] {
  if (!Array.isArray(value)) {
    return defaultPortfolioData.skills;
  }

  return value.map((item, index) => {
    const source = isRecord(item) ? item : {};
    return {
      title: asString(source.title, `Category ${index + 1}`),
      skills: asStringArray(source.skills, []),
    };
  });
}

export function normalizePortfolioData(input: unknown): PortfolioData {
  const partial = isRecord(input) ? input : {};
  const profileSource = isRecord(partial.profile) ? partial.profile : {};
  const aboutSource = isRecord(partial.about) ? partial.about : {};
  const projectsSectionSource = isRecord(partial.projectsSection) ? partial.projectsSection : {};
  const projectsPageSource = isRecord(partial.projectsPage) ? partial.projectsPage : {};
  const contactSource = isRecord(partial.contact) ? partial.contact : {};
  const sectionsSource = isRecord(partial.sections) ? partial.sections : {};
  const seoSource = isRecord(partial.seo) ? partial.seo : {};
  const heroButtonsSource = isRecord(partial.heroButtons) ? partial.heroButtons : {};

  const projects = Array.isArray(partial.projects)
    ? partial.projects.map(normalizeProject)
    : defaultPortfolioData.projects;

  const heroStats = Array.isArray(partial.heroStats)
    ? partial.heroStats.map((item, index) => {
        const source = isRecord(item) ? item : {};
        return {
          value: asString(source.value, defaultPortfolioData.heroStats[index]?.value ?? ""),
          label: asString(source.label, defaultPortfolioData.heroStats[index]?.label ?? ""),
        };
      })
    : defaultPortfolioData.heroStats;

  const navigation: NavItem[] = Array.isArray(partial.navigation)
    ? partial.navigation.map((item) => {
        const source = isRecord(item) ? item : {};
        const id = source.id;
        const navId: NavItem["id"] =
          id === "about" || id === "projects" || id === "contact" ? id : "about";
        return {
          id: navId,
          label: asString(source.label, navId),
          enabled: typeof source.enabled === "boolean" ? source.enabled : true,
        };
      })
    : defaultPortfolioData.navigation;

  const resumes: PortfolioResume[] = Array.isArray(partial.resumes)
    ? partial.resumes
        .map((item, index) => {
          const source = isRecord(item) ? item : {};
          return {
            id: asString(source.id, `resume-${index + 1}`),
            title: asString(source.title, `Resume ${index + 1}`),
          };
        })
        .filter((item) => item.id && item.title)
    : defaultPortfolioData.resumes;

  const legacyResumePath =
    isRecord(profileSource) && typeof profileSource.resumePath === "string"
      ? profileSource.resumePath
      : "";

  const normalizedResumes =
    resumes.length === 0 && legacyResumePath === "/api/resume"
      ? [{ id: "legacy", title: "Resume" }]
      : resumes;

  return {
    profile: {
      name: asString(profileSource.name, defaultPortfolioData.profile.name),
      firstName: asString(profileSource.firstName, defaultPortfolioData.profile.firstName),
      role: asString(profileSource.role, defaultPortfolioData.profile.role),
      tagline: asString(profileSource.tagline, defaultPortfolioData.profile.tagline),
      location: asString(profileSource.location, defaultPortfolioData.profile.location),
      email: asString(profileSource.email, defaultPortfolioData.profile.email),
      linkedin: asString(profileSource.linkedin, defaultPortfolioData.profile.linkedin),
      github: asString(profileSource.github, defaultPortfolioData.profile.github),
      imagePath: asString(profileSource.imagePath, defaultPortfolioData.profile.imagePath),
      availabilityText: asString(
        profileSource.availabilityText,
        defaultPortfolioData.profile.availabilityText
      ),
    },
    heroStats,
    heroButtons: {
      downloadCv: asString(
        heroButtonsSource.downloadCv,
        defaultPortfolioData.heroButtons.downloadCv
      ),
      viewWork: asString(heroButtonsSource.viewWork, defaultPortfolioData.heroButtons.viewWork),
    },
    skills: normalizeSkills(partial.skills).slice(0, 6),
    about: {
      heading: asString(aboutSource.heading, defaultPortfolioData.about.heading),
      subheading: asString(aboutSource.subheading, defaultPortfolioData.about.subheading),
      paragraphs: asStringArray(aboutSource.paragraphs, defaultPortfolioData.about.paragraphs),
      achievements: asStringArray(aboutSource.achievements, defaultPortfolioData.about.achievements),
    },
    projectsSection: {
      heading: asString(
        projectsSectionSource.heading,
        defaultPortfolioData.projectsSection.heading
      ),
      subtext: asString(
        projectsSectionSource.subtext,
        defaultPortfolioData.projectsSection.subtext
      ),
      viewAllLabel: asString(
        projectsSectionSource.viewAllLabel,
        defaultPortfolioData.projectsSection.viewAllLabel
      ),
      featuredCount:
        typeof projectsSectionSource.featuredCount === "number"
          ? Math.max(0, projectsSectionSource.featuredCount)
          : defaultPortfolioData.projectsSection.featuredCount,
    },
    projectsPage: {
      title: asString(projectsPageSource.title, defaultPortfolioData.projectsPage.title),
      heading: asString(projectsPageSource.heading, defaultPortfolioData.projectsPage.heading),
      description: asString(
        projectsPageSource.description,
        defaultPortfolioData.projectsPage.description
      ),
    },
    projects,
    resumes: normalizedResumes,
    contact: {
      heading: asString(contactSource.heading, defaultPortfolioData.contact.heading),
      subtext: asString(contactSource.subtext, defaultPortfolioData.contact.subtext),
      formTitle: asString(contactSource.formTitle, defaultPortfolioData.contact.formTitle),
      infoTitle: asString(contactSource.infoTitle, defaultPortfolioData.contact.infoTitle),
      infoText: asString(contactSource.infoText, defaultPortfolioData.contact.infoText),
      socialTitle: asString(contactSource.socialTitle, defaultPortfolioData.contact.socialTitle),
      namePlaceholder: asString(
        contactSource.namePlaceholder,
        defaultPortfolioData.contact.namePlaceholder
      ),
      emailPlaceholder: asString(
        contactSource.emailPlaceholder,
        defaultPortfolioData.contact.emailPlaceholder
      ),
      messagePlaceholder: asString(
        contactSource.messagePlaceholder,
        defaultPortfolioData.contact.messagePlaceholder
      ),
      submitLabel: asString(contactSource.submitLabel, defaultPortfolioData.contact.submitLabel),
    },
    navigation,
    sections: {
      hero:
        typeof sectionsSource.hero === "boolean"
          ? sectionsSource.hero
          : defaultPortfolioData.sections.hero,
      skills:
        typeof sectionsSource.skills === "boolean"
          ? sectionsSource.skills
          : defaultPortfolioData.sections.skills,
      aboutCard:
        typeof sectionsSource.aboutCard === "boolean"
          ? sectionsSource.aboutCard
          : defaultPortfolioData.sections.aboutCard,
      projects:
        typeof sectionsSource.projects === "boolean"
          ? sectionsSource.projects
          : defaultPortfolioData.sections.projects,
      contact:
        typeof sectionsSource.contact === "boolean"
          ? sectionsSource.contact
          : defaultPortfolioData.sections.contact,
    },
    seo: {
      title: asString(seoSource.title, defaultPortfolioData.seo.title),
      description: asString(seoSource.description, defaultPortfolioData.seo.description),
      projectsTitle: asString(seoSource.projectsTitle, defaultPortfolioData.seo.projectsTitle),
      projectsDescription: asString(
        seoSource.projectsDescription,
        defaultPortfolioData.seo.projectsDescription
      ),
    },
  };
}
