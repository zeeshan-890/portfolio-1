import type { PortfolioProject, ProjectCategory } from "../data/portfolioTypes";

export function getProjectCategoryLabel(
  project: PortfolioProject,
  categories: ProjectCategory[]
): string {
  return categories.find((category) => category.id === project.categoryId)?.label ?? "Uncategorized";
}

export function createCategoryId(label: string): string {
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || `category-${Date.now()}`
  );
}

export const LEGACY_PROJECT_CATEGORY_MAP: Record<string, string> = {
  "Full Stack": "full-stack",
  Frontend: "web-app",
  Backend: "full-stack",
  Mobile: "web-app",
};
