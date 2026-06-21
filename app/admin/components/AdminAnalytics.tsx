"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalyticsStats } from "@/app/data/analyticsTypes";

function formatDuration(ms: number): string {
  if (ms <= 0) {
    return "0s";
  }

  const seconds = Math.round(ms / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}m ${remainder}s`;
}

function formatDateLabel(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function PieChart({
  data,
}: {
  data: Array<{ label: string; value: number; color: string }>;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return <p className="admin-empty">No device data yet.</p>;
  }

  let cursor = 0;
  const slices = data.map((item) => {
    const start = cursor;
    const angle = (item.value / total) * 360;
    cursor += angle;
    return { ...item, start, angle };
  });

  const gradient = slices
    .map((slice) => `${slice.color} ${slice.start}deg ${slice.start + slice.angle}deg`)
    .join(", ");

  return (
    <div className="admin-chart-pie-wrap">
      <div className="admin-chart-pie" style={{ background: `conic-gradient(${gradient})` }} />
      <ul className="admin-chart-legend">
        {slices.map((slice) => (
          <li key={slice.label}>
            <span className="admin-chart-dot" style={{ background: slice.color }} />
            <span>
              {slice.label} — {slice.value} ({Math.round((slice.value / total) * 100)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LineChart({ data }: { data: Array<{ date: string; count: number }> }) {
  if (data.length === 0) {
    return <p className="admin-empty">No daily interaction data yet.</p>;
  }

  const width = 640;
  const height = 220;
  const padding = { top: 16, right: 16, bottom: 36, left: 36 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const maxCount = Math.max(...data.map((item) => item.count), 1);

  const points = data.map((item, index) => {
    const x =
      data.length === 1
        ? padding.left + innerWidth / 2
        : padding.left + (index / (data.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - (item.count / maxCount) * innerHeight;
    return { ...item, x, y };
  });

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${padding.left},${padding.top + innerHeight} ${polyline} ${padding.left + innerWidth},${padding.top + innerHeight}`;

  return (
    <div className="admin-chart-line-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="admin-chart-line" role="img" aria-label="Daily interactions chart">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding.top + innerHeight - ratio * innerHeight;
          return (
            <g key={ratio}>
              <line
                x1={padding.left}
                x2={padding.left + innerWidth}
                y1={y}
                y2={y}
                className="admin-chart-grid-line"
              />
              <text x={4} y={y + 4} className="admin-chart-axis-label">
                {Math.round(maxCount * ratio)}
              </text>
            </g>
          );
        })}
        <polygon points={area} className="admin-chart-area" />
        <polyline points={polyline} className="admin-chart-line-path" />
        {points.map((point) => (
          <g key={point.date}>
            <circle cx={point.x} cy={point.y} r="4" className="admin-chart-point" />
            <text x={point.x} y={height - 8} textAnchor="middle" className="admin-chart-axis-label">
              {formatDateLabel(point.date)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const DEVICE_COLORS: Record<string, string> = {
  desktop: "#8ab4f8",
  mobile: "#81c995",
  tablet: "#f6ad55",
  unknown: "#888",
};

export default function AdminAnalytics() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/analytics?days=${days}`);
    if (!res.ok) {
      setError("Failed to load analytics data.");
      setLoading(false);
      return;
    }

    const json = (await res.json()) as AnalyticsStats;
    setStats(json);
    setLoading(false);
  }, [days]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <div className="admin-panel">
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="admin-panel">
        <p className="admin-status error">{error ?? "No analytics data available."}</p>
        <button type="button" className="admin-btn" onClick={loadStats}>
          Retry
        </button>
      </div>
    );
  }

  const deviceChartData = stats.deviceBreakdown.map((item) => ({
    label: item.device.charAt(0).toUpperCase() + item.device.slice(1),
    value: item.count,
    color: DEVICE_COLORS[item.device] ?? DEVICE_COLORS.unknown,
  }));

  return (
    <>
      <div className="admin-panel">
        <div className="admin-list-item-header">
          <div>
            <h3>Visitor Analytics</h3>
            <p className="admin-help-text">
              Tracks page views, section clicks, time spent per section, device type, IP, and location.
            </p>
          </div>
          <div className="admin-actions">
            <label className="admin-field" style={{ minWidth: 140 }}>
              <span style={{ fontSize: "0.8rem", color: "#888" }}>Range</span>
              <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </label>
            <button type="button" className="admin-btn" onClick={loadStats}>
              Refresh
            </button>
          </div>
        </div>

        <div className="admin-analytics-summary">
          <div className="admin-analytics-stat">
            <span>Total Sessions</span>
            <strong>{stats.summary.totalSessions}</strong>
          </div>
          <div className="admin-analytics-stat">
            <span>Page Views</span>
            <strong>{stats.summary.totalPageviews}</strong>
          </div>
          <div className="admin-analytics-stat">
            <span>Section Clicks</span>
            <strong>{stats.summary.totalClicks}</strong>
          </div>
          <div className="admin-analytics-stat">
            <span>Avg Session Time</span>
            <strong>{formatDuration(stats.summary.avgSessionDurationMs)}</strong>
          </div>
          <div className="admin-analytics-stat">
            <span>Avg Page Time</span>
            <strong>{formatDuration(stats.summary.avgPageDurationMs)}</strong>
          </div>
          <div className="admin-analytics-stat">
            <span>Total Events</span>
            <strong>{stats.summary.totalEvents}</strong>
          </div>
        </div>
      </div>

      <div className="admin-analytics-grid">
        <div className="admin-panel">
          <h3>Daily Interactions</h3>
          <LineChart data={stats.dailyInteractions} />
        </div>

        <div className="admin-panel">
          <h3>Device Breakdown</h3>
          <PieChart data={deviceChartData} />
        </div>
      </div>

      <div className="admin-panel">
        <h3>Section Engagement</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Clicks</th>
                <th>Total Time</th>
                <th>Avg Time</th>
              </tr>
            </thead>
            <tbody>
              {stats.sectionStats.map((section) => (
                <tr key={section.section}>
                  <td>{section.section}</td>
                  <td>{section.clicks}</td>
                  <td>{formatDuration(section.totalTimeMs)}</td>
                  <td>{formatDuration(section.avgTimeMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-panel">
        <h3>Recent Sessions</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>IP Address</th>
                <th>Location</th>
                <th>Device</th>
                <th>Pages</th>
                <th>Sections</th>
                <th>Clicks</th>
                <th>Duration</th>
                <th>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="admin-empty">
                    No sessions recorded yet. Visit the portfolio site to generate analytics.
                  </td>
                </tr>
              ) : (
                stats.recentSessions.map((session) => (
                  <tr key={session.sessionId}>
                    <td>{session.ip}</td>
                    <td>{session.location}</td>
                    <td>{session.device}</td>
                    <td>{session.pages.join(", ") || "—"}</td>
                    <td>{session.sections.join(", ") || "—"}</td>
                    <td>{session.clicks}</td>
                    <td>{formatDuration(session.durationMs)}</td>
                    <td>{new Date(session.lastSeen).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
