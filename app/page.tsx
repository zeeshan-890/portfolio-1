import type { CSSProperties } from "react";
import PortfolioNavObserver from "./components/PortfolioNavObserver";
import {
  aboutParagraphs,
  achievements,
  featuredProjects,
  heroStats,
  profile,
  projects,
  skills,
  type PortfolioProject,
} from "./data/portfolioData";

const glowPositions = [
  { x: "86%", y: "10%" },
  { x: "80%", y: "6%" },
  { x: "6%", y: "6%" },
  { x: "20%", y: "8%" },
  { x: "84%", y: "22%" },
  { x: "95%", y: "16%" },
] as const;

function getProjectSecondaryLinks(project: PortfolioProject) {
  const links: Array<{ label: string; url: string }> = [];

  if (project.liveUrl) {
    links.push({ label: "Live Demo", url: project.liveUrl });
  }

  if (project.githubUrls?.frontend) {
    links.push({ label: "Frontend Code", url: project.githubUrls.frontend });
  }

  if (project.githubUrls?.backend) {
    links.push({ label: "Backend Code", url: project.githubUrls.backend });
  }

  if (project.githubUrls?.fullProject) {
    links.push({ label: "Code", url: project.githubUrls.fullProject });
  }

  if (!project.githubUrls && project.githubUrl) {
    links.push({ label: "Code", url: project.githubUrl });
  }

  return links;
}

