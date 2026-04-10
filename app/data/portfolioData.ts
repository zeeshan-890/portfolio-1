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

export const profile = {
  name: "Muhammad Zeeshan Abbas",
  firstName: "Muhammad",
  role: "Full Stack Developer",
  tagline:
    "I craft modern web applications with React, Next.js, and the MERN stack. Focused on building performant, scalable solutions that deliver real business value.",
  location: "Islamabad, Pakistan",
  email: "zzabbaskhan830@email.com",
  linkedin: "https://www.linkedin.com/in/muhammad-zeeshan-abbas-82076a36b/",
  github: "https://github.com/zeeshan-890",
  resumePath: "/resume.pdf",
  imagePath: "/profilepic.png",
};

export const heroStats = [
  { value: "7+", label: "Projects Completed" },
  { value: "5+", label: "Technologies Mastered" },
];

export const skills: SkillCategory[] = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express.js", "MongoDB", "MySQL", "Spring Boot"],
  },
  {
    title: "Tools & DevOps",
    skills: ["Git", "GitHub", "Docker", "Postman", "VS Code", "npm"],
  },
];

export const aboutParagraphs = [
  "As a dedicated MERN Full Stack Developer, I specialize in creating dynamic, responsive web applications using MongoDB, Express.js, React, and Node.js. My expertise extends to modern frameworks like Next.js and styling with Tailwind CSS.",
  "Currently pursuing my Bachelor's degree in Artificial Intelligence at NUST, I'm actively seeking opportunities to apply my skills in a professional environment. I'm passionate about clean code, user experience, and scalable solutions.",
];

export const achievements = [
  "7+ projects completed",
  "5+ core technologies mastered",
  "100% commitment level",
  "24/7 learning mode",
];

export const projects: PortfolioProject[] = [
  {
    id: "viralix-ai-platform",
    title: "VIRALIX - AI Social Media Management Platform",
    shortDescription:
      "A full-stack AI-powered platform to manage, schedule, and analyze social media with smart captions, multi-platform publishing, and analytics.",
    technologies: [
      "Next.js 15",
      "React 19",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Google Gemini AI",
      "Meta Graph API",
    ],
    category: "Full Stack",
    liveUrl: "https://client-autoreach-ai.vercel.app/",
    githubUrls: {
      frontend: "https://github.com/zeeshan-890/client-autoreach-ai",
      backend: "https://github.com/zeeshan-890/server-autoreach-ai",
    },
  },
  {
    id: "ecommerce-website",
    title: "Handphone E-Commerce Platform",
    shortDescription:
      "Production-ready full-stack e-commerce solution with Next.js storefront, Node.js/Express backend, Stripe payments, and admin dashboard.",
    technologies: [
      "Next.js 14",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Stripe API",
      "Cloudinary",
      "JWT",
    ],
    category: "Full Stack",
    liveUrl: "https://ecommerce-client-roan-one.vercel.app/",
    githubUrls: {
      frontend: "https://github.com/zeeshan-890/ecommerce-client",
      backend: "https://github.com/zeeshan-890/ecommerce-server",
    },
  },
  {
    id: "chat-videocall-app",
    title: "FullStack Realtime Chat & Video Call App",
    shortDescription:
      "MERN + Socket.IO + WebRTC app with real-time messaging, peer-to-peer video calls, JWT auth, and online presence.",
    technologies: [
      "React 18",
      "Socket.IO",
      "PeerJS",
      "WebRTC",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Docker",
    ],
    category: "Full Stack",
    liveUrl: "https://chat-videocall.app.viralix.dev",
    githubUrl: "https://github.com/zeeshan-890/Chat-App",
  },
  {
    id: "portfolio-builder",
    title: "PortfolioBuilder - AI-Powered Portfolio Creator",
    shortDescription:
      "Modern full-stack portfolio builder with AI resume parsing, drag and drop sections, multiple themes, and shareable links.",
    technologies: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Google Gemini AI",
      "Docker",
    ],
    category: "Full Stack",
    liveUrl: "https://portfolio-builder.app.viralix.dev/",
    githubUrl: "https://github.com/zeeshan-890/latest-portfolio-builder",
  },
  {
    id: "remote-vitals-monitoring",
    title: "Remote Vitals Monitoring System",
    shortDescription:
      "Healthcare monitoring platform for patients, doctors, and admins with vitals tracking, appointment flow, and role-based access.",
    technologies: [
      "Java",
      "Spring Boot",
      "Jakarta EE",
      "Spring Data JPA",
      "JavaFX",
      "MySQL",
      "Maven",
    ],
    category: "Full Stack",
    liveUrl:
      "https://drive.google.com/file/d/1_LwV-QvoZtN-33BFwwXDd1KQW6JqiFhM/view?usp=sharing",
    githubUrl: "https://github.com/zeeshan-890/RHMS",
  },
  {
    id: "nust-internship-system",
    title: "NUST Internship Management System",
    shortDescription:
      "Internship lifecycle platform for NUST students with application tracking, document management, and coordinator workflows.",
    technologies: ["JavaScript", "HTML", "CSS3", "Java", "Spring Boot"],
    category: "Full Stack",
    githubUrl: "https://github.com/zeeshan-890/Nust-Internship-Mangement-System",
  },
  {
    id: "weather-application",
    title: "Weather Application",
    shortDescription:
      "Weather app with real-time conditions, forecasts, and location search powered by OpenWeatherMap API.",
    technologies: ["HTML", "CSS", "JavaScript", "OpenWeatherMap API"],
    category: "Frontend",
    liveUrl: "https://weather-app-five-sooty-22.vercel.app/",
    githubUrl: "https://github.com/zeeshan-890/weather--app",
  },
  {
    id: "currency-converter",
    title: "Currency Converter",
    shortDescription:
      "Currency conversion app with live exchange rates, historical comparisons, and support for major world currencies.",
    technologies: ["HTML", "CSS", "JavaScript", "Currency Exchange API"],
    category: "Frontend",
    liveUrl: "https://currency-converter-tawny-phi.vercel.app/",
    githubUrl: "https://github.com/zeeshan-890/currency-Converter",
  },
  {
    id: "financer-app",
    title: "Financer - Personal & Group Finance Platform",
    shortDescription:
      "Full-stack finance platform with expense tracking, bill splitting, savings goals, reminders, and analytics dashboard.",
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Recharts",
    ],
    category: "Full Stack",
    liveUrl: "https://financer.app.viralix.dev/",
    githubUrl: "https://github.com/zeeshan-890/financer",
  },
];

export const featuredProjects = projects.slice(0, 6);
