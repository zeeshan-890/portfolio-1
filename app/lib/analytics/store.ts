import type {
  AnalyticsEventDocument,
  AnalyticsEventInput,
  AnalyticsStats,
  DeviceType,
} from "@/app/data/analyticsTypes";
import { getDb } from "../mongodb";
import { detectDevice } from "./device";
import { formatLocation, lookupGeoFromIp } from "./geo";

const COLLECTION = "analytics_events";

type StoredEvent = AnalyticsEventDocument;

const SECTION_LABELS: Record<string, string> = {
  about: "About",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
  contact: "Contact",
  projects_page: "All Projects Page",
};

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function normalizePage(page: string): string {
  if (!page || page === "/") {
    return "/";
  }

  return page.startsWith("/") ? page : `/${page}`;
}

function isValidEvent(input: AnalyticsEventInput): boolean {
  if (!input.sessionId || !input.type || !input.page) {
    return false;
  }

  if (input.type === "section_time" && (!input.section || !input.durationMs || input.durationMs <= 0)) {
    return false;
  }

  if (input.type === "section_click" && !input.section) {
    return false;
  }

  return true;
}

export async function recordAnalyticsEvents(
  request: Request,
  events: AnalyticsEventInput[]
): Promise<number> {
  if (events.length === 0) {
    return 0;
  }

  const ip = getClientIp(request);
  const geo = await lookupGeoFromIp(ip);
  const defaultUserAgent = request.headers.get("user-agent") ?? "";

  const documents: StoredEvent[] = events.filter(isValidEvent).map((event) => {
    const userAgent = event.userAgent ?? defaultUserAgent;
    return {
      sessionId: event.sessionId.slice(0, 64),
      type: event.type,
      page: normalizePage(event.page),
      section: event.section,
      durationMs: event.durationMs,
      device: detectDevice(userAgent),
      userAgent: userAgent.slice(0, 512),
      ip,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      createdAt: new Date(),
    };
  });

  if (documents.length === 0) {
    return 0;
  }

  const db = await getDb();
  await db.collection<StoredEvent>(COLLECTION).insertMany(documents);
  return documents.length;
}

function emptyStats(): AnalyticsStats {
  return {
    summary: {
      totalEvents: 0,
      totalSessions: 0,
      totalPageviews: 0,
      totalClicks: 0,
      avgSessionDurationMs: 0,
      avgPageDurationMs: 0,
    },
    sectionStats: Object.entries(SECTION_LABELS).map(([section, label]) => ({
      section: label,
      clicks: 0,
      totalTimeMs: 0,
      avgTimeMs: 0,
    })),
    deviceBreakdown: [],
    dailyInteractions: [],
    recentSessions: [],
  };
}

