import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/auth";
import { getPortfolioData, normalizePortfolioData, savePortfolioData } from "@/app/lib/portfolioStore";
import type { PortfolioData } from "@/app/data/portfolioTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/portfolio] GET failed:", error);
    return NextResponse.json(
      {
        error: "Failed to load portfolio data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const data = normalizePortfolioData(body) as PortfolioData;
    await savePortfolioData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/portfolio] PUT failed:", error);
    return NextResponse.json(
      {
        error: "Failed to save portfolio data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
