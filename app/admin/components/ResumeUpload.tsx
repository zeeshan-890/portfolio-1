"use client";

import { useRef, useState } from "react";

type ResumeUploadProps = {
  resumePath: string;
  onUploaded: (resumePath: string) => void;
};

export default function ResumeUpload({ resumePath, onUploaded }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  async function handleUpload(file: File) {
    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload/resume", {
      method: "POST",
      body: formData,
    });

    const payload = (await res.json().catch(() => null)) as {
      error?: string;
      details?: string;
      resumePath?: string;
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

    const nextPath = payload?.resumePath ?? "/api/resume";
    onUploaded(nextPath);
    setMessage({
      type: "success",
      text: `Resume uploaded${payload?.fileName ? `: ${payload.fileName}` : ""}`,
    });
    setUploading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      void handleUpload(file);
    }
  }

  return (
    <div className="admin-field full admin-upload-field">
      <label>Resume (PDF)</label>
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
          <p>{uploading ? "Uploading resume..." : "Click to choose a PDF or drag it here"}</p>
          <span>Max size: 10MB</span>
        </div>
      </div>
      {resumePath && (
        <a href={resumePath} target="_blank" rel="noopener noreferrer" className="admin-upload-link">
          View current resume
        </a>
      )}
      {message && (
        <p className={`admin-upload-message ${message.type}`}>{message.text}</p>
      )}
    </div>
  );
}
