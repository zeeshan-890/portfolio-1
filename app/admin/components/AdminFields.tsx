"use client";

import { useState } from "react";
import type { PortfolioData, PortfolioProject } from "@/app/data/portfolioTypes";

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  full?: boolean;
  placeholder?: string;
};

export function TextField({ label, value, onChange, type = "text", full, placeholder }: FieldProps) {
  return (
    <div className={`admin-field${full ? " full" : ""}`}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
};

export function TextAreaField({ label, value, onChange, rows = 4 }: TextAreaProps) {
  return (
    <div className="admin-field full">
      <label>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} />
    </div>
  );
}

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function ToggleField({ label, checked, onChange }: ToggleProps) {
  return (
    <div className="admin-toggle-row">
      <span>{label}</span>
      <label className="admin-toggle">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="admin-toggle-slider" />
      </label>
    </div>
  );
}

type TagInputProps = {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
};

export function TagInput({ label, tags, onChange }: TagInputProps) {
  const [input, setInput] = useState("");

  function addTag(value: string) {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  }

  return (
    <div className="admin-field full">
      <label>{label}</label>
      <div className="admin-tag-input">
        {tags.map((tag) => (
          <span key={tag} className="admin-tag">
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(input);
            }
            if (e.key === "Backspace" && !input && tags.length > 0) {
              onChange(tags.slice(0, -1));
            }
          }}
          onBlur={() => addTag(input)}
          placeholder="Type and press Enter"
        />
      </div>
    </div>
  );
}

type ProjectEditorProps = {
  project: PortfolioProject;
  index: number;
  onChange: (project: PortfolioProject) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

export function ProjectEditor({
  project,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: ProjectEditorProps) {
  return (
    <div className="admin-list-item">
      <div className="admin-list-item-header">
        <h4>
          #{index + 1} — {project.title || "Untitled Project"}
        </h4>
        <div className="admin-actions">
          <button type="button" className="admin-btn" onClick={onMoveUp} disabled={!canMoveUp}>
            ↑
          </button>
          <button type="button" className="admin-btn" onClick={onMoveDown} disabled={!canMoveDown}>
            ↓
          </button>
          <button type="button" className="admin-btn admin-btn-danger" onClick={onRemove}>
            Delete
          </button>
        </div>
      </div>
      <div className="admin-grid">
        <TextField
          label="ID (slug)"
          value={project.id}
          onChange={(id) => onChange({ ...project, id })}
        />
        <TextField
          label="Title"
          value={project.title}
          onChange={(title) => onChange({ ...project, title })}
        />
        <div className="admin-field">
          <label>Category</label>
          <select
            value={project.category}
            onChange={(e) =>
              onChange({
                ...project,
                category: e.target.value as PortfolioProject["category"],
              })
            }
          >
            <option value="Full Stack">Full Stack</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Mobile">Mobile</option>
          </select>
        </div>
        <TextField
          label="Live URL"
          value={project.liveUrl ?? ""}
          onChange={(liveUrl) => onChange({ ...project, liveUrl: liveUrl || undefined })}
        />
        <TextField
          label="GitHub URL"
          value={project.githubUrl ?? ""}
          onChange={(githubUrl) => onChange({ ...project, githubUrl: githubUrl || undefined })}
        />
        <TextField
          label="GitHub Frontend URL"
          value={project.githubUrls?.frontend ?? ""}
          onChange={(frontend) =>
            onChange({
              ...project,
              githubUrls: { ...project.githubUrls, frontend: frontend || undefined },
            })
          }
        />
        <TextField
          label="GitHub Backend URL"
          value={project.githubUrls?.backend ?? ""}
          onChange={(backend) =>
            onChange({
              ...project,
              githubUrls: { ...project.githubUrls, backend: backend || undefined },
            })
          }
        />
        <TextAreaField
          label="Description"
          value={project.shortDescription}
          onChange={(shortDescription) => onChange({ ...project, shortDescription })}
        />
        <TagInput
          label="Technologies"
          tags={project.technologies}
          onChange={(technologies) => onChange({ ...project, technologies })}
        />
      </div>
    </div>
  );
}

type StringListEditorProps = {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  itemLabel?: string;
};

export function StringListEditor({ label, items, onChange, itemLabel = "Item" }: StringListEditorProps) {
  return (
    <div className="admin-panel">
      <h3>{label}</h3>
      {items.map((item, index) => (
        <div key={index} className="admin-list-item">
          <div className="admin-list-item-header">
            <h4>
              {itemLabel} {index + 1}
            </h4>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </div>
          <TextAreaField
            label="Content"
            value={item}
            onChange={(value) => {
              const next = [...items];
              next[index] = value;
              onChange(next);
            }}
            rows={3}
          />
        </div>
      ))}
      <button
        type="button"
        className="admin-btn"
        onClick={() => onChange([...items, ""])}
      >
        + Add {itemLabel}
      </button>
    </div>
  );
}

type StatListEditorProps = {
  stats: PortfolioData["heroStats"];
  onChange: (stats: PortfolioData["heroStats"]) => void;
};

export function StatListEditor({ stats, onChange }: StatListEditorProps) {
  return (
    <div className="admin-panel">
      <h3>Hero Stats</h3>
      {stats.map((stat, index) => (
        <div key={index} className="admin-list-item">
          <div className="admin-list-item-header">
            <h4>Stat {index + 1}</h4>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={() => onChange(stats.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </div>
          <div className="admin-grid">
            <TextField
              label="Value"
              value={stat.value}
              onChange={(value) => {
                const next = [...stats];
                next[index] = { ...stat, value };
                onChange(next);
              }}
            />
            <TextField
              label="Label"
              value={stat.label}
              onChange={(label) => {
                const next = [...stats];
                next[index] = { ...stat, label };
                onChange(next);
              }}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn"
        onClick={() => onChange([...stats, { value: "", label: "" }])}
      >
        + Add Stat
      </button>
    </div>
  );
}
