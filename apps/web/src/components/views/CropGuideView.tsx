"use client";

import React, { useState } from "react";
import {
  Compass,
  Sprout,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Droplets,
  DollarSign,
  Package,
  HelpCircle,
} from "lucide-react";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";
import { SuitabilityRadar } from "@/components/crop-rec/SuitabilityRadar";
import { FertilizerBagCard } from "@/components/crop-rec/FertilizerBagCard";
import { fetchCropRecommendations } from "@/lib/db-client";

export const CropGuideView: React.FC = () => {
  const {
    language,
    location,
    soilType,
    ph,
    acreage,
    nitrogen,
    phosphorus,
    potassium,
    latitude,
    longitude,
    setSoilParams,
    setActiveTab,
  } = useFarmStore();

  const t = useTranslation(language);

  const [priority, setPriority] = useState<"income" | "water" | "risk">("income");
  const [selectedCrop, setSelectedCrop] = useState<string>("areca-pepper");
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [detectedZone, setDetectedZone] = useState<string>("West Coast Plains and Ghats Region");

  // Call real backend MCDA engine on mount
  React.useEffect(() => {
    async function loadBackendMCDA() {
      const res = await fetchCropRecommendations({
        nitrogen: nitrogen || 110,
        phosphorus: phosphorus || 45,
        potassium: potassium || 135,
        ph: ph || 5.8,
        soil_texture: "Laterite",
        acreage: acreage || 4.2,
        latitude: latitude || 12.7687,
        longitude: longitude || 75.2071,
      });
      if (res?.detected_agro_climatic_zone) {
        setDetectedZone(res.detected_agro_climatic_zone);
      }
    }
    loadBackendMCDA();
  }, [nitrogen, phosphorus, potassium, ph, acreage, latitude, longitude]);

  const crops = [
    {
      id: "areca-pepper",
      name: "Arecanut + pepper",
      nameKn: "ಅಡಿಕೆ + ಕರಿಮೆಣಸು ಮಿಶ್ರಬೆಳೆ",
      match: 94,
      desc: "Best match for your laterite soil and current rainfall",
      descKn: "ನಿಮ್ಮ ಕೆಂಪು ಜಲ್ಲಿ ಮಣ್ಣಿಗೆ ಮತ್ತು ಪುತ್ತೂರಿನ ಮಳೆಗೆ ಅತ್ಯಂತ ಸೂಕ್ತ ಹೊಂದಾಣಿಕೆ",
      netIncome: "₹2.8L",
      water: "Medium",
      waterKn: "ಮಧ್ಯಮ",
      urea: 3.8,
      dap: 1.7,
      mop: 2.1,
      radar: { soil: 96, climate: 92, npk: 88, water: 90 },
      cultivars: "Mangala / Mohitnagar / Panniyur-1 Pepper",
      sowing: { earliest: "01 Jun", optimal: "15 Jun - 25 Jun", cutoff: "15 Jul" },
      companion: "Cowpea green manure (N-fixing) + Marigold border (nematode control)",
    },
    {
      id: "coconut-cocoa",
      name: "Coconut + cocoa",
      nameKn: "ತೆಂಗು + ಕೋಕೋ ಮಿಶ್ರತೋಟ",
      match: 88,
      desc: "Steady option with lower weekly water demand",
      descKn: "ಕಡಿಮೆ ನೀರಿನ ಬಳಕೆ ಮತ್ತು ವರ್ಷವಿಡೀ ಸ್ಥಿರ ಆದಾಯ ನೀಡುವ ಆಯ್ಕೆ",
      netIncome: "₹1.9L",
      water: "Low-Medium",
      waterKn: "ಕಡಿಮೆ-ಮಧ್ಯಮ",
      urea: 2.5,
      dap: 1.2,
      mop: 3.0,
      radar: { soil: 85, climate: 90, npk: 82, water: 88 },
      cultivars: "Arasampatti / DxA Hybrid / Forastero Cocoa",
      sowing: { earliest: "15 May", optimal: "05 Jun - 20 Jun", cutoff: "30 Jun" },
      companion: "Stylosanthes leguminous cover crop",
    },
    {
      id: "paddy-basmati",
      name: "Paddy (MO-4 / Jaya)",
      nameKn: "ಭತ್ತ (ಎಂಒ-೪ / ಜಯ / ಬಾಸುಮತಿ)",
      match: 82,
      desc: "Traditional wetland rotation crop breaking disease cycles",
      descKn: "ರೋಗ ಚಕ್ರಗಳನ್ನು ಮುರಿಯಲು ಹಾಗೂ ಮಳೆಗಾಲದ ಜಲಾವೃತ ಗದ್ದೆಗಳಿಗೆ ಸೂಕ್ತ",
      netIncome: "₹1.2L",
      water: "High",
      waterKn: "ಹೆಚ್ಚು",
      urea: 2.0,
      dap: 1.5,
      mop: 1.0,
      radar: { soil: 80, climate: 85, npk: 78, water: 95 },
      cultivars: "MO-4 (Bhadra), Jaya, Basmati 1509",
      sowing: { earliest: "25 May", optimal: "10 Jun - 20 Jun", cutoff: "05 Jul" },
      companion: "Green gram (Phaseolus aureus) post-harvest rotation",
    },
  ];

  const currentCrop = crops.find((c) => c.id === selectedCrop) || crops[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Breadcrumb & Decision Support Header matching PDF page 19 */}
      <div className="pb-2 border-b border-slate-200 dark:border-krishi-darkborder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              {t.planNextSeason}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t.cropGuide}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <span className="text-[10px] font-bold bg-krishi-100 dark:bg-krishi-900/60 text-krishi-800 dark:text-krishi-300 px-2.5 py-0.5 rounded-full inline-block">
              {t.decisionSupport01}
            </span>
            <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
              {detectedZone} · Live MCDA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {t.whatShouldYouGrow}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
            {t.cropGuideIntro}
          </p>
        </div>

        {/* 2-Step indicator matching screenshot */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-krishi-darkbg p-1.5 rounded-xl border border-slate-200 dark:border-krishi-darkborder self-start sm:self-auto text-xs font-bold">
          <span className="px-2.5 py-1 bg-white dark:bg-krishi-darkcard text-slate-900 dark:text-white rounded-lg shadow-sm">
            1. Farm context
          </span>
          <span className="px-2.5 py-1 text-slate-500 dark:text-slate-400">
            2. Results
          </span>
        </div>
      </div>

      {/* Main 2-Column Split matching PDF page 19 bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): "Your farm context" Form */}
        <div className="lg:col-span-5 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-krishi-600"></span>
              {t.yourFarmContext}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.farmContextDesc}
            </p>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.whereIsFarm}
            </label>
            <div className="p-3 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{location}</span>
              <span className="text-[10px] text-slate-400">Zone XII (Ghats)</span>
            </div>
          </div>

          {/* Soil Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.soilType}
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilParams({ soilType: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500"
            >
              <option value="Laterite / red coastal">Laterite / red coastal</option>
              <option value="Alluvial riverbed">Alluvial riverbed</option>
              <option value="Clay Loam">Clay Loam</option>
              <option value="Sandy Loam">Sandy Loam</option>
            </select>
          </div>

          {/* Soil pH & Acreage Inputs Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.soilPh}
                </label>
                <span className="text-xs font-extrabold text-krishi-700 dark:text-krishi-300">
                  {ph.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="4.5"
                max="8.5"
                step="0.1"
                value={ph}
                onChange={(e) => setSoilParams({ ph: parseFloat(e.target.value) })}
                className="w-full accent-krishi-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block text-right">
                {ph < 6 ? "Acidic (Typical Coast)" : "Neutral"}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.farmSizeAcres}
              </label>
              <input
                type="number"
                value={acreage}
                onChange={(e) => setSoilParams({ acreage: parseFloat(e.target.value) || 1 })}
                className="w-full p-2.5 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500"
              />
            </div>
          </div>

          {/* Priority Chips matching PDF page 19 */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-krishi-darkborder">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.whatMattersMost}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPriority("income")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  priority === "income"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                    : "bg-slate-100 dark:bg-krishi-darkbg text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {t.betterIncome}
              </button>
              <button
                onClick={() => setPriority("water")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  priority === "water"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                    : "bg-slate-100 dark:bg-krishi-darkbg text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {t.lessWater}
              </button>
              <button
                onClick={() => setPriority("risk")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  priority === "risk"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                    : "bg-slate-100 dark:bg-krishi-darkbg text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {t.lowerRisk}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): "PREVIEW OF YOUR SHORTLIST" matching PDF page 19 */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
            <div className="mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                {t.previewShortlist}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.threeCropsFit}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.basedOnContext}
              </p>
            </div>

            {/* Crop Cards List matching screenshot */}
            <div className="space-y-3">
              {crops.map((crop) => (
                <div
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedCrop === crop.id
                      ? "border-krishi-600 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm"
                      : "border-slate-200 dark:border-krishi-darkborder bg-white dark:bg-krishi-darkcard hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-krishi-100 dark:bg-krishi-900/50 text-krishi-700 dark:text-krishi-300 flex items-center justify-center font-bold text-xs">
                        🌱
                      </div>
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {language === "kn" ? crop.nameKn : crop.name}
                      </span>
                    </div>

                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      {crop.match}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                    {language === "kn" ? crop.descKn : crop.desc}
                  </p>

                  {/* Progress Bar matching screenshot */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2.5">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${crop.match}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-3">
                      <span>{t.estNetPerAcre}: <strong className="text-slate-900 dark:text-white">{crop.netIncome}</strong></span>
                      <span>•</span>
                      <span>{t.waterDemand}: <strong className="text-slate-900 dark:text-white">{crop.water}</strong></span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCrop(crop.id);
                        setShowGuideModal(true);
                      }}
                      className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>View guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Agronomy Breakdown for Selected Crop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 4D TOPSIS Radar Chart */}
            <div className="bg-white dark:bg-krishi-darkcard p-5 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Compass className="w-4 h-4 text-krishi-600" />
                4D Multi-Criteria Decision Radar
              </h4>
              <SuitabilityRadar
                soilAffinity={currentCrop.radar.soil}
                climateMatch={currentCrop.radar.climate}
                npkAffinity={currentCrop.radar.npk}
                waterSecurity={currentCrop.radar.water}
              />
            </div>

            {/* Fertilizer Bag Split */}
            <div className="bg-white dark:bg-krishi-darkcard p-5 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-krishi-600" />
                  {t.fertilizerDosage}
                </h4>
                <p className="text-[11px] text-slate-500 mb-3">
                  Stoichiometric split for {acreage} acres
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/40">
                  <span className="text-[10px] font-bold text-blue-900 dark:text-blue-300 block">Urea (46% N)</span>
                  <span className="text-xl font-extrabold text-blue-800 dark:text-blue-200 block mt-1">
                    {(currentCrop.urea * acreage).toFixed(1)}
                  </span>
                  <span className="text-[9px] text-blue-700 dark:text-blue-400 block mt-0.5">Split 30 DAS</span>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40">
                  <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 block">DAP (18:46:0)</span>
                  <span className="text-xl font-extrabold text-amber-800 dark:text-amber-200 block mt-1">
                    {(currentCrop.dap * acreage).toFixed(1)}
                  </span>
                  <span className="text-[9px] text-amber-700 dark:text-amber-400 block mt-0.5">100% Basal</span>
                </div>

                <div className="bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40">
                  <span className="text-[10px] font-bold text-rose-900 dark:text-rose-300 block">MOP (60% K)</span>
                  <span className="text-xl font-extrabold text-rose-800 dark:text-rose-200 block mt-1">
                    {(currentCrop.mop * acreage).toFixed(1)}
                  </span>
                  <span className="text-[9px] text-rose-700 dark:text-rose-400 block mt-0.5">Top-Dress</span>
                </div>
              </div>

              {/* Direct Link to Seed Hub */}
              <button
                onClick={() => setActiveTab("seed-bazaar")}
                className="mt-4 w-full py-2 bg-krishi-700 hover:bg-krishi-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Check Certified Seeds at Belthangady RSK</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
