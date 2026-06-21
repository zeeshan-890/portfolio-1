import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/auth";
import { migratePortfolioData } from "@/app/lib/portfolioStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await migratePortfolioData();
    return NextResponse.json({
      success: true,
      counts: {
        projects: data.projects.length,
        experiences: data.experiences.length,
        education: data.education.length,
        certifications: data.certifications.length,
        skills: data.skills.length,
      },
    });
  } catch (error) {
    console.error("[api/portfolio/migrate] POST failed:", error);
    return NextResponse.json(
      {
        error: "Failed to migrate portfolio data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
