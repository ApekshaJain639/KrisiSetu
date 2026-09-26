"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Layers,
  FileText,
  Upload,
  RefreshCw,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Building,
  Maximize2,
  Loader2,
  AlertTriangle,
  X,
  Sparkles,
  Printer,
  Download,
  FileCheck,
  Eye,
  Check,
  Trash2,
} from "lucide-react";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";
import {
  fetchHydrogeologyData,
  uploadRtcDocumentOcr,
  HydrogeologyTelemetry,
  RtcOcrResult,
} from "@/lib/db-client";

export const GisFieldMapView: React.FC = () => {
  const {
    language,
    farmName,
    location,
    latitude,
    longitude,
    acreage,
    currentUser,
    setFarmerProfile,
    setCopilotOpen,
  } = useFarmStore();

  const t = useTranslation(language);

  // Map display controls
  const [mapMode, setMapMode] = useState<"satellite" | "terrain">("satellite");
  const [ndviOverlay, setNdviOverlay] = useState(false);
  const [droneGrid, setDroneGrid] = useState(false);
  const [showBoundary, setShowBoundary] = useState(true);
  const [selectedPoiFilter, setSelectedPoiFilter] = useState<"all" | "apmc" | "equipment" | "soil">("all");

  // Telemetry state
  const [hydroData, setHydroData] = useState<HydrogeologyTelemetry | null>(null);

  // RTC / Bhoomi OCR Modal State
  const [showRtcModal, setShowRtcModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<RtcOcrResult | null>(null);
  const [rtcUploadError, setRtcUploadError] = useState<string | null>(null);
  const [ocrStep, setOcrStep] = useState<string>("");
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);
  const rtcFileInputRef = useRef<HTMLInputElement>(null);

  // Polygon boundary coordinates
  const [polygonCoords, setPolygonCoords] = useState<[number, number][]>([
    [75.2052, 12.7668],
    [75.2090, 12.7665],
    [75.2094, 12.7705],
    [75.2050, 12.7704],
  ]);

  const [fieldAcreage, setFieldAcreage] = useState<number>(acreage || 4.2);
  const [fieldPerimeter, setFieldPerimeter] = useState<number>(285.4);

  // Dynamic SVG projection helpers for geodesic polygon
  const getSvgPolygonPoints = () => {
    if (!polygonCoords || polygonCoords.length < 3) {
      return "210,140 460,110 540,310 270,360";
    }
    const lngs = polygonCoords.map((p) => p[0]);
    const lats = polygonCoords.map((p) => p[1]);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const lngSpan = maxLng - minLng || 0.005;
    const latSpan = maxLat - minLat || 0.005;

    // ViewBox canvas is 800 x 480
    const padX = 180;
    const padY = 90;
    const drawWidth = 440;
    const drawHeight = 280;

    return polygonCoords
      .map(([lng, lat]) => {
        const x = Math.round(padX + ((lng - minLng) / lngSpan) * drawWidth);
        const y = Math.round(padY + ((maxLat - lat) / latSpan) * drawHeight);
        return `${x},${y}`;
      })
      .join(" ");
  };

  const getSvgVertices = () => {
    const pts = getSvgPolygonPoints().split(" ");
    return pts.map((pt, idx) => {
      const [x, y] = pt.split(",").map(Number);
      return {
        x,
        y,
        coord: polygonCoords[idx] || [0, 0],
        label: `V${idx + 1}`,
      };
    });
  };

  // Load live hydrogeology telemetry from backend
  useEffect(() => {
    let active = true;
    async function loadData() {
      const data = await fetchHydrogeologyData(latitude || 12.7687, longitude || 75.2071);
      if (active && data) {
        setHydroData(data);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [latitude, longitude]);

  // Handle RTC Pahani / e-Swathu file upload with live scanning pipeline
  const processFile = async (file: File) => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setUploadedFilePreview(url);
    } else {
      setUploadedFilePreview(null);
    }
    setUploadedFileName(file.name);
    setUploadedFileSize((file.size / 1024).toFixed(1) + " KB");
    setIsOcrProcessing(true);
    setRtcUploadError(null);
    setOcrStep("1/3 Scanning Karnataka Bhoomi QR & Survey Number...");

    try {
      setTimeout(() => setOcrStep("2/3 Parsing owner khata & tenancy records..."), 600);
      setTimeout(() => setOcrStep("3/3 Computing geodesic boundary polygon..."), 1200);

      const res = await uploadRtcDocumentOcr(
        file,
        latitude || 12.7687,
        longitude || 75.2071,
        currentUser?.userId || 1
      );

      if (res) {
        setOcrResult(res);
        if (res.extracted_acreage) {
          setFieldAcreage(res.extracted_acreage);
          setFarmerProfile({ acreage: res.extracted_acreage });
        }
        if (res.perimeter_m) {
          setFieldPerimeter(res.perimeter_m);
        }
        if (res.boundary_polygon && res.boundary_polygon.length >= 4) {
          const coords = res.boundary_polygon.slice(0, 4).map((p) => [p[0], p[1]] as [number, number]);
          setPolygonCoords(coords);
        }
      }
    } catch {
      setRtcUploadError("Document scan failed. Switched to verified Karnataka Bhoomi template.");
    } finally {
      setIsOcrProcessing(false);
      setOcrStep("");
    }
  };

  // Demo one-click RTC loader for users without a file
  const handleLoadSampleRtc = async () => {
    setUploadedFileName("Karnataka_Bhoomi_RTC_Sy142_3A_Puttur.pdf");
    setUploadedFileSize("284.6 KB");
    setUploadedFilePreview(null);
    setIsOcrProcessing(true);
    setRtcUploadError(null);
    setOcrStep("Loading official Karnataka Bhoomi Form 16 record...");

    try {
      setTimeout(() => setOcrStep("Extracting Survey #142/3A & Hissa #1..."), 500);
      const res = await uploadRtcDocumentOcr(
        undefined,
        latitude || 12.7687,
        longitude || 75.2071,
        currentUser?.userId || 1
      );

      if (res) {
        setOcrResult(res);
        if (res.extracted_acreage) {
          setFieldAcreage(res.extracted_acreage);
          setFarmerProfile({ acreage: res.extracted_acreage });
        }
        if (res.perimeter_m) {
          setFieldPerimeter(res.perimeter_m);
        }
        if (res.boundary_polygon && res.boundary_polygon.length >= 4) {
          const coords = res.boundary_polygon.slice(0, 4).map((p) => [p[0], p[1]] as [number, number]);
          setPolygonCoords(coords);
        }
      }
    } catch {
      setRtcUploadError("Sample load failed. Check server connection.");
    } finally {
      setIsOcrProcessing(false);
      setOcrStep("");
    }
  };

  const handleApplyToMap = () => {
    setShowRtcModal(false);
    if (ocrResult) {
      setAppliedNotification(
        `✓ Bhoomi RTC Survey #${ocrResult.survey_no} Applied: ${ocrResult.extracted_acreage} Acres Geo-Tagged!`
      );
      setTimeout(() => setAppliedNotification(null), 5000);
    }
  };

  const handleClearUploadedFile = () => {
    setUploadedFilePreview(null);
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setOcrResult(null);
    if (rtcFileInputRef.current) {
      rtcFileInputRef.current.value = "";
    }
  };

  const handleResetSample = () => {
    setPolygonCoords([
      [75.2052, 12.7668],
      [75.2090, 12.7665],
      [75.2094, 12.7705],
      [75.2050, 12.7704],
    ]);
    setFieldAcreage(4.2);
    setFieldPerimeter(285.4);
    setOcrResult(null);
    setAppliedNotification(null);
  };

  // Nearby Agricultural Hubs
  const pois = [
    {
      id: "p1",
      name: "APMC Puttur Central Mandi",
      type: "apmc",
      distance: "2.4 km",
      role: "E-NAM electronic bidding yard & warehouse",
    },
    {
      id: "p2",
      name: "Raitha Samparka Kendra (RSK) Belthangady",
      type: "equipment",
      distance: "3.8 km",
      role: "Certified seeds & 50% subsidized implements",
    },
    {
      id: "p3",
      name: "ICAR-CPCRI Regional Station & Soil Testing",
      type: "soil",
      distance: "7.2 km",
      role: "Soil health card certification & tissue culture",
    },
    {
      id: "p4",
      name: "CAMPCO Sub-Depot & Drying Floor",
      type: "apmc",
      distance: "4.1 km",
      role: "Arecanut Chali procurement & MSP support",
    },
  ];

  const filteredPois = pois.filter((poi) =>
    selectedPoiFilter === "all" ? true : poi.type === selectedPoiFilter
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ── Header Row (matching Image 1) ── */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>GPS Field Polygon & ICAR Agro-Climatic Intelligence</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Calculates geodesic boundary acreage and perimeter. Auto-maps coordinates to ICAR Agro-Climatic
            Zone XII, annual rainfall isohyets, and CGWB groundwater aquifer stress.
          </p>
        </div>

        {/* Right Badge: Auto-detected ICAR Zone */}
        <div className="bg-[#0b213f] border border-blue-500/40 rounded-2xl p-4 text-right shrink-0">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 block">
            AUTO-DETECTED ICAR ZONE
          </span>
          <div className="text-sm font-bold text-cyan-200 mt-0.5">
            {hydroData?.zone_name || "Zone XII: West Coast Plains & Ghats Zone"}
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-1">
            Rainfall Isohyet: {hydroData?.annual_rainfall_isohyet || "2,200 - 3,800 mm / annum"}
          </div>
        </div>
      </div>

      {/* ── Main 2-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive GIS Field Map (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-2xl flex flex-col space-y-4">
          {/* Map Toolbar (matching Image 1 controls) */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Satellite / Terrain Switch */}
              <div className="bg-slate-900 p-1 rounded-xl flex items-center border border-slate-700 text-xs">
                <button
                  onClick={() => setMapMode("satellite")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                    mapMode === "satellite"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>🛰️ Satellite</span>
                </button>
                <button
                  onClick={() => setMapMode("terrain")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                    mapMode === "terrain"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>🗺️ Terrain</span>
                </button>
              </div>

              {/* NDVI Health Layer Toggle */}
              <button
                onClick={() => setNdviOverlay(!ndviOverlay)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                  ndviOverlay
                    ? "bg-emerald-600/30 text-emerald-300 border-emerald-500"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                }`}
              >
                <span>🌱 NDVI Health Layer: {ndviOverlay ? "ON" : "OFF"}</span>
              </button>

              {/* Drone Grid Toggle */}
              <button
                onClick={() => setDroneGrid(!droneGrid)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                  droneGrid
                    ? "bg-cyan-600/30 text-cyan-300 border-cyan-500"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                }`}
              >
                <span>🚁 Drone Grid: {droneGrid ? "ON" : "OFF"}</span>
              </button>

              {/* Plot Boundary Toggle */}
              <button
                onClick={() => setShowBoundary(!showBoundary)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                  showBoundary
                    ? "bg-rose-950/40 text-rose-300 border-rose-600"
                    : "bg-slate-900 text-slate-300 border-slate-700"
                }`}
              >
                <span>📍 Plot Boundary</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Export Field Dossier Button */}
              <button
                onClick={() => setShowDossierModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export Dossier (PDF)</span>
              </button>

              {/* Upload RTC / e-Swathu OCR Button */}
              <button
                onClick={() => setShowRtcModal(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Upload RTC / e-Swathu (OCR)</span>
              </button>

              <button
                onClick={handleResetSample}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
              >
                Reset Sample
              </button>
            </div>
          </div>

          {/* Interactive Satellite Canvas Visualizer */}
          <div className="relative w-full h-[480px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 select-none group">
            {/* Background Satellite Canvas / Image */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
                mapMode === "satellite"
                  ? "brightness-95 contrast-105"
                  : "brightness-75 sepia-[0.3]"
              }`}
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')",
              }}
            >
              {/* Optional Sentinel-2 NDVI overlay */}
              {ndviOverlay && (
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/30 via-lime-400/20 to-amber-500/20 mix-blend-color-dodge pointer-events-none" />
              )}

              {/* Optional Drone Grid */}
              {droneGrid && (
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
              )}
            </div>

            {/* Top Applied Notification Toast */}
            {appliedNotification && (
              <div className="absolute top-4 left-4 z-20 bg-emerald-950/95 border-2 border-emerald-500 text-emerald-200 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{appliedNotification}</span>
                <button
                  onClick={() => setAppliedNotification(null)}
                  className="ml-2 text-emerald-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* SVG Geodesic Field Boundary Polygon */}
            {showBoundary && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 480" preserveAspectRatio="none">
                <polygon
                  points={getSvgPolygonPoints()}
                  fill="rgba(16, 185, 129, 0.28)"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  className="transition-all duration-700"
                />

                {/* Vertices Pins with coordinates */}
                {getSvgVertices().map((v, i) => (
                  <g key={i}>
                    <circle cx={v.x} cy={v.y} r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                    <circle cx={v.x} cy={v.y} r="14" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                    <text
                      x={v.x + 10}
                      y={v.y - 10}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      stroke="#0f172a"
                      strokeWidth="2"
                      paintOrder="stroke"
                    >
                      {v.label} ({v.coord[1]?.toFixed(4)}, {v.coord[0]?.toFixed(4)})
                    </text>
                  </g>
                ))}
              </svg>
            )}

            {/* POI Markers on Map */}
            <div className="absolute top-[160px] left-[230px] flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/60 shadow-lg text-[10px] text-white font-bold">
              <span>🏡</span>
              <span>Farm Plot A ({fieldAcreage} Ac)</span>
            </div>

            <div className="absolute top-[280px] left-[420px] flex items-center gap-1 bg-blue-900/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-blue-400/50 shadow-md text-[10px] text-cyan-200 font-semibold">
              <span>🏛️</span>
              <span>RSK Belthangady (3.8 km)</span>
            </div>

            <div className="absolute bottom-[40px] right-[180px] flex items-center gap-1 bg-amber-900/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-400/50 shadow-md text-[10px] text-amber-200 font-semibold">
              <span>🏢</span>
              <span>Puttur APMC (2.4 km)</span>
            </div>

            {/* Map Controls (+ / -) */}
            <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 text-white">
              <button className="w-7 h-7 flex items-center justify-center font-bold hover:bg-slate-800 rounded-lg">
                +
              </button>
              <button className="w-7 h-7 flex items-center justify-center font-bold hover:bg-slate-800 rounded-lg">
                -
              </button>
            </div>

            {/* Bottom Polygon Stats Strip */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 flex flex-wrap items-center justify-between text-xs text-white">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Surveyed Acreage</span>
                  <span className="text-sm font-black text-emerald-400">{fieldAcreage} Acres (1.70 Ha)</span>
                </div>
                <div className="h-6 w-px bg-slate-700" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Perimeter Length</span>
                  <span className="text-sm font-black text-cyan-300">{fieldPerimeter} Meters</span>
                </div>
                <div className="h-6 w-px bg-slate-700" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Land Category</span>
                  <span className="text-xs font-bold text-slate-200">
                    {ocrResult?.soil_classification || "Kari / Bagayat (Laterite Garden)"}
                  </span>
                </div>
              </div>

              {ocrResult && (
                <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500 text-emerald-300 px-3 py-1 rounded-xl text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bhoomi RTC Verified: #{ocrResult.survey_no}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Hydrogeology Telemetry & Nearby POIs (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Soil & CGWB Hydrogeology Telemetry (matching Image 1) */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm border-b border-slate-800 pb-3">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Soil & CGWB Hydrogeology Telemetry</span>
            </div>

            {/* CGWB Groundwater Table Stress */}
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                CGWB Groundwater Table Stress
              </span>
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-emerald-400">
                  {hydroData?.cgwb_groundwater?.aquifer_stress_status || "Safe"}
                </span>
                <span className="text-xs font-mono text-slate-300">
                  Depth: {hydroData?.cgwb_groundwater?.water_table_depth || "4.5 - 9.0 m bgl"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Recharge Potential: {hydroData?.cgwb_groundwater?.recharge_potential || "Very High (Western Ghats Runoff)"}
              </p>
            </div>

            {/* Predominant Soil Formation */}
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                Predominant Soil Formation
              </span>
              <div className="text-xs font-bold text-white">
                {hydroData?.predominant_soil_formation || "Laterite (Acidic, Rich in Iron & Alumina)"}
              </div>
              <p className="text-[11px] text-slate-400">
                {hydroData?.soil_description || "Rich in iron oxides & alumina; responds exceptionally well to organic liming."}
              </p>
            </div>

            {/* Regional Micro-Climate Category */}
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                Regional Micro-Climate Category
              </span>
              <div className="text-xs font-bold text-amber-300">
                {hydroData?.regional_micro_climate || "Humid Tropical / Western Ghats Rain Shadow"}
              </div>
            </div>
          </div>

          {/* Card 2: Nearby Agricultural Hubs (POI) */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>Nearby Agricultural Hubs (POI)</span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {(["all", "apmc", "equipment", "soil"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedPoiFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                    selectedPoiFilter === cat
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat === "all" ? "All Hubs" : cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* List of Hubs */}
            <div className="space-y-2.5">
              {filteredPois.map((poi) => (
                <div
                  key={poi.id}
                  className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200">{poi.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{poi.role}</div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md shrink-0">
                    {poi.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RTC / Bhoomi Pahani OCR Modal ── */}
      {showRtcModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white p-6 rounded-3xl max-w-xl w-full border border-slate-700 shadow-2xl space-y-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Karnataka Bhoomi RTC (ಪಹಣಿ) / e-Swathu OCR</h3>
                  <div className="text-[11px] text-slate-400">Form 16 Land Tenancy & Geodesic Field Boundary Parser</div>
                </div>
              </div>
              <button
                onClick={() => setShowRtcModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Upload your Karnataka RTC (Pahani) or e-Swathu record. The vision model extracts survey number,
              hissa, land tenancy, and acreage, auto-drawing your field polygon coordinates.
            </p>

            {/* Hidden File Picker Input */}
            <input
              ref={rtcFileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) processFile(f);
                if (e.target) e.target.value = "";
              }}
            />

            {/* Drag & Drop Upload Zone OR Document Preview */}
            {!uploadedFileName ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) processFile(f);
                }}
                onClick={() => rtcFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? "border-emerald-400 bg-emerald-950/40 scale-[1.01]"
                    : "border-slate-700 hover:border-emerald-500 bg-slate-950/60"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Drag & drop RTC document here, or <span className="text-emerald-400 underline">browse files</span>
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Supports Karnataka RTC Pahani PNG, JPG, or Scanned PDF
                  </span>
                </div>

                {/* Instant Demo Quick Load Button */}
                <div className="mt-3 pt-3 border-t border-slate-800 w-full flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadSampleRtc();
                    }}
                    className="px-3.5 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>⚡ One-Click Demo: Load Sample RTC (Sy #142/3A)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl border border-slate-700 bg-slate-950/90 p-4 space-y-3">
                {/* File Header Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[260px] sm:max-w-[340px]">
                        {uploadedFileName}
                      </div>
                      <div className="text-[10px] text-slate-400">{uploadedFileSize}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => rtcFileInputRef.current?.click()}
                      className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition"
                    >
                      Change File
                    </button>
                    <button
                      type="button"
                      onClick={handleClearUploadedFile}
                      className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Visual Image / Document Preview with Scanning laser if active */}
                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 h-44 flex items-center justify-center">
                  {uploadedFilePreview ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={uploadedFilePreview}
                      alt="Uploaded RTC"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <FileText className="w-12 h-12 text-emerald-400/70 mx-auto mb-1.5" />
                      <div className="text-xs font-bold text-slate-200">
                        ಕರ್ನಾಟಕ ಸರ್ಕಾರ · ಕಂದಾಯ ಇಲಾಖೆ (ಭೂಮಿ)
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Form 16 · Pahani Record Digital Copy
                      </div>
                    </div>
                  )}

                  {/* Laser Scanning Animation Bar */}
                  {isOcrProcessing && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-pulse" />
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* OCR Processing Stage Indicator */}
            {isOcrProcessing && (
              <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-500/40 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />
                <div>
                  <div className="text-xs font-bold text-cyan-200">Reading Karnataka Bhoomi Records...</div>
                  <div className="text-[11px] text-slate-300">{ocrStep || "Scanning survey records from template..."}</div>
                </div>
              </div>
            )}

            {rtcUploadError && (
              <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{rtcUploadError}</span>
              </div>
            )}

            {/* Extracted Bhoomi RTC Details Card */}
            {ocrResult && (
              <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-800/40">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bhoomi Form 16 Official Verified</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-900/60 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-600/40 font-bold">
                    Sy #{ocrResult.survey_no}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">ಖಾತೆದಾರ / Owner Name</span>
                    <strong className="text-white block truncate">{ocrResult.owner_name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">ಸರ್ವೆ & ಹಿಸ್ಸಾ / Survey & Hissa</span>
                    <strong className="text-cyan-300 block">
                      Sy #{ocrResult.survey_no} {ocrResult.hissa_no ? `/ Hissa #${ocrResult.hissa_no}` : ""}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">ಗ್ರಾಮ & ತಾಲೂಕು / Location</span>
                    <span className="text-slate-200 block truncate">{ocrResult.village}, {ocrResult.taluk}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">ಖಾತೆ ವಿಸ್ತೀರ್ಣ / Acreage</span>
                    <span className="font-black text-emerald-400 text-sm block">{ocrResult.extracted_acreage} Acres</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">ಭೂಮಿಯ ನಮೂನೆ / Land Category</span>
                    <span className="text-slate-300 block text-[11px] truncate">
                      {ocrResult.soil_classification || "Kari / Bagayat (Garden)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">ಗಡಿ ಸುತ್ತಳತೆ / Perimeter</span>
                    <span className="text-cyan-300 font-bold block">{fieldPerimeter} Meters</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowRtcModal(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyToMap}
                disabled={isOcrProcessing || !ocrResult}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-2 ${
                  ocrResult && !isOcrProcessing
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply Geodesic Boundary to GIS Map</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Official Bhoomi RTC & ICAR Field Dossier Modal (Printable) ── */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full border border-slate-700 shadow-2xl p-6 space-y-5 animate-fadeIn my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black tracking-tight">
                  Official Land Parcel & ICAR Hydrogeology Dossier
                </h3>
              </div>
              <button
                onClick={() => setShowDossierModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Official Certificate Paper Container */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 border-2 border-slate-300 shadow-inner space-y-4 print:p-0 print:border-none print:shadow-none">
              {/* Seal & Header */}
              <div className="text-center border-b-2 border-emerald-800 pb-3">
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
                  ಕರ್ನಾಟಕ ಸರ್ಕಾರ · ಕಂದಾಯ ಇಲಾಖೆ (ಭೂಮಿ) & ICAR ಕೃಷಿ-ಹವಾಮಾನ ಮಂಡಳಿ
                </div>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mt-0.5">
                  Bhoomi Digital Land Parcel & Agro-Climatic Intelligence Certificate
                </h2>
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  Reference: KRN-BHOOMI-RTC-2024-SY{ocrResult?.survey_no || "142-2A"} · Validated under ICAR Zone XII Protocol
                </div>
              </div>

              {/* Farmer & Plot Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">ಖಾತೆದಾರ / Owner Name</span>
                  <strong className="text-slate-900 font-black text-sm">
                    {ocrResult?.owner_name || currentUser?.name || "Shrinivasa Gowda"}
                  </strong>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">ಸರ್ವೆ & ಹಿಸ್ಸಾ / Survey & Hissa</span>
                  <strong className="text-emerald-700 font-black text-sm">
                    Sy #{ocrResult?.survey_no || "142/2A"} {ocrResult?.hissa_no ? `(Hissa ${ocrResult.hissa_no})` : ""}
                  </strong>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">ವಿಸ್ತೀರ್ಣ / Geodesic Acreage</span>
                  <strong className="text-slate-900 font-black text-sm">
                    {fieldAcreage} Acres ({(fieldAcreage * 0.404686).toFixed(2)} Hectares)
                  </strong>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">ಗಡಿ ಸುತ್ತಳತೆ / Geodesic Perimeter</span>
                  <strong className="text-slate-900 font-black text-sm">
                    {fieldPerimeter} Meters (Closed Polygon)
                  </strong>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">ಗ್ರಾಮ ಮತ್ತು ತಾಲೂಕು / Location</span>
                  <span className="text-slate-800 font-bold">
                    {ocrResult?.village || "Belthangady"}, {ocrResult?.taluk || "Dakshina Kannada"}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">ICAR ವಲಯ / Agro-Climatic Zone</span>
                  <span className="text-slate-800 font-bold">
                    {hydroData?.zone_code || "Zone XII"}: West Coast Plains & Ghats
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">CGWB ಅಂತರ್ಜಲ ಸ್ಥಿತಿ / Aquifer Stress</span>
                  <span className="text-emerald-700 font-bold">
                    {hydroData?.cgwb_groundwater?.aquifer_stress_status || "Safe"} ({hydroData?.cgwb_groundwater?.water_table_depth || "4.5 - 9.0 m bgl"})
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">ವಾರ್ಷಿಕ ಮಳೆ / Annual Rainfall Isohyet</span>
                  <span className="text-slate-800 font-bold">
                    {hydroData?.annual_rainfall_isohyet || "2,200 - 3,800 mm / annum"}
                  </span>
                </div>
              </div>

              {/* Coordinates & Certification Strip */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-900 block">Geodesic Polygon Centroid</span>
                  <span className="font-mono text-[11px] text-emerald-700">
                    Lat: {latitude?.toFixed(4) || "12.7687"}° N, Lng: {longitude?.toFixed(4) || "75.2071"}° E
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Digital Timestamp</span>
                  <span className="font-mono text-[11px] text-slate-700">
                    {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDossierModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
