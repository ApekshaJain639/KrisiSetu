"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Calendar,
  Package,
  TrendingUp,
  DollarSign,
  Info,
  Sliders,
  CheckCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";

export const YieldEstimateView: React.FC = () => {
  const { language, acreage, treeDensity, cropVariety, rainfallMm, setSoilParams } = useFarmStore();
  const t = useTranslation(language);

  const [fertilizerPlan, setFertilizerPlan] = useState("Recommended NPK + organic manure");

  // Dynamic calculations based on acreage and density
  const calculatedYieldPerAcre = ((treeDensity * 0.054) * (rainfallMm / 3100)).toFixed(1);
  const totalQuintals = (parseFloat(calculatedYieldPerAcre) * acreage).toFixed(1);
  const projectedReturnLakhs = ((parseFloat(totalQuintals) * 35800) / 100000).toFixed(1);

  const trajectoryData = [
    { season: "2022 Kharif", actual: 23.5, projected: null, lower: 21.0, upper: 25.5 },
    { season: "2023 Kharif", actual: 24.8, projected: null, lower: 22.5, upper: 26.5 },
    { season: "2024 Kharif", actual: 26.3, projected: null, lower: 24.5, upper: 28.0 },
    { season: "2025 Kharif", actual: 27.1, projected: null, lower: 25.2, upper: 29.0 },
    { season: "2026 Kharif (Est)", actual: null, projected: parseFloat(calculatedYieldPerAcre), lower: 26.5, upper: 30.5 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Row matching PDF page 22 top */}
      <div className="pb-2 border-b border-slate-200 dark:border-krishi-darkborder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              {t.planHarvestIncome}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t.yieldEstimate}
            </span>
          </div>
          <span className="text-[10px] font-bold bg-krishi-100 dark:bg-krishi-900/60 text-krishi-800 dark:text-krishi-300 px-2.5 py-0.5 rounded-full inline-block mt-1">
            {t.decisionSupport05}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {t.whatCouldHarvestLook}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            {t.yieldIntro}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1.5 rounded-xl text-xs font-bold self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.kharifProjection}</span>
        </div>
      </div>

      {/* Main 2-Column Split matching PDF page 22 top */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): "Season details" matching screenshot */}
        <div className="lg:col-span-5 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm space-y-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              INPUT VARIABLES
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.seasonDetails}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The closer the inputs, the better the estimate
            </p>
          </div>

          <div className="space-y-4">
            {/* Crop Variety */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.cropVariety}
              </label>
              <select
                value={cropVariety}
                onChange={(e) => setSoilParams({ cropVariety: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="Arecanut · Mangala">Arecanut · Mangala (High Yield)</option>
                <option value="Arecanut · Mohitnagar">Arecanut · Mohitnagar</option>
                <option value="Arecanut · South Kanara Local">Arecanut · South Kanara Local</option>
              </select>
            </div>

            {/* Farm Area & Tree Density Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Farm area</span>
                  <span className="text-emerald-700 font-extrabold">{acreage} ac</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={acreage}
                  onChange={(e) => setSoilParams({ acreage: parseFloat(e.target.value) })}
                  className="w-full accent-krishi-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{t.treeDensity}</span>
                  <span className="text-emerald-700 font-extrabold">{treeDensity}</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="650"
                  step="10"
                  value={treeDensity}
                  onChange={(e) => setSoilParams({ treeDensity: parseInt(e.target.value) })}
                  className="w-full accent-krishi-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Monsoon Rainfall */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{t.monsoonRainfall}</span>
                <span className="text-emerald-700 font-extrabold">{rainfallMm} mm</span>
              </div>
              <input
                type="range"
                min="2000"
                max="4500"
                step="50"
                value={rainfallMm}
                onChange={(e) => setSoilParams({ rainfallMm: parseInt(e.target.value) })}
                className="w-full accent-krishi-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Baseline Puttur normal is 3,120 mm</span>
            </div>

            {/* Fertilizer Plan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.fertilizerPlan}
              </label>
              <select
                value={fertilizerPlan}
                onChange={(e) => setFertilizerPlan(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="Recommended NPK + organic manure">Recommended NPK + organic manure</option>
                <option value="Chemical only (NPK 100:40:140)">Chemical only (NPK 100:40:140)</option>
                <option value="Natural farming / Jeevamrutha">Natural farming / Jeevamrutha</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Yield Stat + Trajectory Chart matching screenshot */}
        <div className="lg:col-span-7 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm space-y-5">
          {/* Top 2 Big Numbers matching page 22 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {t.estimatedYield}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {calculatedYieldPerAcre}
                </span>
                <span className="text-xs font-bold text-slate-500">Q / acre</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ml-auto">
                  ↗ 8.2%
                </span>
              </div>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium block mt-1">
                Total parcel: {totalQuintals} quintals
              </span>
            </div>

            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800/40">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {t.projectedReturn}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  ₹{projectedReturnLakhs}L
                </span>
                <span className="text-xs font-bold text-slate-500">gross</span>
              </div>
              <span className="text-[11px] text-blue-800 dark:text-blue-300 font-medium block mt-1">
                At ₹35,800/qtl current Chali modal
              </span>
            </div>
          </div>

          {/* FIVE-SEASON VIEW - Harvest Trajectory Chart */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                FIVE-SEASON VIEW
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.fiveSeasonView}
              </span>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData}>
                  <defs>
                    <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22703e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22703e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="season" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis domain={[15, 35]} tick={{ fontSize: 10, fill: "#64748b" }} unit=" Q" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0d2818",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#22703e"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#yieldGrad)"
                    name="Actual Yield"
                  />
                  <Area
                    type="monotone"
                    dataKey="projected"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    strokeDasharray="4 4"
                    fill="none"
                    name="Projected"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
