export type AnalyticsSection =
  | "about"
  | "experience"
  | "projects"
  | "education"
  | "contact"
  | "projects_page";

export type AnalyticsEventType = "pageview" | "section_click" | "section_time";

export type DeviceType = "desktop" | "mobile" | "tablet" | "unknown";

export type AnalyticsEventInput = {
  sessionId: string;
  type: AnalyticsEventType;
  page: string;
  section?: AnalyticsSection;
  durationMs?: number;
  userAgent?: string;
};

export type AnalyticsEventDocument = AnalyticsEventInput & {
  device: DeviceType;
  userAgent: string;
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  createdAt: Date;
};

export type SectionStat = {
  section: string;
  clicks: number;
  totalTimeMs: number;
  avgTimeMs: number;
};

export type DeviceBreakdownItem = {
  device: DeviceType;
  count: number;
  percentage: number;
};

export type DailyInteraction = {
  date: string;
  count: number;
};

export type RecentSession = {
  sessionId: string;
  ip: string;
  location: string;
  device: DeviceType;
  pages: string[];
  sections: string[];
  clicks: number;
  durationMs: number;
  firstSeen: string;
  lastSeen: string;
};

export type AnalyticsStats = {
  summary: {
    totalEvents: number;
    totalSessions: number;
    totalPageviews: number;
    totalClicks: number;
    avgSessionDurationMs: number;
    avgPageDurationMs: number;
  };
  sectionStats: SectionStat[];
  deviceBreakdown: DeviceBreakdownItem[];
  dailyInteractions: DailyInteraction[];
  recentSessions: RecentSession[];
};
