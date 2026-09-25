"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, AlertTriangle, Activity } from "lucide-react";

interface TimelineComparisonProps {
  initialSeverity: number;
  followupSeverity: number;
  daysElapsed: number;
  cropName: string;
  diseaseName: string;
}

export const TimelineComparison: React.FC<TimelineComparisonProps> = ({
  initialSeverity,
  followupSeverity,
  daysElapsed,
  cropName,
  diseaseName,
}) => {
  const delta = followupSeverity - initialSeverity;
  const isImproving = delta <= -5;
  const isWorsening = delta >= 5;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-krishi-600" />
            Longitudinal Crop Health Progression
          </h3>
          <p className="text-xs text-slate-600">
            {cropName} · {diseaseName} ({daysElapsed} Days Interval)
          </p>
        </div>

        {/* Trajectory Badge */}
        <div>
          {isImproving ? (
            <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              IMPROVING ({delta}%)
            </span>
          ) : isWorsening ? (
            <span className="flex items-center gap-1.5 bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-full border border-red-300">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              WORSENING (+{delta}%)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-300">
              STATIC / UNCERTAIN ({delta}%)
            </span>
          )}
        </div>
      </div>

      {/* Visual Progression Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Day 0 */}
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-center">
          <span className="text-xs font-bold text-slate-500 block mb-1">VISIT 1 (DAY 0)</span>
          <div className="w-full h-36 bg-slate-200 rounded flex items-center justify-center text-xs text-slate-500 font-medium">
            [Initial Leaf Photo: Acute Blight]
          </div>
          <div className="mt-3 flex justify-between items-center px-2">
            <span className="text-xs font-semibold text-slate-700">Lesion Necrosis:</span>
            <span className="text-sm font-extrabold text-red-600">{initialSeverity}% DSI</span>
          </div>
        </div>

        {/* Day 4 */}
        <div className="border border-slate-200 rounded-lg p-3 bg-emerald-50/50 text-center">
          <span className="text-xs font-bold text-emerald-700 block mb-1">VISIT 2 (DAY {daysElapsed})</span>
          <div className="w-full h-36 bg-emerald-100 rounded flex items-center justify-center text-xs text-emerald-700 font-medium">
            [Follow-up Leaf Photo: Bordeaux Active]
          </div>
          <div className="mt-3 flex justify-between items-center px-2">
            <span className="text-xs font-semibold text-slate-700">Lesion Necrosis:</span>
            <span className="text-sm font-extrabold text-emerald-700">{followupSeverity}% DSI</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
        <span className="font-bold text-slate-900">Agronomic Conclusion: </span>
        {isImproving
          ? "Fungicide formulation arrested sporulation. Continue the current Bordeaux regimen for 5 more days."
          : "Treatment failure suspected. Escalation notification enqueued for KVK scientist."}
      </div>
    </div>
  );
};
