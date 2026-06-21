"use client";

import { useRef, useState } from "react";
import type { PortfolioResume } from "@/app/data/portfolioTypes";
import { getResumeApiPath } from "@/app/lib/resumePaths";

type ResumeManagerProps = {
  resumes: PortfolioResume[];
  onResumesChange: (resumes: PortfolioResume[]) => void;
};

export default function ResumeManager({ resumes, onResumesChange }: ResumeManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  async function handleUpload(file: File) {
    if (!title.trim()) {
      setMessage({ type: "error", text: "Enter a resume title before uploading." });
      return;
    }

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("file", file);

    const res = await fetch("/api/upload/resume", {
      method: "POST",
      body: formData,
    });

    const payload = (await res.json().catch(() => null)) as {
      error?: string;
      details?: string;
      resumes?: PortfolioResume[];
      fileName?: string;
    } | null;

    if (!res.ok) {
      const text = payload?.details
        ? `${payload.error ?? "Upload failed"}: ${payload.details}`
        : payload?.error ?? "Upload failed";
      setMessage({ type: "error", text });
      setUploading(false);
      return;
    }

    if (payload?.resumes) {
      onResumesChange(payload.resumes);
    }

    setTitle("");
    setMessage({
      type: "success",
      text: `Resume uploaded${payload?.fileName ? `: ${payload.fileName}` : ""}`,
    });
    setUploading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setMessage(null);

    const res = await fetch(`/api/upload/resume?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    const payload = (await res.json().catch(() => null)) as {
      error?: string;
      details?: string;
      resumes?: PortfolioResume[];
    } | null;

    if (!res.ok) {
      const text = payload?.details
        ? `${payload.error ?? "Delete failed"}: ${payload.details}`
        : payload?.error ?? "Delete failed";
      setMessage({ type: "error", text });
      setDeletingId(null);
      return;
    }

    if (payload?.resumes) {
      onResumesChange(payload.resumes);
    }

    setMessage({ type: "success", text: "Resume deleted." });
    setDeletingId(null);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      void handleUpload(file);
    }
  }

  return (
    <div className="admin-panel">
      <h3>Resumes</h3>
      <p className="admin-panel-hint">
        Upload multiple CVs with titles. Visitors choose which one to open from the Download CV
        button.
      </p>

      <div className="admin-grid">
        <div className="admin-field full">
          <label htmlFor="resume-title">Resume Title</label>
          <input
            id="resume-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Full Stack CV, AI Resume"
            disabled={uploading}
          />
        </div>

        <div className="admin-field full admin-upload-field">
          <label>Resume PDF</label>
          <div className="admin-upload-box">
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={onFileChange}
              disabled={uploading}
              className="admin-upload-input"
            />
            <div className="admin-upload-content">
              <p>{uploading ? "Uploading resume..." : "Click to choose a PDF"}</p>
              <span>Max size: 10MB</span>
            </div>
          </div>
        </div>
      </div>

      {message && <p className={`admin-upload-message ${message.type}`}>{message.text}</p>}

      {resumes.length > 0 ? (
        <div className="admin-resume-list">
          {resumes.map((resume) => (
            <div key={resume.id} className="admin-list-item">
              <div className="admin-list-item-header">
                <h4>{resume.title}</h4>
                <div className="admin-actions">
                  <a
                    href={getResumeApiPath(resume.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn"
                  >
                    Preview
                  </a>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    onClick={() => void handleDelete(resume.id)}
                    disabled={deletingId === resume.id}
                  >
                    {deletingId === resume.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="admin-empty">No resumes uploaded yet.</p>
      )}
    </div>
  );
}
