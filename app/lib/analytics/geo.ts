type GeoResult = {
  country?: string;
  region?: string;
  city?: string;
};

const geoCache = new Map<string, GeoResult & { expiresAt: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

function isPrivateIp(ip: string): boolean {
  if (!ip || ip === "unknown") {
    return true;
  }

  if (ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return true;
  }

  if (ip.startsWith("172.")) {
    const second = Number.parseInt(ip.split(".")[1] ?? "0", 10);
    if (second >= 16 && second <= 31) {
      return true;
    }
  }

  return false;
}

export async function lookupGeoFromIp(ip: string): Promise<GeoResult> {
  if (isPrivateIp(ip)) {
    return { country: "Local", region: "Development", city: "Localhost" };
  }

  const cached = geoCache.get(ip);
  if (cached && cached.expiresAt > Date.now()) {
    return { country: cached.country, region: cached.region, city: cached.city };
  }

  try {
    const response = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city`,
      { signal: AbortSignal.timeout(4000) }
    );

    if (!response.ok) {
      return {};
    }

    const data = (await response.json()) as {
      status?: string;
      country?: string;
      regionName?: string;
      city?: string;
    };

    if (data.status !== "success") {
      return {};
    }

    const result: GeoResult = {
      country: data.country,
      region: data.regionName,
      city: data.city,
    };

    geoCache.set(ip, { ...result, expiresAt: Date.now() + CACHE_TTL_MS });
    return result;
  } catch {
    return {};
  }
}

export function formatLocation(country?: string, region?: string, city?: string): string {
  const parts = [city, region, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Unknown";
}
