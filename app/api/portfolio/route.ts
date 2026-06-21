import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/auth";
import { getPortfolioData, savePortfolioData } from "@/app/lib/portfolioStore";
import type { PortfolioData } from "@/app/data/portfolioTypes";

export async function GET() {
  const data = await getPortfolioData();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as PortfolioData;
    await savePortfolioData(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save portfolio data" }, { status: 500 });
  }
}
