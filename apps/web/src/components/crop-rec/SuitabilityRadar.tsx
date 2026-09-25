"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface SuitabilityRadarProps {
  soilAffinity: number;
  climateMatch: number;
  npkAffinity: number;
  waterSecurity: number;
}

export const SuitabilityRadar: React.FC<SuitabilityRadarProps> = ({
  soilAffinity,
  climateMatch,
  npkAffinity,
  waterSecurity,
}) => {
  const data = [
    { subject: "Soil Chemistry", A: soilAffinity, fullMark: 100 },
    { subject: "Climate Match", A: climateMatch, fullMark: 100 },
    { subject: "NPK Affinity", A: npkAffinity, fullMark: 100 },
    { subject: "Water Security", A: waterSecurity, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#1e293b", fontSize: 11, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
          <Radar
            name="Suitability"
            dataKey="A"
            stroke="#22703e"
            fill="#2d8a4e"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
