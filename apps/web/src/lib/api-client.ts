export function getApiBase(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      if (envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
        return envUrl.replace(/localhost|127\.0\.0\.1/, host);
      }
    }
  }
  return envUrl;
}

export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${getApiBase()}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Module 1
  recommendCrops: (data: any) =>
    fetchFromAPI("/crops/recommend", { method: "POST", body: JSON.stringify(data) }),

  // Module 2
  getNearbySeedHubs: (lat: number, lng: number, radius: number = 50) =>
    fetchFromAPI(`/seeds/nearby?lat=${lat}&lng=${lng}&radius_km=${radius}`),

  reserveSeed: (data: any) =>
    fetchFromAPI("/seeds/reserve", { method: "POST", body: JSON.stringify(data) }),

  // Module 3
  calculateArbitrage: (data: any) =>
    fetchFromAPI("/market/arbitrage", { method: "POST", body: JSON.stringify(data) }),

  getForecast90D: (commodity: string = "Arecanut") =>
    fetchFromAPI(`/market/forecast-90d?commodity=${commodity}`),

  getBatchPool: (lat: number, lng: number) =>
    fetchFromAPI(`/market/batch-pool?lat=${lat}&lng=${lng}`),

  // Module 4
  calculateAcreage: (coordinates: number[][]) =>
    fetchFromAPI("/location/acreage", { method: "POST", body: JSON.stringify({ coordinates }) }),

  // Module 5
  getWeatherAdvisory: (lat: number, lng: number) =>
    fetchFromAPI(`/weather/advisory?lat=${lat}&lng=${lng}`),

  // Module 6 & Lab
  evaluateTimelineDelta: (data: { initial_severity_pct: number; followup_severity_pct: number; days_elapsed: number }) =>
    fetchFromAPI("/timeline/evaluate-delta", { method: "POST", body: JSON.stringify(data) }),

  getIoTTelemetry: () =>
    fetchFromAPI("/iot/telemetry"),
};
