import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/auth";
import { addResume, removeResume } from "@/app/lib/portfolioStore";
import { createResumeId, deleteResumeFile, saveResumeFile } from "@/app/lib/resumeStore";

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
    const title = String(formData.get("title") ?? "").trim();

    if (!title) {
      return NextResponse.json({ error: "Resume title is required" }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File must be 10MB or smaller" },
        { status: 400 }
      );
    }

    const id = createResumeId(title);
    const buffer = Buffer.from(await file.arrayBuffer());
    await saveResumeFile(id, buffer, file.type, title);
    const resumes = await addResume({ id, title });

    return NextResponse.json({
      success: true,
      resume: { id, title },
      resumes,
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

export async function DELETE(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = new URL(request.url).searchParams.get("id")?.trim();
    if (!id) {
      return NextResponse.json({ error: "Resume id is required" }, { status: 400 });
    }

    await deleteResumeFile(id);
    const resumes = await removeResume(id);

    return NextResponse.json({ success: true, resumes });
  } catch (error) {
    console.error("[api/upload/resume] DELETE failed:", error);
    return NextResponse.json(
      {
        error: "Failed to delete resume",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
