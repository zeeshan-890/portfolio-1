"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioResume } from "@/app/data/portfolioTypes";
import { getResumeApiPath } from "@/app/lib/resumePaths";

type ResumePickerButtonProps = {
  resumes: PortfolioResume[];
  label: string;
  className?: string;
  icon?: React.ReactNode;
};

export default function ResumePickerButton({
  resumes,
  label,
  className = "",
  icon,
}: ResumePickerButtonProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (resumes.length === 0) {
    return null;
  }

  if (resumes.length === 1) {
    return (
      <a
        href={getResumeApiPath(resumes[0].id)}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {icon}
        {label}
      </a>
    );
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {icon}
        {label}
      </button>

      {open && (
        <div
          className="resume-picker-backdrop"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            ref={dialogRef}
            className="resume-picker-dialog glass-card"
            role="dialog"
            aria-modal="true"
            aria-label="Choose a resume"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="resume-picker-header">
              <h3>Choose a Resume</h3>
              <button
                type="button"
                className="resume-picker-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="resume-picker-list">
              {resumes.map((resume) => (
                <a
                  key={resume.id}
                  href={getResumeApiPath(resume.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-picker-item"
                  onClick={() => setOpen(false)}
                >
                  <span>{resume.title}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
