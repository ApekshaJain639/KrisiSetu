"use client";

import React, { useState } from "react";
import {
  Eye,
  Download,
  Share2,
  MapPin,
  Leaf,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Waves,
  ShieldCheck,
} from "lucide-react";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";

export const NdviNutrientsView: React.FC = () => {
  const { language, farmName, location, acreage } = useFarmStore();
  const t = useTranslation(language);

  const [activeLayer, setActiveLayer] = useState<"ndvi" | "true" | "moisture">("ndvi");
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number; val: number; zone: string } | null>({
    row: 3,
    col: 2,
    val: 0.52,
    zone: "Zone 3 (Potassium Deficit)",
  });

  // Grid tiles representing the Sentinel-2 multispectral resolution of Shrinivasa Farm Plot A
  const gridCells = [
    [0.85, 0.88, 0.84, 0.82, 0.79],
    [0.82, 0.86, 0.78, 0.75, 0.71],
    [0.79, 0.77, 0.68, 0.62, 0.58],
    [0.76, 0.72, 0.52, 0.55, 0.64],
    [0.81, 0.83, 0.79, 0.75, 0.78],
  ];

  const getCellColor = (val: number) => {
    if (activeLayer === "true") {
      return "bg-[#386641]";
    }
    if (activeLayer === "moisture") {
      if (val > 0.75) return "bg-blue-600";
      if (val > 0.6) return "bg-cyan-500";
      return "bg-amber-500";
    }
    // NDVI Colors matching PDF page 21 screenshot
    if (val >= 0.8) return "bg-[#2d6a4f]"; // deep green
    if (val >= 0.7) return "bg-[#52b788]"; // vibrant green
    if (val >= 0.6) return "bg-[#95d5b2]"; // light green
    if (val >= 0.5) return "bg-[#f59e0b]"; // amber/yellow stress
    return "bg-[#ef4444]"; // red stress
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Row matching PDF page 21 */}
      <div className="pb-2 border-b border-slate-200 dark:border-krishi-darkborder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              {t.seeCanopyNeeds}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t.ndviNutrients}
            </span>
          </div>
          <span className="text-[10px] font-bold bg-krishi-100 dark:bg-krishi-900/60 text-krishi-800 dark:text-krishi-300 px-2.5 py-0.5 rounded-full inline-block mt-1">
            {t.decisionSupport04}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {t.readTheGreen}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            {t.ndviIntro}
          </p>
        </div>

        <button
          onClick={() => alert("Report downloaded: Shrinivasa_PlotA_NDVI_12Jun2024.pdf")}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-krishi-700 hover:bg-krishi-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.saveReport}</span>
        </button>
      </div>

      {/* 3 Metric Summary Cards matching PDF page 21 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-krishi-darkcard p-5 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">
              {t.avgNdvi}
            </span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              0.76 <span className="text-xs font-semibold text-emerald-600">healthy</span>
            </span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              ↗ 6.4%
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-krishi-darkcard p-5 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">
              {t.healthyCanopy}
            </span>
            <span className="text-xs font-bold text-slate-400">Target &gt;60%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              65%
            </span>
            <span className="text-[11px] text-slate-500">2.73 acres in Zone 1</span>
          </div>
        </div>

        <div className="bg-white dark:bg-krishi-darkcard p-5 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">
              {t.fieldScanDate}
            </span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              12 Jun 2024
            </span>
            <span className="text-[10px] text-slate-500">Sentinel-2A Multispectral</span>
          </div>
        </div>
      </div>

      {/* Main Field Map & Three Zones Breakdown matching PDF page 21 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Sentinel-2 Field View Grid */}
        <div className="lg:col-span-7 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                {t.sentinelView}
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Geodesic Polygon: {acreage} acres · 1.70 ha · 524m Perimeter
              </p>
            </div>

            {/* Layer Switcher Pills matching screenshot */}
            <div className="flex items-center bg-slate-100 dark:bg-krishi-darkbg p-1 rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-bold">
              <button
                onClick={() => setActiveLayer("ndvi")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeLayer === "ndvi"
                    ? "bg-krishi-700 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                NDVI layer
              </button>
              <button
                onClick={() => setActiveLayer("true")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeLayer === "true"
                    ? "bg-krishi-700 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                True Color
              </button>
              <button
                onClick={() => setActiveLayer("moisture")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeLayer === "moisture"
                    ? "bg-krishi-700 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Moisture
              </button>
            </div>
          </div>

          {/* Interactive Satellite Parcel Grid matching screenshot on page 21 */}
          <div className="relative p-4 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center overflow-hidden">
            <div className="grid grid-cols-5 gap-1.5 w-full max-w-md aspect-square">
              {gridCells.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
                  return (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      onClick={() =>
                        setSelectedCell({
                          row: rIdx,
                          col: cIdx,
                          val,
                          zone:
                            val >= 0.8
                              ? "Zone 1: Vigorous Canopy"
                              : val >= 0.6
                              ? "Zone 2: Moderate Canopy"
                              : "Zone 3: Potassium Deficit",
                        })
                      }
                      className={`relative rounded-md transition-all duration-200 flex items-center justify-center text-[10px] font-bold text-white/90 shadow-sm ${getCellColor(
                        val
                      )} ${
                        isSelected
                          ? "ring-4 ring-white scale-105 z-10 animate-pulseFast"
                          : "hover:scale-105 hover:opacity-90"
                      }`}
                      title={`Row ${rIdx + 1}, Col ${cIdx + 1}: ${val} NDVI`}
                    >
                      <span>{val}</span>
                      {rIdx === 3 && cIdx === 2 && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-400"></span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Red sensor target dot indicator matching page 21 */}
            <div className="mt-3 flex items-center gap-2 text-[11px] text-white/80 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span>Target Pin: Sector A-3 (Lat 12.7687, Long 75.2071)</span>
            </div>
          </div>

          {selectedCell && (
            <div className="p-3 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Sector [{selectedCell.row + 1}, {selectedCell.col + 1}]: {selectedCell.zone}
                </span>
                <span className="text-[11px] text-slate-500">
                  Multispectral NDVI: {selectedCell.val} · Nitrogen: 110 kg/ha · Potassium: 95 kg/ha (Low)
                </span>
              </div>
              <span className="font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded">
                Action: 25kg MOP
              </span>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): "FIELD BREAKDOWN - Three zones to know" matching screenshot */}
        <div className="lg:col-span-5 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              FIELD BREAKDOWN
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.fieldBreakdown}
            </h3>

            {/* 3 Horizontal Zone Bars matching screenshot */}
            <div className="space-y-4 mt-5">
              {/* Zone 1 */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#2d6a4f]"></span>
                    {t.zoneVigorous}
                  </span>
                  <span>0.80 - 0.90 NDVI</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#2d6a4f] h-full rounded-full" style={{ width: "65%" }}></div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Dense canopy, optimal chlorophyll absorption, no nutrient stress.
                </p>
              </div>

              {/* Zone 2 */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                    {t.zoneModerate}
                  </span>
                  <span>0.60 - 0.79 NDVI</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: "25%" }}></div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Moderate vigor, intercropped pepper juvenile vines canopy.
                </p>
              </div>

              {/* Zone 3 */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                    {t.zoneStress}
                  </span>
                  <span>0.45 - 0.59 NDVI</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#ef4444] h-full rounded-full" style={{ width: "10%" }}></div>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold mt-1">
                  Requires 25kg MOP (60% K) top-dressing to prevent bunch-drop.
                </p>
              </div>
            </div>
          </div>

          {/* Central Ground Water Board (CGWB) Telemetry Card */}
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.aquiferStatus}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
              Belthangady/Puttur sub-basin is classified as <strong>Safe</strong> under CGWB 2024 national assessment with sufficient recharge buffer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