function categoryIcon(category: PortfolioProject["category"]) {
  if (category === "Backend") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
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

export default function Home() {
  const nameParts = profile.name.split(" ");
  const firstLine = nameParts.slice(0, 1).join(" ");
  const secondLine = nameParts.slice(1).join(" ");

  return (
    <>
      <PortfolioNavObserver />
      <div className="portfolio-home">
        <div className="top-bar" />

        <nav className="side-nav">
          <a href="#about" className="active" data-nav-target="about">
            About Me
          </a>
          <a href="#projects" data-nav-target="projects">
            Projects
          </a>
          <a href="#contact" data-nav-target="contact">
            Contact
          </a>
          <a href="#">Default</a>
        </nav>

        <nav className="mobile-dock-nav" aria-label="Mobile navigation">
          <div className="glass-card mobile-dock-inner">
            <a href="#about" className="mobile-dock-item active" data-nav-target="about">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>About</span>
            </a>
            <a href="#projects" className="mobile-dock-item" data-nav-target="projects">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
              <span>Projects</span>
            </a>
            <a href="#contact" className="mobile-dock-item" data-nav-target="contact">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>Contact</span>
            </a>
            <div className="mobile-dock-divider" aria-hidden="true" />
            <a href="#" className="mobile-dock-item mobile-dock-default" aria-label="Default theme">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
              </svg>
              <span>Default</span>
            </a>
          </div>
        </nav>

        <main className="portfolio-main">
          <section id="about" itemScope itemType="https://schema.org/Person">
            <div className="hero-left glass-card hover-shine hover-lift animate-fade-in-left">
              <div>
                <h1 className="hero-name" itemProp="name">
                  {firstLine}
                  <br />
                  <span>{secondLine}</span>
                </h1>
                <p className="hero-tag" itemProp="jobTitle">
                  <span className="text-tech">&lt;</span>
                  <span>{profile.role}</span>
                  <span className="text-tech">/&gt;</span>
                </p>
                <p className="hero-desc" itemProp="description">
                  {profile.tagline}
                </p>

                <div className="hero-stats">
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="stat-box">
                      <span className="stat-num">{stat.value}</span>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-btns">
                <a
                  href={profile.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-shine"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download CV
                </a>
                <a href="#projects" className="btn-outline">
                  View My Work
                </a>
              </div>
            </div>

            <div className="hero-center glass-card hover-shine hover-lift animate-fade-in-up">
              <div className="hero-photo-area">
                <img
                  src={profile.imagePath}
                  alt={`${profile.name} - Full Stack Developer`}
                  className="hero-photo"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={270}
                  height={370}
                  itemProp="image"
                />
              </div>
              <div
                  className="hero-info"
                  itemProp="address"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                >
                <div className="info-row">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span itemProp="addressLocality">{profile.location}</span>
                </div>
                <div className="info-row">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <a href={`mailto:${profile.email}`} itemProp="email">
                    {profile.email}
                  </a>
                </div>
                <div className="info-row">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                  <button type="button">Available for new projects</button>
                </div>
              </div>
            </div>

            <div className="hero-right animate-fade-in-right">
              <p className="sr-only">
                Featured projects from {profile.name}: {projects.map((p) => p.title).join(", ")}
              </p>

              {skills.slice(0, 3).map((category) => (
                <div
                  key={category.title}
                  className="skill-card glass-card hover-shine hover-lift"
                  itemProp="knowsAbout"
                >
                  <div className="skill-card-header">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                    <h3>{category.title}</h3>
                  </div>
                  <div className="tags">
                    {category.skills.map((skill) => (
                      <span key={skill} className="tag" itemProp="knowsAbout">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="about-section animate-fade-in-up">
            <div className="glass-card about-card hover-lift hover-shine">
              <h2 className="about-heading">About Me</h2>

              <div className="about-columns">
                <div>
                  <p className="about-text">{aboutParagraphs[0]}</p>
                </div>
                <div>
                  <p className="about-text">{aboutParagraphs[1]}</p>
                </div>
              </div>

              <div className="about-achievements-wrap">
                <h4 className="about-subheading">Key Highlights</h4>
                <div className="about-achievements-grid">
                  {achievements.map((item) => (
                    <div key={item} className="about-achievement">
                      <div className="about-dot" />
                      <span className="about-text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section id="projects" itemScope itemType="https://schema.org/ItemList">
            <div className="sr-only" aria-hidden="true">
              <h2>{profile.name} Latest Software Development Projects Portfolio</h2>
              <p>
                Featured projects by {profile.name}: {featuredProjects
                  .map((project) => project.title)
                  .join(", ")}
              </p>
            </div>

            <div className="projects-wrap">
              <div className="projects-intro scroll-reveal animate-fade-in-up revealed">
                <h2 className="projects-heading" itemProp="name">
                  Latest Projects
                </h2>
                <p className="projects-subtext animate-fade-in-left" itemProp="description">
                  Showcasing recently added projects with modern full-stack engineering,
                  production workflows, and practical problem solving.
                </p>
                <a className="projects-all-link glass-card hover-lift hover-shine" href="/projects">
                  View All Projects
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>

              <div className="projects-modern-grid">
                {featuredProjects.map((project, index) => {
                  const glow = glowPositions[index % glowPositions.length];
                  const style = {
                    "--glow-x": glow.x,
                    "--glow-y": glow.y,
                  } as CSSProperties;

                  const secondaryLinks = getProjectSecondaryLinks(project);

                  return (
                    <article
                      key={project.id}
                      className="project-glow-card glass-card scroll-reveal revealed"
                      style={style}
                      itemScope
                      itemType="https://schema.org/CreativeWork"
                      itemProp="itemListElement"
                    >
                      <div className="project-glow" />
                      <div className="project-glow-inner">
                        <div className="project-head">
                          <div className="project-icon-box">{categoryIcon(project.category)}</div>
                          <span className="project-genre" itemProp="genre">
                            {project.category}
                          </span>
                          <h3 className="project-name" itemProp="name">
                            {project.title}
                          </h3>
                        </div>
                        <div className="project-body">
                          <p className="project-description" itemProp="description">
                            {project.shortDescription}
                          </p>
                          <div className="project-tech-list">
                            {project.technologies.slice(0, 8).map((tech) => (
                              <span key={tech} className="project-tech" itemProp="about">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="project-actions-modern">
                            <a className="project-action-btn primary" href={`/projects#${project.id}`}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 3h6v6" />
                                <path d="M10 14 21 3" />
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              </svg>
                              View Details
                            </a>
                            {secondaryLinks.slice(0, 2).map((link) => (
                              <a
                                key={`${project.id}-${link.label}`}
                                className="project-action-btn"
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M15 3h6v6" />
                                  <path d="M10 14 21 3" />
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                </svg>
                                {link.label}
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
          </section>

          <div className="section-divider" />

          <section id="contact">
            <div className="contact-wrap">
              <div className="contact-intro scroll-reveal animate-fade-in-up revealed">
                <h2 className="contact-heading hover-glow">Let's Work Together</h2>
                <p className="contact-subtext animate-fade-in-up">
                  I&apos;m actively seeking opportunities to contribute to innovative products.
                  Let&apos;s discuss how I can bring value to your team.
                </p>
              </div>

              <div className="contact-panels">
                <div className="contact-card glass-card hover-lift hover-shine scroll-reveal animate-fade-in-up revealed">
                  <h3 className="contact-card-title">Send a Message</h3>
                  <form className="contact-form">
                    <div className="contact-form-grid">
                      <div className="contact-field">
                        <label htmlFor="name" className="contact-label">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="contact-input"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="contact-field">
                        <label htmlFor="email" className="contact-label">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="contact-input"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="contact-field">
                      <label htmlFor="message" className="contact-label">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={8}
                        className="contact-textarea"
                        placeholder="Tell me about your project..."
                      />
                    </div>

                    <button type="submit" className="contact-submit btn-shine">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                        <path d="m21.854 2.147-10.94 10.939" />
                      </svg>
                      Send Message
                    </button>
                  </form>
                </div>

                <div
                  className="contact-card glass-card hover-lift hover-shine scroll-reveal animate-fade-in-right revealed"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <h3 className="contact-card-title">Get in Touch</h3>
                  <p className="contact-info-text">
                    Feel free to reach out through any channel. I&apos;m always open to discussing
                    projects, collaboration, and product ideas.
                  </p>

                  <div className="contact-meta">
                    <div>
                      <h4>Email</h4>
                      <p>{profile.email}</p>
                    </div>
                    <div>
                      <h4>Location</h4>
                      <p>{profile.location}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <a href={profile.resumePath} target="_blank" rel="noopener noreferrer" className="contact-download">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                      Download CV
                    </a>
                  </div>

                  <div className="contact-social-wrap">
                    <h4 className="contact-social-title">Connect with me</h4>
                    <div className="contact-social-grid">
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-chip social-github"
                        aria-label="GitHub"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                      </a>
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-chip social-linkedin"
                        aria-label="LinkedIn"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                      <a href={`mailto:${profile.email}`} className="social-chip" aria-label="Email">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
