"use client";

import React from "react";
import {
  Leaf,
  Droplets,
  CloudRain,
  Package,
  TrendingUp,
  ScanLine,
  Sprout,
  Compass,
  ArrowUpRight,
  Wind,
  Cloud,
  Clock,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Settings,
  MapPin,
  Loader2,
} from "lucide-react";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";
import { fetchCurrentWeather, CurrentWeatherReport } from "@/lib/db-client";

export const OverviewView: React.FC = () => {
  const {
    language,
    farmerName,
    farmName,
    location,
    latitude,
    longitude,
    isGpsLocating,
    gpsStatusMessage,
    locateGps,
    setActiveTab,
  } = useFarmStore();
  const t = useTranslation(language);

  const [currentWeather, setCurrentWeather] = React.useState<CurrentWeatherReport | null>(null);
  const [loadingWeather, setLoadingWeather] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    async function loadWeather() {
      setLoadingWeather(true);
      const report = await fetchCurrentWeather(latitude || 12.7687, longitude || 75.2071);
      if (isMounted && report) {
        setCurrentWeather(report);
      }
      if (isMounted) setLoadingWeather(false);
    }
    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Row matching PDF page 18 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-krishi-darkborder">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.todayDate}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.greeting}
          </h1>
        </div>

        <button
          onClick={() => setActiveTab("aiot-lab")}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-krishi-darkcard border border-slate-200 dark:border-krishi-darkborder rounded-xl hover:bg-slate-50 dark:hover:bg-krishi-darkhover transition-colors shadow-sm"
        >
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.manageFarm}</span>
        </button>
      </div>

      {/* Farm Subheader & Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-white to-krishi-50/50 dark:from-krishi-darkcard dark:to-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-krishi-700 dark:text-krishi-300">
              {farmName} · {location}
            </span>
            <span className="text-[10px] bg-krishi-100 dark:bg-krishi-900/60 text-krishi-800 dark:text-krishi-300 px-2 py-0.5 rounded-full font-bold">
              GPS: {latitude?.toFixed(4)}°N, {longitude?.toFixed(4)}°E
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {t.farmAtAGlance}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            {t.farmGlanceDesc}
          </p>
        </div>

        {/* Real-time GPS Location Trigger */}
        <div className="shrink-0 flex flex-col sm:items-end gap-1">
          <button
            onClick={() => locateGps()}
            disabled={isGpsLocating}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              isGpsLocating
                ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                : "bg-krishi-700 hover:bg-krishi-800 text-white"
            }`}
          >
            {isGpsLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-krishi-gold" />
            )}
            <span>
              {isGpsLocating
                ? (language === "kn" ? "ಜಿಪಿಎಸ್ ಶೋಧಿಸಲಾಗುತ್ತಿದೆ..." : "Detecting GPS...")
                : (language === "kn" ? "📍 ನನ್ನ ಸ್ಥಳ ಪಡೆಯಿರಿ" : "📍 Use My GPS Location")}
            </span>
          </button>
          {gpsStatusMessage && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {gpsStatusMessage}
            </span>
          )}
        </div>
      </div>

      {/* 4 Metric KPI Cards Row matching PDF page 18 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Canopy Health */}
        <div className="bg-white dark:bg-krishi-darkcard p-4 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">
              {t.canopyHealth}
            </span>
            <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Leaf className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              0.76 <span className="text-xs font-semibold text-slate-500">NDVI</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              1.4%
            </span>
          </div>
        </div>

        {/* Card 2: Soil Moisture */}
        <div className="bg-white dark:bg-krishi-darkcard p-4 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">
              {t.soilMoisture}
            </span>
            <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
              <Droplets className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              58%
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              2.1%
            </span>
          </div>
        </div>

        {/* Card 3: Rain Next 24H */}
        <div className="bg-white dark:bg-krishi-darkcard p-4 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">
              {t.rainNext24h}
            </span>
            <span className="p-1.5 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-lg">
              <CloudRain className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              68%
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              42 mm total
            </span>
          </div>
        </div>

        {/* Card 4: Expected Harvest */}
        <div className="bg-white dark:bg-krishi-darkcard p-4 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">
              {t.expectedHarvest}
            </span>
            <span className="p-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              28.5 <span className="text-xs font-semibold text-slate-500">Q/acre</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              4.2%
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section matching PDF page 18 bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): "START HERE - What would you like to check?" */}
        <div className="lg:col-span-2 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
          <div className="mb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-400">
              {t.startHere}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.whatToCheck}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Action 1: Scan a leaf */}
            <button
              onClick={() => setActiveTab("leaf-scan")}
              className="p-4 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder hover:border-krishi-500 dark:hover:border-krishi-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ScanLine className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-krishi-700 dark:group-hover:text-krishi-400">
                  {t.scanALeaf}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {t.scanALeafDesc}
                </span>
              </div>
            </button>

            {/* Action 2: Check NDVI */}
            <button
              onClick={() => setActiveTab("ndvi")}
              className="p-4 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder hover:border-krishi-500 dark:hover:border-krishi-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-krishi-700 dark:group-hover:text-krishi-400">
                  {t.checkNdvi}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {t.checkNdviDesc}
                </span>
              </div>
            </button>

            {/* Action 3: Get crop guide */}
            <button
              onClick={() => setActiveTab("crop-guide")}
              className="p-4 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder hover:border-krishi-500 dark:hover:border-krishi-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-krishi-700 dark:group-hover:text-krishi-400">
                  {t.getCropGuide}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {t.getCropGuideDesc}
                </span>
              </div>
            </button>

            {/* Action 4: View markets */}
            <button
              onClick={() => setActiveTab("market")}
              className="p-4 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder hover:border-krishi-500 dark:hover:border-krishi-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-krishi-700 dark:group-hover:text-krishi-400">
                  {t.viewMarkets}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {t.viewMarketsDesc}
                </span>
              </div>
            </button>
          </div>

          {/* Today's 3 Urgent Actions Alert Box */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-krishi-darkborder">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Priority Actions Before Rain
            </span>
            <div className="space-y-2">
              <div
                onClick={() => setActiveTab("risk-forecast")}
                className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 flex items-center justify-between cursor-pointer hover:bg-amber-100/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-amber-800 dark:text-amber-300">1</span>
                  <p className="text-xs text-amber-900 dark:text-amber-200">
                    Apply prophylactic 1% Bordeaux mixture on Arecanut bunches 1 & 2 before Thursday downpour.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              </div>

              <div
                onClick={() => setActiveTab("ndvi")}
                className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 flex items-center justify-between cursor-pointer hover:bg-blue-100/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-blue-800 dark:text-blue-300">2</span>
                  <p className="text-xs text-blue-900 dark:text-blue-200">
                    Plot A Zone 3 indicates potassium stress (0.52 NDVI). Top-dress 25 kg MOP.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
              </div>

              <div
                onClick={() => setActiveTab("market")}
                className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 flex items-center justify-between cursor-pointer hover:bg-emerald-100/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">3</span>
                  <p className="text-xs text-emerald-900 dark:text-emerald-200">
                    Shivamogga APMC offering ₹40,000/qtl for Chali. Net bonus ₹18,500 after freight deductions.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: "MICROCLIMATE - Field conditions" matching PDF page 18 */}
        <div className="bg-[#0f2d1e] text-white p-6 rounded-2xl border border-[#1b4a2e] shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300/80">
                {t.microclimate}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold text-emerald-200">
                  Open-Meteo LIVE
                </span>
              </div>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              {t.fieldConditions} · {location.split("·")[0]?.trim() || "Puttur"}
            </h3>

            <div className="mt-6">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
                {currentWeather ? Math.round(currentWeather.temperature_c) : 27}°C
                <span className="text-xs font-normal text-emerald-300/80">
                  ({(latitude ?? 12.77).toFixed(2)}°N)
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-200 mt-1 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-emerald-300" />
                {currentWeather
                  ? (language === "kn" ? currentWeather.weather_description_kn : currentWeather.weather_description)
                  : t.lightRainPossible}
              </p>
            </div>
          </div>

          {/* 3 Metrics Row */}
          <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-[#1b4a2e] text-center">
            <div className="bg-[#143a25] p-2.5 rounded-xl border border-[#215736]">
              <Droplets className="w-4 h-4 text-emerald-300 mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">
                {currentWeather ? Math.round(currentWeather.relative_humidity_pct) : 82}%
              </span>
              <span className="text-[9px] text-emerald-200/70 block">{t.humidity}</span>
            </div>

            <div className="bg-[#143a25] p-2.5 rounded-xl border border-[#215736]">
              <Cloud className="w-4 h-4 text-emerald-300 mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">
                {currentWeather ? `${currentWeather.precipitation_mm} mm` : "1.2 mm"}
              </span>
              <span className="text-[9px] text-emerald-200/70 block">
                {language === "kn" ? "ಮಳೆ ಪ್ರಮಾಣ" : "Precipitation"}
              </span>
            </div>

            <div className="bg-[#143a25] p-2.5 rounded-xl border border-[#215736]">
              <Wind className="w-4 h-4 text-emerald-300 mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">
                {currentWeather ? Math.round(currentWeather.wind_speed_kmh) : 9} km/h
              </span>
              <span className="text-[9px] text-emerald-200/70 block">{t.windSpeed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
