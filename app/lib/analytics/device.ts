import type { DeviceType } from "@/app/data/analyticsTypes";

export function detectDevice(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(ua)) {
    return "tablet";
  }

  if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/.test(ua)) {
    return "mobile";
  }

  if (ua.includes("mozilla") || ua.includes("windows") || ua.includes("macintosh")) {
    return "desktop";
  }

  return "unknown";
}
