"use client";

import { useState } from "react";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  PortfolioData,
  PortfolioProject,
  ProjectCategory,
} from "@/app/data/portfolioTypes";

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
  categories: ProjectCategory[];
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
  categories,
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
            value={project.categoryId}
            onChange={(e) => onChange({ ...project, categoryId: e.target.value })}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <ToggleField
          label="Show on homepage"
          checked={project.showOnHomepage}
          onChange={(showOnHomepage) => onChange({ ...project, showOnHomepage })}
        />
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

type ProjectCategoryListEditorProps = {
  categories: ProjectCategory[];
  onChange: (categories: ProjectCategory[]) => void;
};

export function ProjectCategoryListEditor({ categories, onChange }: ProjectCategoryListEditorProps) {
  function moveCategory(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= categories.length) {
      return;
    }

    const next = [...categories];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="admin-panel">
      <h3>Project Categories</h3>
      <p className="admin-help-text">
        Used for filtering on the All Projects page and as tags on homepage project cards.
      </p>
      {categories.map((category, index) => (
        <div key={`${category.id}-${index}`} className="admin-list-item">
          <div className="admin-list-item-header">
            <h4>Category {index + 1}</h4>
            <div className="admin-actions">
              <button
                type="button"
                className="admin-btn"
                onClick={() => moveCategory(index, -1)}
                disabled={index === 0}
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-btn"
                onClick={() => moveCategory(index, 1)}
                disabled={index === categories.length - 1}
              >
                ↓
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={() => onChange(categories.filter((_, i) => i !== index))}
                disabled={categories.length <= 1}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="admin-grid">
            <TextField
              label="ID (slug)"
              value={category.id}
              onChange={(id) => {
                const next = [...categories];
                next[index] = { ...category, id };
                onChange(next);
              }}
            />
            <TextField
              label="Label"
              value={category.label}
              onChange={(label) => {
                const next = [...categories];
                next[index] = { ...category, label };
                onChange(next);
              }}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn"
        onClick={() =>
          onChange([
            ...categories,
            { id: `category-${Date.now()}`, label: "New Category" },
          ])
        }
      >
        + Add Category
      </button>
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

type ExperienceEditorProps = {
  experience: ExperienceItem;
  index: number;
  onChange: (experience: ExperienceItem) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

export function ExperienceEditor({
  experience,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: ExperienceEditorProps) {
  return (
    <div className="admin-list-item">
      <div className="admin-list-item-header">
        <h4>
          #{index + 1} — {experience.role || "Untitled Role"}
          {experience.company ? ` @ ${experience.company}` : ""}
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
          value={experience.id}
          onChange={(id) => onChange({ ...experience, id })}
        />
        <TextField
          label="Role / Title"
          value={experience.role}
          onChange={(role) => onChange({ ...experience, role })}
        />
        <TextField
          label="Company"
          value={experience.company}
          onChange={(company) => onChange({ ...experience, company })}
        />
        <TextField
          label="Period"
          value={experience.period}
          onChange={(period) => onChange({ ...experience, period })}
          placeholder="2024 – Present"
        />
        <TextField
          label="Location"
          value={experience.location ?? ""}
          onChange={(location) => onChange({ ...experience, location: location || undefined })}
        />
        <TextAreaField
          label="Description"
          value={experience.description}
          onChange={(description) => onChange({ ...experience, description })}
        />
        <StringListEditor
          label="Highlights"
          items={experience.highlights}
          onChange={(highlights) => onChange({ ...experience, highlights })}
          itemLabel="Highlight"
        />
      </div>
    </div>
  );
}

type EducationEditorProps = {
  education: EducationItem;
  index: number;
  onChange: (education: EducationItem) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

export function EducationEditor({
  education,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: EducationEditorProps) {
  return (
    <div className="admin-list-item">
      <div className="admin-list-item-header">
        <h4>
          #{index + 1} — {education.degree || "Untitled Degree"}
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
          value={education.id}
          onChange={(id) => onChange({ ...education, id })}
        />
        <TextField
          label="Degree / Program"
          value={education.degree}
          onChange={(degree) => onChange({ ...education, degree })}
        />
        <TextField
          label="Institution"
          value={education.institution}
          onChange={(institution) => onChange({ ...education, institution })}
        />
        <TextField
          label="Period"
          value={education.period}
          onChange={(period) => onChange({ ...education, period })}
          placeholder="2022 – Present"
        />
        <TextField
          label="Location"
          value={education.location ?? ""}
          onChange={(location) => onChange({ ...education, location: location || undefined })}
        />
        <TextAreaField
          label="Description"
          value={education.description ?? ""}
          onChange={(description) => onChange({ ...education, description: description || undefined })}
        />
        <StringListEditor
          label="Highlights"
          items={education.highlights}
          onChange={(highlights) => onChange({ ...education, highlights })}
          itemLabel="Highlight"
        />
      </div>
    </div>
  );
}

type CertificationEditorProps = {
  certification: CertificationItem;
  index: number;
  onChange: (certification: CertificationItem) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

export function CertificationEditor({
  certification,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: CertificationEditorProps) {
  return (
    <div className="admin-list-item">
      <div className="admin-list-item-header">
        <h4>
          #{index + 1} — {certification.title || "Untitled Certification"}
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
          value={certification.id}
          onChange={(id) => onChange({ ...certification, id })}
        />
        <TextField
          label="Title"
          value={certification.title}
          onChange={(title) => onChange({ ...certification, title })}
        />
        <TextField
          label="Issuer"
          value={certification.issuer}
          onChange={(issuer) => onChange({ ...certification, issuer })}
        />
        <TextField
          label="Period"
          value={certification.period ?? ""}
          onChange={(period) => onChange({ ...certification, period: period || undefined })}
        />
        <TextField
          label="Credential URL"
          value={certification.credentialUrl ?? ""}
          onChange={(credentialUrl) =>
            onChange({ ...certification, credentialUrl: credentialUrl || undefined })
          }
        />
        <TextAreaField
          label="Description"
          value={certification.description ?? ""}
          onChange={(description) =>
            onChange({ ...certification, description: description || undefined })
          }
        />
      </div>
    </div>
  );
}
