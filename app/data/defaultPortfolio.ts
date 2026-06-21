import type { PortfolioData } from "./portfolioTypes";

export const defaultPortfolioData: PortfolioData = {
  profile: {
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
    availabilityText: "Available for new projects",
  },
  heroStats: [
    { value: "7+", label: "Projects Completed" },
    { value: "5+", label: "Technologies Mastered" },
  ],
  heroButtons: {
    downloadCv: "Download CV",
    viewWork: "View My Work",
  },
  skills: [
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
  ],
  about: {
    heading: "About Me",
    subheading: "Key Highlights",
    paragraphs: [
      "As a dedicated MERN Full Stack Developer, I specialize in creating dynamic, responsive web applications using MongoDB, Express.js, React, and Node.js. My expertise extends to modern frameworks like Next.js and styling with Tailwind CSS.",
      "Currently pursuing my Bachelor's degree in Artificial Intelligence at NUST, I'm actively seeking opportunities to apply my skills in a professional environment. I'm passionate about clean code, user experience, and scalable solutions.",
    ],
    achievements: [
      "7+ projects completed",
      "5+ core technologies mastered",
      "100% commitment level",
      "24/7 learning mode",
    ],
  },
  projectsSection: {
    heading: "Latest Projects",
    subtext:
      "Showcasing recently added projects with modern full-stack engineering, production workflows, and practical problem solving.",
    viewAllLabel: "View All Projects",
    featuredCount: 6,
  },
  projectsPage: {
    title: "All Projects",
    heading: "Complete Portfolio",
    description:
      "Explore the complete collection of {name}'s projects across full-stack systems, AI-first products, and frontend applications.",
  },
  projects: [
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
      liveUrl: "www.viralix.dev/",
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
      liveUrl: "https://handphone.app.zeeshan-abbas.tech/",
      githubUrl: "https://github.com/zeeshan-890/handphone",
    },
    {
      id: "chat-videocall-app",
      title: "Converza - FullStack Realtime Chat & Video Call App",
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
      liveUrl: "https://converza.app.zeeshan-abbas.tech",
      githubUrl: "https://github.com/zeeshan-890/Chat-App",
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
      liveUrl: "https://financer.app.zeeshan-abbas.tech/",
      githubUrl: "https://github.com/zeeshan-890/financer",
    },
  ],
  contact: {
    heading: "Let's Work Together",
    subtext:
      "I'm actively seeking opportunities to contribute to innovative products. Let's discuss how I can bring value to your team.",
    formTitle: "Send a Message",
    infoTitle: "Get in Touch",
    infoText:
      "Feel free to reach out through any channel. I'm always open to discussing projects, collaboration, and product ideas.",
    socialTitle: "Connect with me",
    namePlaceholder: "Your name",
    emailPlaceholder: "your.email@example.com",
    messagePlaceholder: "Tell me about your project...",
    submitLabel: "Send Message",
  },
  navigation: [
    { id: "about", label: "About Me", enabled: true },
    { id: "projects", label: "Projects", enabled: true },
    { id: "contact", label: "Contact", enabled: true },
  ],
  sections: {
    hero: true,
    skills: true,
    aboutCard: true,
    projects: true,
    contact: true,
  },
  seo: {
    title: "Muhammad Zeeshan Abbas — Full Stack Developer",
    description:
      "Portfolio of Muhammad Zeeshan Abbas, Full Stack Developer specializing in React, Next.js, TypeScript, and MERN stack applications.",
    projectsTitle: "All Projects — Muhammad Zeeshan Abbas",
    projectsDescription:
      "Complete projects portfolio of Muhammad Zeeshan Abbas across full-stack and frontend development.",
  },
};
