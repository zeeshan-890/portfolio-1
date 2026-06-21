import { defaultPortfolioData } from "../data/defaultPortfolio";
import type { PortfolioData, PortfolioResume } from "../data/portfolioTypes";
import { getDb } from "./mongodb";
import { normalizePortfolioData } from "./portfolioNormalize";

const COLLECTION = "portfolio_config";
const DOCUMENT_ID = "main";

type PortfolioDocument = PortfolioData & {
  _id: string;
  updatedAt: Date;
};

export { normalizePortfolioData } from "./portfolioNormalize";

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const db = await getDb();
    const doc = await db.collection<PortfolioDocument>(COLLECTION).findOne({ _id: DOCUMENT_ID });

    if (!doc) {
      return defaultPortfolioData;
    }

    const { _id: _ignored, updatedAt: _updatedAt, ...data } = doc;
    return normalizePortfolioData(data);
  } catch (error) {
    console.error("[portfolio] Failed to load from MongoDB:", error);
    throw error;
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  const normalized = normalizePortfolioData(data);
  const db = await getDb();

  await db.collection<PortfolioDocument>(COLLECTION).updateOne(
    { _id: DOCUMENT_ID },
    {
      $set: {
        ...normalized,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}

export async function seedPortfolioData(
  force = false
): Promise<"seeded" | "skipped" | "updated"> {
  const db = await getDb();
  const existing = await db
    .collection<PortfolioDocument>(COLLECTION)
    .findOne({ _id: DOCUMENT_ID });

  if (existing && !force) {
    return "skipped";
  }

  await savePortfolioData(defaultPortfolioData);
  return existing ? "updated" : "seeded";
}

export async function addResume(resume: PortfolioResume): Promise<PortfolioResume[]> {
  const data = await getPortfolioData();
  const resumes = [...data.resumes.filter((item) => item.id !== resume.id), resume];
  await savePortfolioData({ ...data, resumes });
  return resumes;
}

export async function removeResume(id: string): Promise<PortfolioResume[]> {
  const data = await getPortfolioData();
  const resumes = data.resumes.filter((item) => item.id !== id);
  await savePortfolioData({ ...data, resumes });
  return resumes;
}

export function getFeaturedProjects(data: PortfolioData) {
  return data.projects.filter((project) => project.showOnHomepage);
}
