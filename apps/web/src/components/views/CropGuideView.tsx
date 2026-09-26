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
  X,
  BookOpen,
  Sparkles,
  ShieldCheck,
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
    setCopilotOpen,
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
      guidePop: {
        spacing: "2.7m × 2.7m (500–550 palms/acre) · Pepper: 45cm at base of trunk on north side",
        spacingKn: "ಅಡಿಕೆ: 2.7 ಮೀ × 2.7 ಮೀ (ಎಕರೆಗೆ 500-550 ಸಸಿಗಳು) · ಕರಿಮೆಣಸು: ಅಡಿಕೆ ಮರದ ಬುಡದಿಂದ 45 ಸೆಂ.ಮೀ ಉತ್ತರದಲ್ಲಿ",
        pitPrep: "60cm × 60cm × 60cm pits filled with topsoil, 10kg well-rotted FYM, and 200g rock phosphate",
        pitPrepKn: "60 ಸೆಂ.ಮೀ × 60 ಸೆಂ.ಮೀ × 60 ಸೆಂ.ಮೀ ಗುಂಡಿಗಳಿಗೆ ಮೇಲ್ಮಣ್ಣು + 10 ಕೆಜಿ ಕಾಂಪೋಸ್ಟ್ + 200 ಗ್ರಾಂ ರಾಕ್ ಫಾಸ್ಫೇಟ್",
        irrigationProtocol: "Drip irrigation @ 16-20 L/palm/day (Dec to May). Pepper: 4 L/vine/day. Complete rain lockout during heavy SW monsoon.",
        irrigationProtocolKn: "ಬೇಸಿಗೆಯಲ್ಲಿ (ಡಿಸೆಂಬರ್-ಮೇ) ಹನಿ ನೀರಾವರಿ ಮೂಲಕ 16-20 ಲೀ/ಗಿಡಕ್ಕೆ ದಿನಕ್ಕೆ. ಕರಿಮೆಣಸಿಗೆ 4 ಲೀ/ದಿನ. ಮುಂಗಾರು ಮಳೆಯ ಸಮಯದಲ್ಲಿ ನೀರಾವರಿ ಸ್ಥಗಿತ.",
        pestControl: "1% neutral Bordeaux mixture spray in late May & July against Koleroga fruit rot. Trichoderma soil drench (50g/vine) against Pepper Quick-Wilt.",
        pestControlKn: "ಕೊಳೆರೋಗ ತಡೆಗಟ್ಟಲು ಮೇ ಅಂತ್ಯ ಮತ್ತು ಜುಲೈನಲ್ಲಿ 1% ಬೋರ್ಡೋ ದ್ರಾವಣ ಸಿಂಪಡಣೆ. ಕರಿಮೆಣಸಿನ ಸೊರಗು ರೋಗಕ್ಕೆ ಟ್ರೈಕೋಡರ್ಮಾ (50 ಗ್ರಾಂ/ಬಳ್ಳಿ) ಮಣ್ಣಿಗೆ ಸೇರಿಸಿ.",
        harvesting: "Chali areca harvest: Dec to Feb. Sun-drying on tarpaulin for 45 days. Pepper harvested when 1-2 berries turn red on the spike.",
        harvestingKn: "ಚಾಲಿ ಅಡಿಕೆ ಕೊಯ್ಲು: ಡಿಸೆಂಬರ್-ಫೆಬ್ರವರಿ. ಟಾರ್ಪಲಿನ್ ಮೇಲೆ 45 ದಿನ ಬಿಸಿಲಿನಲ್ಲಿ ಒಣಗಿಸಿ. ಮೆಣಸಿನ ಗೊಂಚಲಿನಲ್ಲಿ 1-2 ಕಾಳು ಕೆಂಪಾದಾಗ ಕೊಯ್ಲು.",
        economicsSummary: "Arecanut Chali: 25-28 Q/acre @ ₹38,000/Q + Pepper 400 kg @ ₹620/kg. Projected gross: ₹12.5L / 4.2 acres. Net: ₹2.8L/acre/year.",
        economicsSummaryKn: "ಚಾಲಿ ಅಡಿಕೆ: 25-28 ಕ್ವಿಂಟಾಲ್/ಎಕರೆಗೆ ₹38,000 ದರ + ಕರಿಮೆಣಸು 400 ಕೆಜಿ @ ₹620/ಕೆಜಿ. 4.2 ಎಕರೆಗೆ ಒಟ್ಟು ₹12.5 ಲಕ್ಷ. ನಿವ್ವಳ ಲಾಭ: ₹2.8 ಲಕ್ಷ/ಎಕರೆ/ವರ್ಷ.",
      },
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
      guidePop: {
        spacing: "Coconut: 7.5m × 7.5m (70 palms/acre) · Cocoa: Single hedge 3.0m in interspaces (200 trees/acre)",
        spacingKn: "ತೆಂಗು: 7.5 ಮೀ × 7.5 ಮೀ (ಎಕರೆಗೆ 70 ಮರಗಳು) · ಕೋಕೋ: ತೆಂಗಿನ ಸಾಲುಗಳ ನಡುವೆ 3.0 ಮೀ ಅಂತರದಲ್ಲಿ (ಎಕರೆಗೆ 200 ಗಿಡಗಳು)",
        pitPrep: "1m × 1m × 1m pits layered with coconut husks at bottom for moisture conservation + 25kg FYM",
        pitPrepKn: "1 ಮೀ × 1 ಮೀ × 1 ಮೀ ಗುಂಡಿಗಳ ತಳದಲ್ಲಿ ತೇವಾಂಶ ಸಂರಕ್ಷಣೆಗಾಗಿ ತೆಂಗಿನ ಸಿಪ್ಪೆಗಳ ಪದರ + 25 ಕೆಜಿ ಕಾಂಪೋಸ್ಟ್",
        irrigationProtocol: "Drip or basin irrigation @ 35-40 L/palm/day. Cocoa: Micro-sprinkler 8 L/plant every alternate day.",
        irrigationProtocolKn: "ಹನಿ ನೀರಾವರಿ ಮೂಲಕ 35-40 ಲೀಟರ್/ತೆಂಗಿನ ಮರಕ್ಕೆ ದಿನಕ್ಕೆ. ಕೋಕೋ ಗಿಡಗಳಿಗೆ ದಿನಬಿಟ್ಟು ದಿನ 8 ಲೀಟರ್ ಸೂಕ್ಷ್ಮ ತುಂತುರು ನೀರು.",
        pestControl: "Rhinoceros beetle pheromone traps + Cocoa black pod rot (Phytophthora) prophylactic 1% Bordeaux spray in June.",
        pestControlKn: "ತೆಂಗಿನ ಕಪ್ಪು ಮೂತಿ ದುಂಬಿ ಮತ್ತು ಕೋಕೋ ಕಾಯಿ ಕೊಳೆ ರೋಗ ತಡೆಗಟ್ಟಲು ಫೆರೋಮೋನ್ ಬಲೆ ಹಾಗೂ ಜೂನ್‌ನಲ್ಲಿ 1% ಬೋರ್ಡೋ ಸಿಂಪಡಣೆ.",
        harvesting: "Year-round monthly coconut harvesting (80-100 nuts/palm/year). Cocoa pods harvested when turn deep orange-yellow.",
        harvestingKn: "ವರ್ಷವಿಡೀ ಮಾಸಿಕ ತೆಂಗಿನಕಾಯಿ ಕಟಾವು (ವರ್ಷಕ್ಕೆ 80-100 ಕಾಯಿ/ಮರ). ಕೋಕೋ ಕಾಯಿಗಳು ಕಿತ್ತಳೆ-ಹಳದಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿದಾಗ ಕಟಾವು.",
        economicsSummary: "Coconut: 6,000 nuts/acre @ ₹25/nut = ₹1.5L + Cocoa 800 kg wet beans @ ₹90/kg = ₹72,000. Net: ₹1.9L/acre/year.",
        economicsSummaryKn: "ತೆಂಗು: 6,000 ಕಾಯಿ/ಎಕರೆಗೆ @ ₹25/ಕಾಯಿ = ₹1.5 ಲಕ್ಷ + ಕೋಕೋ 800 ಕೆಜಿ ಬೀಜ = ₹72,000. ನಿವ್ವಳ ಲಾಭ: ₹1.9 ಲಕ್ಷ/ಎಕರೆ/ವರ್ಷ.",
      },
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
      guidePop: {
        spacing: "System of Rice Intensification (SRI): 25cm × 25cm single seedling transplanting at 14 days",
        spacingKn: "ಶ್ರೀ (SRI) ಪದ್ಧತಿ: 25 ಸೆಂ.ಮೀ × 25 ಸೆಂ.ಮೀ ಅಂತರದಲ್ಲಿ 14 ದಿನಗಳ ಒಂದು ಸಸಿ ನಾಟಿ",
        pitPrep: "Puddling wetland with cage wheel tractor + incorporation of 5 tonnes/acre green sunnhemp manure",
        pitPrepKn: "ಕೇಜ್ ವೀಲ್ ಟ್ರ್ಯಾಕ್ಟರ್‌ನಿಂದ ಕೆಸರು ಗದ್ದೆ ಹದಗೊಳಿಸುವುದು + ಎಕರೆಗೆ 5 ಟನ್ ಸೆಣಬಿನ ಹಸಿರೆಲೆ ಗೊಬ್ಬರ ಸೇರಿಸುವುದು",
        irrigationProtocol: "Alternate wetting and drying (AWD) protocol up to panicle initiation, then maintain 2-3 cm standing water.",
        irrigationProtocolKn: "ತೆನೆ ಮೂಡುವವರೆಗೆ ತೇವ-ಒಣ ಪರ್ಯಾಯ ಪದ್ಧತಿ (AWD), ನಂತರ ಗದ್ದೆಯಲ್ಲಿ 2-3 ಸೆಂ.ಮೀ ನೀರು ನಿಲ್ಲಿಸುವುದು.",
        pestControl: "Brown planthopper (BPH) alleyway formation every 2m + Blast resistant seed treatment with Tricyclazole (2g/kg).",
        pestControlKn: "ಜಿಗಿ ಹುಳು ತಡೆಗೆ ಪ್ರತಿ 2 ಮೀಟರ್‌ಗೆ ಗಾಳಿ ದಾರಿ ಬಿಡುವುದು + ಬೆಂಕಿ ರೋಗ ತಡೆಗೆ ಟ್ರೈಸೈಕ್ಲೋಜೋಲ್‌ನಿಂದ ಬೀಜೋಪಚಾರ.",
        harvesting: "Harvest when 85% of panicles turn golden straw color. Moisture 20-22%. Immediate threshing & sun-drying to 14%.",
        harvestingKn: "85% ತೆನೆಗಳು ಬಂಗಾರದ ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿದಾಗ ಕೊಯ್ಲು. ತೇವಾಂಶ 14% ಗೆ ಬರುವಂತೆ ಬಿಸಿಲಿನಲ್ಲಿ ಒಣಗಿಸಿ ದಾಸ್ತಾನು.",
        economicsSummary: "Grain yield: 26-30 Q/acre @ ₹2,300/Q (MSP 2026) + Paddy straw 2.5 tonnes for cattle = Net: ₹1.2L/acre/season.",
        economicsSummaryKn: "ಧಾನ್ಯ ಇಳುವರಿ: 26-30 ಕ್ವಿಂಟಾಲ್/ಎಕರೆಗೆ @ ₹2,300/ಕ್ವಿಂಟಾಲ್ (ಬೆಂಬಲ ಬೆಲೆ 2026) + ಹುಲ್ಲು = ನಿವ್ವಳ ಲಾಭ: ₹1.2 ಲಕ್ಷ/ಎಕರೆ.",
      },
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

      {/* ── Comprehensive Agronomic Crop Guide Modal ── */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[92vh] bg-white dark:bg-krishi-darkcard rounded-2xl shadow-2xl border border-slate-200 dark:border-krishi-darkborder flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-krishi-darkborder bg-gradient-to-r from-emerald-50 via-teal-50 to-white dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-krishi-darkcard flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-lg ring-2 ring-emerald-400/30 shrink-0">
                  🌱
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                      ICAR / CPCRI Certified POP 2026
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      Zone XII (Ghats & Coastal Plain)
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                      {currentCrop.match}% Compatibility
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {language === "kn" ? currentCrop.nameKn : currentCrop.name}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {language === "kn" ? currentCrop.descKn : currentCrop.desc}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowGuideModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                aria-label="Close guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-slate-800 dark:text-slate-200 text-xs">
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 dark:bg-krishi-darkbg p-3 rounded-xl border border-slate-200 dark:border-krishi-darkborder">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Suitability Match</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">{currentCrop.match}%</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">Optimal laterite match</span>
                </div>

                <div className="bg-slate-50 dark:bg-krishi-darkbg p-3 rounded-xl border border-slate-200 dark:border-krishi-darkborder">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Est. Net Income</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white block mt-0.5">{currentCrop.netIncome}</span>
                  <span className="text-[10px] text-slate-500">Per acre / year</span>
                </div>

                <div className="bg-slate-50 dark:bg-krishi-darkbg p-3 rounded-xl border border-slate-200 dark:border-krishi-darkborder">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Weekly Water Need</span>
                  <span className="text-lg font-black text-blue-600 dark:text-blue-400 block mt-0.5">
                    {language === "kn" ? currentCrop.waterKn : currentCrop.water}
                  </span>
                  <span className="text-[10px] text-slate-500">Drip irrigated</span>
                </div>

                <div className="bg-slate-50 dark:bg-krishi-darkbg p-3 rounded-xl border border-slate-200 dark:border-krishi-darkborder">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Recommended Seeds</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block mt-1 line-clamp-1">
                    {currentCrop.cultivars}
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">SATHI certified</span>
                </div>
              </div>

              {/* Section 1: Spacing & Pit Preparation */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>{language === "kn" ? "೧. ನಾಟಿ, ಅಂತರ & ಗುಂಡಿ ಸಿದ್ಧತೆ" : "1. Spacing & Field Layout"}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white dark:bg-krishi-darkcard p-3 rounded-lg border border-emerald-200/60 dark:border-emerald-900/30">
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                      {language === "kn" ? "ಅಂತರ & ಸಸಿಗಳ ಸಂಖ್ಯೆ" : "Planting Geometry & Spacing"}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300">
                      {language === "kn" ? currentCrop.guidePop.spacingKn : currentCrop.guidePop.spacing}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-krishi-darkcard p-3 rounded-lg border border-emerald-200/60 dark:border-emerald-900/30">
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                      {language === "kn" ? "ಗುಂಡಿ ಸಿದ್ಧತೆ & ಮೇಲ್ಮಣ್ಣು" : "Pit Preparation & Basal Mix"}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300">
                      {language === "kn" ? currentCrop.guidePop.pitPrepKn : currentCrop.guidePop.pitPrep}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Nutrition & Fertilizer Application for Acreage */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-200/80 dark:border-blue-900/40 space-y-2">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>
                    {language === "kn"
                      ? `೨. ರಸಗೊಬ್ಬರ & ಪೋಷಕಾಂಶಗಳ ವೇಳಾಪಟ್ಟಿ (${acreage} ಎಕರೆಗೆ)`
                      : `2. Fertilizer & Nutrition Protocol (for ${acreage} acres)`}
                  </span>
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-white dark:bg-krishi-darkcard p-2.5 rounded-lg border border-blue-200 dark:border-blue-900/30">
                    <span className="text-[10px] font-bold text-slate-500 block">Urea (46% N)</span>
                    <span className="text-base font-black text-blue-700 dark:text-blue-300">{(currentCrop.urea * acreage).toFixed(1)} Bags</span>
                    <span className="text-[10px] text-slate-500 block">Split 30-45 DAS</span>
                  </div>
                  <div className="bg-white dark:bg-krishi-darkcard p-2.5 rounded-lg border border-blue-200 dark:border-blue-900/30">
                    <span className="text-[10px] font-bold text-slate-500 block">DAP (18:46:0)</span>
                    <span className="text-base font-black text-amber-700 dark:text-amber-300">{(currentCrop.dap * acreage).toFixed(1)} Bags</span>
                    <span className="text-[10px] text-slate-500 block">100% Basal at planting</span>
                  </div>
                  <div className="bg-white dark:bg-krishi-darkcard p-2.5 rounded-lg border border-blue-200 dark:border-blue-900/30">
                    <span className="text-[10px] font-bold text-slate-500 block">MOP (60% K)</span>
                    <span className="text-base font-black text-rose-700 dark:text-rose-300">{(currentCrop.mop * acreage).toFixed(1)} Bags</span>
                    <span className="text-[10px] text-slate-500 block">Post-monsoon top-dress</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Water & Pest Calendar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span>{language === "kn" ? "ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ" : "Irrigation Management"}</span>
                  </h5>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {language === "kn" ? currentCrop.guidePop.irrigationProtocolKn : currentCrop.guidePop.irrigationProtocol}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === "kn" ? "ರೋಗ & ಕೀಟ ನಿಯಂತ್ರಣ ಕ್ಯಾಲೆಂಡರ್" : "Pest & Disease Prevention"}</span>
                  </h5>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {language === "kn" ? currentCrop.guidePop.pestControlKn : currentCrop.guidePop.pestControl}
                  </p>
                </div>
              </div>

              {/* Section 4: Harvesting & Market Realization */}
              <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 space-y-1">
                <h5 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-xs">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === "kn" ? "ಕೊಯ್ಲು & ಮಾರುಕಟ್ಟೆ ಆದಾಯ ಮುನ್ನೋಟ" : "Harvesting & Mandi Realization"}</span>
                </h5>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  {language === "kn" ? currentCrop.guidePop.economicsSummaryKn : currentCrop.guidePop.economicsSummary}
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-krishi-darkborder bg-slate-50 dark:bg-krishi-darkbg flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  setShowGuideModal(false);
                  setActiveTab("seed-bazaar");
                }}
                className="px-4 py-2 bg-krishi-700 hover:bg-krishi-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
              >
                <Sprout className="w-4 h-4 text-krishi-gold" />
                <span>{language === "kn" ? "ಸಾಥಿ ಪ್ರಮಾಣೀಕೃತ ಬೀಜಗಳನ್ನು ನೋಡಿ →" : "Check Certified Seeds at SATHI Hub →"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowGuideModal(false);
                    setCopilotOpen(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{language === "kn" ? "ಕಿಸಾನ್ ಮಿತ್ರ AI ಕೇಳಿ" : "Ask Kisan Mitra AI"}</span>
                </button>

                <button
                  onClick={() => setShowGuideModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition"
                >
                  {language === "kn" ? "ಮುಚ್ಚಿ" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
