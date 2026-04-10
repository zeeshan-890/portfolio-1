"use client";

import { useEffect } from "react";

export default function PortfolioNavObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll(
      ".portfolio-home section[id], .portfolio-home div.about-section"
    );
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(
      ".portfolio-home .side-nav a"
    );

    if (sections.length === 0 || navLinks.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          navLinks.forEach((link) => link.classList.remove("active"));
          const id = entry.target.id || "about";
          const active = document.querySelector<HTMLAnchorElement>(
            `.portfolio-home .side-nav a[href="#${id}"]`
          );
          if (active) {
            active.classList.add("active");
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: "-10% 0px -45% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    const handlers = new Map<HTMLAnchorElement, EventListener>();

    navLinks.forEach((link) => {
      const handler: EventListener = () => {
        navLinks.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
      };

      handlers.set(link, handler);
      link.addEventListener("click", handler);
    });

    return () => {
      observer.disconnect();
      handlers.forEach((handler, link) => {
        link.removeEventListener("click", handler);
      });
    };
  }, []);

  return null;
}
