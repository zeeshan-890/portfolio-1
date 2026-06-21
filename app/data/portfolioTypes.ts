export type SkillCategory = {
  title: string;
  skills: string[];
};

export type PortfolioProject = {
  id: string;
  title: string;
  shortDescription: string;
  technologies: string[];
  category: "Full Stack" | "Frontend" | "Backend" | "Mobile";
  liveUrl?: string;
  githubUrl?: string;
  githubUrls?: {
    frontend?: string;
    backend?: string;
    fullProject?: string;
  };
};

export type NavItem = {
  id: "about" | "projects" | "contact";
  label: string;
  enabled: boolean;
};

export type SectionVisibility = {
  hero: boolean;
  skills: boolean;
  aboutCard: boolean;
  projects: boolean;
  contact: boolean;
};

export type PortfolioResume = {
  id: string;
  title: string;
};

export type PortfolioData = {
  profile: {
    name: string;
    firstName: string;
    role: string;
    tagline: string;
    location: string;
    email: string;
    linkedin: string;
    github: string;
    imagePath: string;
    availabilityText: string;
  };
  heroStats: Array<{ value: string; label: string }>;
  heroButtons: {
    downloadCv: string;
    viewWork: string;
  };
  skills: SkillCategory[];
  about: {
    heading: string;
    subheading: string;
    paragraphs: string[];
    achievements: string[];
  };
  projectsSection: {
    heading: string;
    subtext: string;
    viewAllLabel: string;
    featuredCount: number;
  };
  projectsPage: {
    title: string;
    heading: string;
    description: string;
  };
  projects: PortfolioProject[];
  resumes: PortfolioResume[];
  contact: {
    heading: string;
    subtext: string;
    formTitle: string;
    infoTitle: string;
    infoText: string;
    socialTitle: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    submitLabel: string;
  };
  navigation: NavItem[];
  sections: SectionVisibility;
  seo: {
    title: string;
    description: string;
    projectsTitle: string;
    projectsDescription: string;
  };
};
