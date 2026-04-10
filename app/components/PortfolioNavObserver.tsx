"use client";

import { useEffect } from "react";

export default function PortfolioNavObserver() {
  useEffect(() => {
    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        ".portfolio-home a[data-nav-target]"
      )
    );

    if (navLinks.length === 0) {
      return;
    }

    const sectionGroups = {
      about: Array.from(
        document.querySelectorAll<HTMLElement>(
          ".portfolio-home #about, .portfolio-home .about-section"
        )
      ),
      projects: Array.from(
        document.querySelectorAll<HTMLElement>(".portfolio-home #projects")
      ),
      contact: Array.from(
        document.querySelectorAll<HTMLElement>(".portfolio-home #contact")
      ),
    };

    const setActive = (targetId: string) => {
      navLinks.forEach((link) => link.classList.remove("active"));
      navLinks.forEach((link) => {
        if (link.dataset.navTarget === targetId) {
          link.classList.add("active");
        }
      });
    };

    const resolveActiveSection = () => {
      const marker = window.scrollY + window.innerHeight * 0.38;
      let activeTarget = "about";
      let nearestTop = Number.NEGATIVE_INFINITY;

      const groups = Object.entries(sectionGroups) as Array<
        [string, HTMLElement[]]
      >;

      groups.forEach(([target, sections]) => {
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const bottom = top + rect.height;

          if (marker >= top && marker < bottom) {
            activeTarget = target;
          }

          if (top <= marker && top > nearestTop) {
            nearestTop = top;
            activeTarget = target;
          }
        });
      });

      setActive(activeTarget);
    };

    let ticking = false;
    const onScrollOrResize = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        resolveActiveSection();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    const handlers = new Map<HTMLAnchorElement, EventListener>();

    navLinks.forEach((link) => {
      const handler: EventListener = () => {
        const targetId = link.dataset.navTarget;
        if (targetId) {
          setActive(targetId);
        }
      };

      handlers.set(link, handler);
      link.addEventListener("click", handler);
    });

    resolveActiveSection();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      handlers.forEach((handler, link) => {
        link.removeEventListener("click", handler);
      });
    };
  }, []);

  return null;
}
