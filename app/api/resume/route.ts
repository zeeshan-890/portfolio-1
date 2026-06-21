import { Readable } from "stream";
import { NextResponse } from "next/server";
import { getResumeFile } from "@/app/lib/resumeStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const resume = await getResumeFile();

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const webStream = Readable.toWeb(resume.stream as Readable) as ReadableStream;

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": resume.contentType,
        "Content-Length": String(resume.length),
        "Content-Disposition": 'inline; filename="resume.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[api/resume] GET failed:", error);
    return NextResponse.json(
      { error: "Failed to load resume" },
      { status: 500 }
    );
  }
}
