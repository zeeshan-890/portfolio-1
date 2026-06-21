import { GridFSBucket, ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import type { PortfolioResume } from "../data/portfolioTypes";

const BUCKET_NAME = "portfolio_files";
const LEGACY_FILENAME = "resume";

function getResumeFilename(id: string) {
  return `resume-${id}`;
}

function getBucket(db: Awaited<ReturnType<typeof getDb>>) {
  return new GridFSBucket(db, { bucketName: BUCKET_NAME });
}

export function createResumeId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  return slug ? `${slug}-${Date.now()}` : `resume-${Date.now()}`;
}

export async function saveResumeFile(
  id: string,
  buffer: Buffer,
  contentType: string,
  title: string
): Promise<void> {
  const db = await getDb();
  const bucket = getBucket(db);
  const filename = getResumeFilename(id);

  const existing = await db
    .collection(`${BUCKET_NAME}.files`)
    .find({ filename })
    .toArray();

  for (const file of existing) {
    await bucket.delete(file._id as ObjectId);
  }

  const uploadStream = bucket.openUploadStream(filename, {
    metadata: { kind: "resume", resumeId: id, title, contentType, uploadedAt: new Date() },
  });

  await new Promise<void>((resolve, reject) => {
    uploadStream.on("error", reject);
    uploadStream.on("finish", () => resolve());
    uploadStream.end(buffer);
  });
}

export async function deleteResumeFile(id: string): Promise<void> {
  const db = await getDb();
  const bucket = getBucket(db);
  const filename = getResumeFilename(id);

  const existing = await db
    .collection(`${BUCKET_NAME}.files`)
    .find({ filename })
    .toArray();

  for (const file of existing) {
    await bucket.delete(file._id as ObjectId);
  }
}

export async function getResumeFileById(id: string): Promise<{
  stream: NodeJS.ReadableStream;
  contentType: string;
  length: number;
  title: string;
} | null> {
  const db = await getDb();
  const bucket = getBucket(db);

  let files = await db
    .collection(`${BUCKET_NAME}.files`)
    .find({ filename: getResumeFilename(id) })
    .sort({ uploadDate: -1 })
    .limit(1)
    .toArray();

  if (!files[0] && id === "legacy") {
    files = await db
      .collection(`${BUCKET_NAME}.files`)
      .find({ filename: LEGACY_FILENAME })
      .sort({ uploadDate: -1 })
      .limit(1)
      .toArray();
  }

  const file = files[0];
  if (!file) {
    return null;
  }

  const metadata = file.metadata as { contentType?: string; title?: string } | undefined;

  return {
    stream: bucket.openDownloadStream(file._id as ObjectId),
    contentType: metadata?.contentType || (file.contentType as string) || "application/pdf",
    length: file.length as number,
    title: metadata?.title || "Resume",
  };
}

export async function getLegacyResume(): Promise<PortfolioResume | null> {
  const db = await getDb();
  const file = await db
    .collection(`${BUCKET_NAME}.files`)
    .find({ filename: LEGACY_FILENAME })
    .sort({ uploadDate: -1 })
    .limit(1)
    .next();

  if (!file) {
    return null;
  }

  const metadata = file.metadata as { title?: string } | undefined;
  return {
    id: "legacy",
    title: metadata?.title || "Resume",
  };
}
