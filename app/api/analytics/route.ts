import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/auth";
import type { AnalyticsEventInput } from "@/app/data/analyticsTypes";
import {
  ensureAnalyticsIndexes,
  getAnalyticsStats,
  recordAnalyticsEvents,
} from "@/app/lib/analytics/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseEvents(body: unknown): AnalyticsEventInput[] {
  if (!body || typeof body !== "object") {
    return [];
  }

  const source = body as { events?: unknown };
  if (!Array.isArray(source.events)) {
    return [];
  }

  return source.events
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      sessionId: typeof item.sessionId === "string" ? item.sessionId : "",
      type:
        item.type === "pageview" || item.type === "section_click" || item.type === "section_time"
          ? item.type
          : "pageview",
      page: typeof item.page === "string" ? item.page : "/",
      section:
        item.section === "about" ||
        item.section === "experience" ||
        item.section === "projects" ||
        item.section === "education" ||
        item.section === "contact" ||
        item.section === "projects_page"
          ? item.section
          : undefined,
      durationMs: typeof item.durationMs === "number" ? item.durationMs : undefined,
      userAgent: typeof item.userAgent === "string" ? item.userAgent : undefined,
    }));
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    await ensureAnalyticsIndexes();
    const saved = await recordAnalyticsEvents(request, parseEvents(body));
    return NextResponse.json({ success: true, saved });
  } catch (error) {
    console.error("[api/analytics] POST failed:", error);
    return NextResponse.json({ error: "Failed to record analytics" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = Math.min(90, Math.max(1, Number.parseInt(searchParams.get("days") ?? "30", 10) || 30));

    await ensureAnalyticsIndexes();
    const stats = await getAnalyticsStats(days);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[api/analytics] GET failed:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
