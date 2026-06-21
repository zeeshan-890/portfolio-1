import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/auth";
import { updateResumePath } from "@/app/lib/portfolioStore";
import { RESUME_API_PATH, saveResumeFile } from "@/app/lib/resumeStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf"]);

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File must be 10MB or smaller" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await saveResumeFile(buffer, file.type);
    await updateResumePath(RESUME_API_PATH);

    return NextResponse.json({
      success: true,
      resumePath: RESUME_API_PATH,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("[api/upload/resume] POST failed:", error);
    return NextResponse.json(
      {
        error: "Failed to upload resume",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
