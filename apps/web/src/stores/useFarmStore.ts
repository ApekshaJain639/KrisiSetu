import { create } from "zustand";
import { fetchReverseGeocode } from "../lib/db-client";

export type Language = "kn" | "en" | "hi" | "mr";
export type Theme = "light" | "dark";
export type ActiveTab =
  | "overview"
  | "crop-guide"
  | "leaf-scan"
  | "risk-forecast"
  | "gis-field-map"
  | "ndvi"
  | "yield"
  | "market"
  | "seed-bazaar"
  | "aiot-lab";

export type ViewMode = "app" | "landing" | "signin" | "admin";

interface DbStats {
  connected: boolean;
  dialect: string;
  totalFarmers: number;
  totalAcreage: number;
  activeOutbreaks: number;
  dbtDisbursed: number;
  tables: {
    farmers: number;
    parcels: number;
    mandi_prices: number;
    scan_records: number;
    seed_hubs: number;
  };
}

export const isUserAdmin = (user: { role?: string } | null | undefined): boolean => {
  if (!user || !user.role) return false;
  const r = user.role.toLowerCase();
  return (
    r === "sdm_admin" ||
    r === "district_officer" ||
    r === "taluk_officer" ||
    r === "admin" ||
    r.includes("admin") ||
    r.includes("officer")
  );
};

interface FarmState {
  farmerName: string;
  farmName: string;
  location: string;
  fruitsId: string;
  language: Language;
  theme: Theme;
  activeTab: ActiveTab;
  viewMode: ViewMode;
  latitude: number;
  longitude: number;
  acreage: number;
  soilType: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  treeDensity: number;
  rainfallMm: number;
  cropVariety: string;
  irrigationStatus: boolean;
  solenoidAutoMode: boolean;
  copilotOpen: boolean;

  // Database status
  dbStats: DbStats;

  // Initial Auth Tab for SignIn view ('signin' | 'signup' | 'admin')
  initialAuthTab: "signin" | "signup" | "admin";
  setInitialAuthTab: (tab: "signin" | "signup" | "admin") => void;

  // Authenticated user session
  currentUser: {
    userId: number;
    name: string;
    role: string;
    token: string;
    phone?: string;
    taluk?: string;
  } | null;

  // GPS Location Status
  isGpsLocating: boolean;
  gpsStatusMessage: string | null;

  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  setViewMode: (mode: ViewMode) => void;
  setCopilotOpen: (open: boolean) => void;
  setIrrigationStatus: (status: boolean) => void;
  setSolenoidAutoMode: (auto: boolean) => void;
  setSoilParams: (params: Partial<FarmState>) => void;
  setDbStats: (stats: Partial<DbStats>) => void;
  setCurrentUser: (user: FarmState["currentUser"]) => void;
  setFarmerProfile: (profile: Partial<FarmState>) => void;
  logoutUser: () => void;
  locateGps: () => Promise<void>;
}

export const useFarmStore = create<FarmState>((set) => ({
  farmerName: "Shivappa Gowda",
  farmName: "Shrinivasa Farm",
  location: "Puttur · Dakshina Kannada",
  fruitsId: "KA-FRUITS-2026-9981",
  language: "kn",
  theme: "light",
  activeTab: "overview",
  viewMode: "app",
  latitude: 12.7687, // Puttur coordinates
  longitude: 75.2071,
  acreage: 4.2,
  soilType: "Laterite / red coastal",
  nitrogen: 110,
  phosphorus: 45,
  potassium: 135,
  ph: 5.8,
  treeDensity: 520,
  rainfallMm: 3120,
  cropVariety: "Arecanut · Mangala",
  irrigationStatus: false,
  solenoidAutoMode: true,
  copilotOpen: false,

  dbStats: {
    connected: true,
    dialect: "SQLite / PostGIS Engine",
    totalFarmers: 8,
    totalAcreage: 31.5,
    activeOutbreaks: 3,
    dbtDisbursed: 0.0,
    tables: {
      farmers: 8,
      parcels: 1,
      mandi_prices: 7,
      scan_records: 1,
      seed_hubs: 2,
    },
  },

  initialAuthTab: "signin",
  setInitialAuthTab: (initialAuthTab) => set({ initialAuthTab }),

  currentUser: {
    userId: 1,
    name: "Shivappa Gowda",
    role: "farmer",
    token: "demo-token-shivappa",
    phone: "9876543210",
    taluk: "Puttur",
  },

  // GPS State
  isGpsLocating: false,
  gpsStatusMessage: null,

  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  setActiveTab: (activeTab) => set({ activeTab, viewMode: "app" }),
  setViewMode: (viewMode) => set({ viewMode }),
  setCopilotOpen: (copilotOpen) => set({ copilotOpen }),
  setIrrigationStatus: (irrigationStatus) => set({ irrigationStatus }),
  setSolenoidAutoMode: (solenoidAutoMode) => set({ solenoidAutoMode }),
  setSoilParams: (params) => set((state) => ({ ...state, ...params })),
  setDbStats: (stats) =>
    set((state) => ({ dbStats: { ...state.dbStats, ...stats } })),
  setCurrentUser: (currentUser) => set({ currentUser }),
  setFarmerProfile: (profile) => set((state) => ({ ...state, ...profile })),
  logoutUser: () =>
    set({
      currentUser: null,
      viewMode: "signin",
    }),

  locateGps: async () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      set({ gpsStatusMessage: "Geolocation is not supported by your device/browser." });
      return;
    }

    set({ isGpsLocating: true, gpsStatusMessage: "Acquiring GPS fix from satellite/device..." });

    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const geo = await fetchReverseGeocode(lat, lng);
            if (geo) {
              set({
                latitude: lat,
                longitude: lng,
                location: `${geo.taluk} · ${geo.district}`,
                isGpsLocating: false,
                gpsStatusMessage: `GPS Locked: ${geo.taluk}, ${geo.district} (±${Math.round(position.coords.accuracy)}m)`,
              });
            } else {
              set({
                latitude: lat,
                longitude: lng,
                location: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
                isGpsLocating: false,
                gpsStatusMessage: `GPS Coordinates: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
              });
            }
          } catch {
            set({
              latitude: lat,
              longitude: lng,
              location: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
              isGpsLocating: false,
              gpsStatusMessage: `GPS Coordinates: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
            });
          }
          resolve();
        },
        (error) => {
          console.warn("GPS Geolocation error:", error);
          let userMsg = "Failed to acquire GPS location.";
          if (error.code === 1) userMsg = "Location access denied by user. Using regional fallback.";
          else if (error.code === 2) userMsg = "Position unavailable. Using regional fallback.";
          else if (error.code === 3) userMsg = "Location acquisition timed out.";

          set({
            isGpsLocating: false,
            gpsStatusMessage: userMsg,
          });
          resolve();
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
      );
    });
  },
}));
