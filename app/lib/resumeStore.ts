import { GridFSBucket, ObjectId } from "mongodb";
import { getDb } from "./mongodb";

const BUCKET_NAME = "portfolio_files";
const RESUME_FILENAME = "resume";
export const RESUME_API_PATH = "/api/resume";

function getBucket(db: Awaited<ReturnType<typeof getDb>>) {
  return new GridFSBucket(db, { bucketName: BUCKET_NAME });
}

export async function saveResumeFile(buffer: Buffer, contentType: string): Promise<void> {
  const db = await getDb();
  const bucket = getBucket(db);

  const existing = await db
    .collection(`${BUCKET_NAME}.files`)
    .find({ filename: RESUME_FILENAME })
    .toArray();

  for (const file of existing) {
    await bucket.delete(file._id as ObjectId);
  }

  const uploadStream = bucket.openUploadStream(RESUME_FILENAME, {
    metadata: { kind: "resume", uploadedAt: new Date(), contentType },
  });

  await new Promise<void>((resolve, reject) => {
    uploadStream.on("error", reject);
    uploadStream.on("finish", () => resolve());
    uploadStream.end(buffer);
  });
}

export async function getResumeFile(): Promise<{
  stream: NodeJS.ReadableStream;
  contentType: string;
  length: number;
} | null> {
  const db = await getDb();
  const bucket = getBucket(db);

  const files = await db
    .collection(`${BUCKET_NAME}.files`)
    .find({ filename: RESUME_FILENAME })
    .sort({ uploadDate: -1 })
    .limit(1)
    .toArray();

  const file = files[0];
  if (!file) {
    return null;
  }

  return {
    stream: bucket.openDownloadStream(file._id as ObjectId),
    contentType:
      (file.metadata as { contentType?: string } | undefined)?.contentType ||
      (file.contentType as string) ||
      "application/pdf",
    length: file.length as number,
  };
}
