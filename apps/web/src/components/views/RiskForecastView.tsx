"use client";

import React, { useState } from "react";
import {
  CloudRain,
  AlertTriangle,
  Droplets,
  Wind,
  Thermometer,
  ShieldAlert,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";
import { fetchWeatherAdvisory, fetchCurrentWeather, CurrentWeatherReport } from "@/lib/db-client";

export const RiskForecastView: React.FC = () => {
  const { language, latitude, longitude, location, isGpsLocating, locateGps, gpsStatusMessage } = useFarmStore();
  const t = useTranslation(language);

  const [backendAdvisory, setBackendAdvisory] = useState<any>(null);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherReport | null>(null);

  // Fetch live weather & spore advisory from backend & Open-Meteo
  React.useEffect(() => {
    let active = true;
    async function loadWeather() {
      const [adv, curr] = await Promise.all([
        fetchWeatherAdvisory(latitude || 12.7687, longitude || 75.2071),
        fetchCurrentWeather(latitude || 12.7687, longitude || 75.2071),
      ]);
      if (active) {
        if (adv) setBackendAdvisory(adv);
        if (curr) setCurrentWeather(curr);
      }
    }
    loadWeather();
    return () => {
      active = false;
    };
  }, [latitude, longitude]);

  const humidityData = [
    { day: "Mon", humidity: 76, rain: 4, temp: 28 },
    { day: "Tue", humidity: 82, rain: 12, temp: 27 },
    { day: "Wed", humidity: 86, rain: 22, temp: 26 },
    { day: "Thu (Peak)", humidity: 94, rain: 42, temp: 25 },
    { day: "Fri", humidity: 89, rain: 18, temp: 26 },
    { day: "Sat", humidity: 80, rain: 6, temp: 27 },
    { day: "Sun", humidity: 74, rain: 2, temp: 29 },
  ];

  const talukData = [
    { name: "Puttur", risk: 78, level: "High", rain: "42 mm" },
    { name: "Sullia", risk: 82, level: "High", rain: "48 mm" },
    { name: "Belthangady", risk: 64, level: "Moderate", rain: "34 mm" },
    { name: "Bantwal", risk: 59, level: "Moderate", rain: "28 mm" },
    { name: "Mangaluru", risk: 45, level: "Low", rain: "18 mm" },
  ];

  const sprayHours = [
    { hour: "06:00 AM", score: 40, status: "Dew wetness" },
    { hour: "09:00 AM", score: 65, status: "Moderate" },
    { hour: "01:00 PM", score: 85, status: "Optimal window" },
    { hour: "03:00 PM", score: 92, status: "Prime spraying window" },
    { hour: "05:30 PM", score: 60, status: "Wind picks up" },
    { hour: "08:00 PM", score: 20, status: "Rain wash-off risk" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Row matching PDF page 20 bottom */}
      <div className="pb-2 border-b border-slate-200 dark:border-krishi-darkborder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              {t.diseaseForecasting}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t.riskForecast}
            </span>
          </div>
          <span className="text-[10px] font-bold bg-krishi-100 dark:bg-krishi-900/60 text-krishi-800 dark:text-krishi-300 px-2.5 py-0.5 rounded-full inline-block mt-1">
            {t.decisionSupport03}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {t.stayAheadDisease}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            {t.riskForecastIntro}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => locateGps()}
            disabled={isGpsLocating}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm border ${
              isGpsLocating
                ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                : "bg-white dark:bg-krishi-darkcard border-slate-200 dark:border-krishi-darkborder text-slate-700 dark:text-slate-200 hover:border-krishi-500"
            }`}
          >
            {isGpsLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-krishi-600" />
            )}
            <span>{isGpsLocating ? "Locating..." : `📍 ${location.split("·")[0]?.trim() || "Puttur"}`}</span>
          </button>

          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 px-3 py-1.5 rounded-xl text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>72-hr Spore Outbreak Window Active</span>
          </div>
        </div>
      </div>

      {/* Open-Meteo Live Weather Banner */}
      <div className="bg-white dark:bg-krishi-darkcard p-3.5 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {currentWeather ? `${Math.round(currentWeather.temperature_c)}°C` : "27°C"}
              </span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {currentWeather
                  ? (language === "kn" ? currentWeather.weather_description_kn : currentWeather.weather_description)
                  : "Light rain possible"}
              </span>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full font-bold">
                Open-Meteo WMO #{currentWeather?.weather_code ?? 61}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Station coordinates: {latitude?.toFixed(4)}°N, {longitude?.toFixed(4)}°E · ICAR West Coast Agromet
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-medium">
          <span className="flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            {currentWeather ? `${Math.round(currentWeather.relative_humidity_pct)}%` : "82%"} {t.humidity}
          </span>
          <span className="flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-teal-500" />
            {currentWeather ? `${Math.round(currentWeather.wind_speed_kmh)} km/h` : "9 km/h"} {t.windSpeed}
          </span>
          <span className="flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
            {currentWeather ? `${currentWeather.surface_pressure_hpa} hPa` : "1012 hPa"}
          </span>
        </div>
      </div>

      {/* Main 2-Column Split matching PDF page 20 bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): "YOUR FARM - NEXT 7 DAYS / High risk window" */}
        <div className="lg:col-span-5 bg-[#0f2d1e] text-white p-6 rounded-2xl border border-[#1b4a2e] shadow-md flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300/80">
                {t.yourFarmNext7Days}
              </span>
              <span className="px-2.5 py-0.5 bg-rose-500/20 border border-rose-400/40 text-rose-300 text-[10px] font-bold rounded-full">
                ALERT
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-rose-300 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>{t.highRiskWindow}</span>
            </div>

            {/* Big Risk Number */}
            <div className="mt-4 flex items-baseline gap-4">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                78%
              </span>
              <div>
                <span className="text-sm font-bold text-amber-300 block">
                  {t.kolerogaRiskPeak}
                </span>
                <span className="text-[11px] text-emerald-200/80 block mt-0.5">
                  Sustained leaf wetness &gt; 85%
                </span>
              </div>
            </div>
          </div>

          {/* 3 Metric Pills at bottom of dark card matching screenshot */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#1b4a2e] text-center">
            <div className="bg-[#143a25] p-3 rounded-xl border border-[#215736]">
              <span className="text-base font-extrabold text-white block">42 mm</span>
              <span className="text-[10px] text-emerald-200/70 block mt-0.5">{t.rainExpected}</span>
            </div>

            <div className="bg-[#143a25] p-3 rounded-xl border border-[#215736]">
              <span className="text-base font-extrabold text-white block">88%</span>
              <span className="text-[10px] text-emerald-200/70 block mt-0.5">{t.humidity}</span>
            </div>

            <div className="bg-[#143a25] p-3 rounded-xl border border-[#215736]">
              <span className="text-base font-extrabold text-white block">Low</span>
              <span className="text-[10px] text-emerald-200/70 block mt-0.5">{t.airflow}</span>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Weather Trends & Humidity Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                WEATHER TRENDS
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.weatherHumidityTrend}
              </h3>
            </div>
            <span className="text-xs bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-bold px-2 py-0.5 rounded">
              Spore Danger Zone: &gt;85%
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={humidityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d2818",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <ReferenceLine
                  y={85}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: "Spore Trigger (85%)", fill: "#ef4444", fontSize: 10, position: "top" }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#22703e"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#22703e" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/30 text-xs text-amber-900 dark:text-amber-200">
            <strong>Kisan Alert: </strong>
            Thursday shows humidity exceeding 94% with 42mm rain. Bordeaux spray must be completed before 4:00 PM Wednesday to allow adhesive film setting.
          </div>
        </div>
      </div>

      {/* 4 Agricultural Hazard Gauges matching technical specification */}
      <div className="bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-krishi-600" />
          4 Agricultural Micro-Hazard Gauges (14-Day Simulation)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {/* Gauge 1 */}
          <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
            <span className="text-xl">🦠</span>
            <span className="text-xs font-bold text-rose-950 dark:text-rose-200 block mt-1">
              Fungal Blight / Koleroga
            </span>
            <span className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-2 block">
              78%
            </span>
            <span className="text-[10px] text-rose-600 font-bold uppercase mt-1 block">
              CRITICAL HAZARD
            </span>
          </div>

          {/* Gauge 2 */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-xl">🌡️</span>
            <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 block mt-1">
              Heat Stress & Frost
            </span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-2 block">
              18%
            </span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase mt-1 block">
              OPTIMAL CANOPY
            </span>
          </div>

          {/* Gauge 3 */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
            <span className="text-xl">💧</span>
            <span className="text-xs font-bold text-blue-950 dark:text-blue-200 block mt-1">
              Soil Moisture Deficit
            </span>
            <span className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-2 block">
              12%
            </span>
            <span className="text-[10px] text-blue-600 font-bold uppercase mt-1 block">
              WELL RECHARGED
            </span>
          </div>

          {/* Gauge 4 */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
            <span className="text-xl">⛈️</span>
            <span className="text-xs font-bold text-amber-950 dark:text-amber-200 block mt-1">
              Downpour & Lodging
            </span>
            <span className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-2 block">
              62%
            </span>
            <span className="text-[10px] text-amber-600 font-bold uppercase mt-1 block">
              ELEVATED WIND
            </span>
          </div>
        </div>
      </div>

      {/* District Taluk Risk View & Spraying Window */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Taluk risk view matching PDF page 20 */}
        <div className="bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            ACROSS THE DISTRICT
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            {t.talukRiskView}
          </h3>

          <div className="space-y-2.5">
            {talukData.map((taluk) => (
              <div
                key={taluk.name}
                className="p-3 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {taluk.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Est. rainfall: {taluk.rain}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        taluk.risk >= 75
                          ? "bg-rose-500"
                          : taluk.risk >= 50
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${taluk.risk}%` }}
                    ></div>
                  </div>
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                      taluk.level === "High"
                        ? "bg-rose-100 text-rose-800"
                        : taluk.level === "Moderate"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {taluk.risk}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Foliar Spraying Window Score */}
        <div className="bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              OPERATIONAL WINDOW
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              {t.foliarSprayScore}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Hourly rating to avoid rain wash-off or high wind drift
            </p>

            <div className="space-y-2">
              {sprayHours.map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {h.hour}
                  </span>
                  <span className="text-[11px] text-slate-500">{h.status}</span>
                  <span
                    className={`font-black px-2 py-0.5 rounded text-[11px] ${
                      h.score >= 80
                        ? "bg-emerald-100 text-emerald-800"
                        : h.score >= 50
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {h.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{t.irrigationAdvice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