export async function getAnalyticsStats(days = 30): Promise<AnalyticsStats> {
  const db = await getDb();
  const collection = db.collection<StoredEvent>(COLLECTION);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const matchStage = { createdAt: { $gte: since } };

  const [totalEvents, sessionIds, pageviews, clicks, sectionAgg, deviceAgg, dailyAgg, sessionsAgg] =
    await Promise.all([
      collection.countDocuments(matchStage),
      collection.distinct("sessionId", matchStage),
      collection.countDocuments({ ...matchStage, type: "pageview" }),
      collection.countDocuments({ ...matchStage, type: "section_click" }),
      collection
        .aggregate<{ _id: string; clicks: number; totalTimeMs: number; timeViews: number }>([
          { $match: matchStage },
          {
            $group: {
              _id: "$section",
              clicks: {
                $sum: { $cond: [{ $eq: ["$type", "section_click"] }, 1, 0] },
              },
              totalTimeMs: {
                $sum: {
                  $cond: [{ $eq: ["$type", "section_time"] }, { $ifNull: ["$durationMs", 0] }, 0],
                },
              },
              timeViews: {
                $sum: { $cond: [{ $eq: ["$type", "section_time"] }, 1, 0] },
              },
            },
          },
        ])
        .toArray(),
      collection
        .aggregate<{ _id: DeviceType; count: number }>([
          { $match: { ...matchStage, type: "pageview" } },
          { $group: { _id: "$device", count: { $sum: 1 } } },
        ])
        .toArray(),
      collection
        .aggregate<{ _id: string; count: number }>([
          { $match: matchStage },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
      collection
        .aggregate<{
          _id: string;
          ip: string;
          device: DeviceType;
          country?: string;
          region?: string;
          city?: string;
          pages: string[];
          sections: (string | null)[];
          clicks: number;
          durationMs: number;
          firstSeen: Date;
          lastSeen: Date;
        }>([
          { $match: matchStage },
          {
            $group: {
              _id: "$sessionId",
              ip: { $first: "$ip" },
              device: { $first: "$device" },
              country: { $first: "$country" },
              region: { $first: "$region" },
              city: { $first: "$city" },
              pages: { $addToSet: "$page" },
              sections: { $addToSet: "$section" },
              clicks: {
                $sum: { $cond: [{ $eq: ["$type", "section_click"] }, 1, 0] },
              },
              durationMs: {
                $sum: {
                  $cond: [{ $eq: ["$type", "section_time"] }, { $ifNull: ["$durationMs", 0] }, 0],
                },
              },
              firstSeen: { $min: "$createdAt" },
              lastSeen: { $max: "$createdAt" },
            },
          },
          { $sort: { lastSeen: -1 } },
          { $limit: 50 },
        ])
        .toArray(),
    ]);

  if (totalEvents === 0) {
    return emptyStats();
  }

  const sectionMap = new Map(
    sectionAgg
      .filter((item) => item._id)
      .map((item) => [
        item._id,
        {
          clicks: item.clicks,
          totalTimeMs: item.totalTimeMs,
          avgTimeMs:
            item.timeViews > 0
              ? Math.round(item.totalTimeMs / item.timeViews)
              : item.totalTimeMs,
        },
      ])
  );

  const sectionStats = Object.entries(SECTION_LABELS).map(([key, label]) => {
    const stat = sectionMap.get(key);
    const totalTimeMs = stat?.totalTimeMs ?? 0;
    const clicks = stat?.clicks ?? 0;
    const avgTimeMs = stat?.avgTimeMs ?? 0;
    return {
      section: label,
      clicks,
      totalTimeMs,
      avgTimeMs,
    };
  });

  const deviceTotal = deviceAgg.reduce((sum, item) => sum + item.count, 0);
  const deviceBreakdown = deviceAgg.map((item) => ({
    device: item._id ?? "unknown",
    count: item.count,
    percentage: deviceTotal > 0 ? Math.round((item.count / deviceTotal) * 1000) / 10 : 0,
  }));

  const dailyInteractions = dailyAgg.map((item) => ({
    date: item._id,
    count: item.count,
  }));

  const totalSessionDuration = sessionsAgg.reduce((sum, session) => sum + session.durationMs, 0);
  const totalSessionTimeFallback = sessionsAgg.reduce((sum, session) => {
    const span = session.lastSeen.getTime() - session.firstSeen.getTime();
    return sum + Math.max(session.durationMs, span);
  }, 0);

  const recentSessions = sessionsAgg.map((session) => ({
    sessionId: session._id,
    ip: session.ip ?? "unknown",
    location: formatLocation(session.country, session.region, session.city),
    device: session.device ?? "unknown",
    pages: session.pages ?? [],
    sections: (session.sections ?? [])
      .filter((section): section is string => !!section)
      .map((section) => SECTION_LABELS[section] ?? section),
    clicks: session.clicks,
    durationMs: Math.max(
      session.durationMs,
      session.lastSeen.getTime() - session.firstSeen.getTime()
    ),
    firstSeen: session.firstSeen.toISOString(),
    lastSeen: session.lastSeen.toISOString(),
  }));

  return {
    summary: {
      totalEvents,
      totalSessions: sessionIds.length,
      totalPageviews: pageviews,
      totalClicks: clicks,
      avgSessionDurationMs:
        sessionIds.length > 0 ? Math.round(totalSessionTimeFallback / sessionIds.length) : 0,
      avgPageDurationMs: pageviews > 0 ? Math.round(totalSessionDuration / pageviews) : 0,
    },
    sectionStats,
    deviceBreakdown,
    dailyInteractions,
    recentSessions,
  };
}

export async function ensureAnalyticsIndexes(): Promise<void> {
  const db = await getDb();
  const collection = db.collection(COLLECTION);
  await collection.createIndex({ createdAt: -1 });
  await collection.createIndex({ sessionId: 1, createdAt: -1 });
  await collection.createIndex({ type: 1, createdAt: -1 });
}
