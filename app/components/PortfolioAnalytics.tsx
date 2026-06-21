"use client";

import { useEffect, useRef } from "react";
import type { AnalyticsEventInput, AnalyticsSection } from "@/app/data/analyticsTypes";

const SESSION_KEY = "portfolio_analytics_session";

type PortfolioAnalyticsProps = {
  page: "/" | "/projects";
};

const HOME_SECTIONS = ["about", "experience", "projects", "education", "contact"] as const;

function getSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

function sendEvents(events: AnalyticsEventInput[]) {
  if (events.length === 0) {
    return;
  }

  const payload = JSON.stringify({
    events: events.map((event) => ({
      ...event,
      userAgent: navigator.userAgent,
    })),
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
    return;
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

function resolveHomeSection(): AnalyticsSection {
  const marker = window.scrollY + window.innerHeight * 0.38;
  let active: AnalyticsSection = "about";
  let nearestTop = Number.NEGATIVE_INFINITY;

  for (const sectionId of HOME_SECTIONS) {
    const element = document.getElementById(sectionId);
    if (!sectionId || !element) {
      continue;
    }

    const top = element.getBoundingClientRect().top + window.scrollY;
    const bottom = top + element.offsetHeight;

    if (marker >= top && marker < bottom) {
      active = sectionId;
    }

    if (top <= marker && top > nearestTop) {
      nearestTop = top;
      active = sectionId;
    }
  }

  const aboutCard = document.querySelector(".portfolio-home .about-section");
  if (aboutCard) {
    const top = aboutCard.getBoundingClientRect().top + window.scrollY;
    const bottom = top + aboutCard.clientHeight;
    if (marker >= top && marker < bottom) {
      active = "about";
    }
  }

  return active;
}

export default function PortfolioAnalytics({ page }: PortfolioAnalyticsProps) {
  const sessionIdRef = useRef("");
  const currentSectionRef = useRef<AnalyticsSection | null>(null);
  const sectionStartedAtRef = useRef<number>(Date.now());
  const pendingTimeRef = useRef<Map<AnalyticsSection, number>>(new Map());

  useEffect(() => {
    sessionIdRef.current = getSessionId();

    sendEvents([
      {
        sessionId: sessionIdRef.current,
        type: "pageview",
        page,
        section: page === "/projects" ? "projects_page" : undefined,
      },
    ]);

    if (page !== "/") {
      return;
    }

    const flushSectionTime = (section: AnalyticsSection) => {
      const elapsed = Date.now() - sectionStartedAtRef.current;
      if (elapsed < 1000) {
        return;
      }

      const current = pendingTimeRef.current.get(section) ?? 0;
      pendingTimeRef.current.set(section, current + elapsed);
    };

    const sendPendingTimes = () => {
      const events: AnalyticsEventInput[] = [];

      pendingTimeRef.current.forEach((durationMs, section) => {
        if (durationMs >= 1000) {
          events.push({
            sessionId: sessionIdRef.current,
            type: "section_time",
            page,
            section,
            durationMs,
          });
        }
      });

      if (events.length > 0) {
        sendEvents(events);
        pendingTimeRef.current.clear();
      }
    };

    const switchSection = (nextSection: AnalyticsSection) => {
      if (currentSectionRef.current === nextSection) {
        return;
      }

      if (currentSectionRef.current) {
        flushSectionTime(currentSectionRef.current);
      }

      currentSectionRef.current = nextSection;
      sectionStartedAtRef.current = Date.now();
    };

    const trackActiveSection = () => {
      switchSection(resolveHomeSection());
    };

    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".portfolio-home a[data-nav-target]")
    );

    const clickHandlers = navLinks.map((link) => {
      const handler = () => {
        const target = link.dataset.navTarget as AnalyticsSection | undefined;
        if (!target) {
          return;
        }

        sendEvents([
          {
            sessionId: sessionIdRef.current,
            type: "section_click",
            page,
            section: target,
          },
        ]);
      };

      link.addEventListener("click", handler);
      return { link, handler };
    });

    trackActiveSection();

    let scrollTicking = false;
    const onScroll = () => {
      if (scrollTicking) {
        return;
      }

      scrollTicking = true;
      window.requestAnimationFrame(() => {
        trackActiveSection();
        scrollTicking = false;
      });
    };

    const intervalId = window.setInterval(() => {
      if (currentSectionRef.current) {
        flushSectionTime(currentSectionRef.current);
        sectionStartedAtRef.current = Date.now();
      }
      sendPendingTimes();
    }, 15000);

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (currentSectionRef.current) {
          flushSectionTime(currentSectionRef.current);
        }
        sendPendingTimes();
      } else {
        sectionStartedAtRef.current = Date.now();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearInterval(intervalId);
      clickHandlers.forEach(({ link, handler }) => link.removeEventListener("click", handler));

      if (currentSectionRef.current) {
        flushSectionTime(currentSectionRef.current);
      }
      sendPendingTimes();
    };
  }, [page]);

  return null;
}
