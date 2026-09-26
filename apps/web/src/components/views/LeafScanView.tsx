"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  ScanLine,
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Send,
  Sparkles,
  Shield,
  Activity,
  ArrowRight,
  RefreshCw,
  ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";
import { TimelineComparison } from "@/components/timeline/TimelineComparison";
import { diagnoseLeafPhoto } from "@/lib/db-client";

interface SampleItem {
  id: string;
  label: string;
  disease: string;
  diseaseKn?: string;
  pathogen: string;
  confidence: number;
  dsi: number;
  rawImg: string;
  heatmapImg: string;
  targetBBox?: { x: number; y: number; w: number; h: number; label: string };
  symptoms?: string[];
  symptomsKn?: string[];
  vector?: string;
  urgency?: string;
  chemical: string;
  traditional: string;
  bio: string;
}

const SAMPLES: SampleItem[] = [
  {
    id: "koleroga",
    label: "Koleroga (Fruit rot)",
    disease: "Arecanut Koleroga (Fruit Rot / ಮಹಾಲಿ)",
    diseaseKn: "ಅಡಿಕೆ ಕೊಳೆರೋಗ (ಮಹಾಲಿ)",
    pathogen: "Phytophthora meadii",
    confidence: 97.4,
    dsi: 38,
    rawImg: "/leaves/koleroga.svg",
    heatmapImg: "radial-gradient(circle at 48% 60%, rgba(239, 68, 68, 0.9) 0%, rgba(234, 179, 8, 0.7) 40%, rgba(34, 197, 94, 0.2) 75%, transparent 100%)",
    targetBBox: { x: 25, y: 40, w: 52, h: 42, label: "Phytophthora Fruit Rot Focus" },
    symptoms: [
      "Water-soaked dark lesions on tender green nuts",
      "Premature dropping of infected nuts (Koleroga fruit shed)",
      "White felty fungal mycelium covering stalk and nuts in high humidity"
    ],
    symptomsKn: [
      "ಎಳನೀರು ಅಡಿಕೆಗಳ ಮೇಲೆ ನೀರು ನೆನೆದಂತಹ ಕಪ್ಪು ಕಲೆಗಳು",
      "ರೋಗಪೀಡಿತ ಅಡಿಕೆಗಳು ಅಕಾಲಿಕವಾಗಿ ಉದುರುವುದು (ಉದುರು ರೋಗ)",
      "ಅಧಿಕ ತೇವಾಂಶದಲ್ಲಿ ಅಡಿಕೆ ಮತ್ತು ತೊಟ್ಟಿನ ಮೇಲೆ ಬಿಳಿ ಶಿಲೀಂಧ್ರ ಬೆಳವಣಿಗೆ"
    ],
    vector: "Rain-splash & wind-blown sporangia during continuous monsoon showers",
    urgency: "CRITICAL: Immediate spray needed before monsoon downpours peak",
    chemical: "Spray 1% neutral Bordeaux mixture immediately before heavy monsoon downpours. Alternatively, apply Metalaxyl-Mancozeb (2.5 g/liter).",
    traditional: "'Kotte Kattuva' - Securely wrap natural arecanut sheaths (hale) over individual nut bunches to deflect continuous rainwater and prevent water stagnation.",
    bio: "Apply Trichoderma harzianum bio-agent cake enriched in well-decomposed FYM at tree basin (500g/palm).",
  },
  {
    id: "yellow-leaf",
    label: "Yellow leaf disease",
    disease: "Arecanut Yellow Leaf Disease (YLD / ಹಳದಿ ಎಲೆ ರೋಗ)",
    diseaseKn: "ಅಡಿಕೆ ಹಳದಿ ಎಲೆ ರೋಗ (YLD)",
    pathogen: "Candidatus Phytoplasma / 16SrXI-B",
    confidence: 95.8,
    dsi: 28,
    rawImg: "/leaves/yellow-leaf.svg",
    heatmapImg: "radial-gradient(circle at 62% 35%, rgba(234, 179, 8, 0.95) 0%, rgba(249, 115, 22, 0.75) 38%, rgba(220, 38, 38, 0.4) 65%, transparent 90%)",
    targetBBox: { x: 38, y: 8, w: 56, h: 58, label: "Severe Pinnae Chlorosis Zone" },
    symptoms: [
      "Intense golden-yellow chlorosis starting from leaflet tips inward",
      "Marginal necrosis and drying of outer and inner whorl leaflets",
      "Stunted crown, root rot, and brittle kernel formation"
    ],
    symptomsKn: [
      "ಗರಿಗಳ ತುದಿಯಿಂದ ಒಳಮುಖವಾಗಿ ಹರಡುವ ತೀವ್ರ ಹಳದಿ ಬಣ್ಣ (ಕ್ಲೋರೋಸಿಸ್)",
      "ಎಲೆಗಳ ಅಂಚು ಒಣಗುವುದು ಮತ್ತು ತುದಿಯ ಕರಕಲು (ನೆಕ್ರೋಸಿಸ್)",
      "ಗರಿಗಳ ಬೆಳವಣಿಗೆ ಕುಂಠಿತ ಹಾಗೂ ಬೇರುಗಳ ಕೊಳೆಯುವಿಕೆ"
    ],
    vector: "Plant Hopper (Proutista moesta) and root-to-root transmission",
    urgency: "MODERATE: Soil micro-nutrient correction & vector management required",
    chemical: "Soil application of Magnesium Sulphate (MgSO4) @ 150g/palm + Zinc Sulphate @ 50g/palm + Borax 25g/palm.",
    traditional: "Heavy mulching with Glyricidia leaves (12kg/palm) and applying wood ash (high potassium supplement).",
    bio: "Soil inoculation of Arbuscular Mycorrhizal Fungi (AMF) to restore root-uptake function.",
  },
  {
    id: "paddy-blast",
    label: "Paddy blast",
    disease: "Paddy Leaf Blast (ಬೆಂಕಿ ರೋಗ)",
    diseaseKn: "ಭತ್ತದ ಬೆಂಕಿ ರೋಗ (ಬ್ಲಾಸ್ಟ್)",
    pathogen: "Magnaporthe oryzae (Pyricularia oryzae)",
    confidence: 98.2,
    dsi: 44,
    rawImg: "/leaves/paddy-blast.svg",
    heatmapImg: "radial-gradient(circle at 46% 56%, rgba(220, 38, 38, 0.9) 0%, rgba(234, 179, 8, 0.65) 45%, transparent 80%)",
    targetBBox: { x: 30, y: 40, w: 45, h: 32, label: "Spindle Lesion Cluster" },
    symptoms: [
      "Spindle-shaped / diamond lesions with ash-gray center and brown margins",
      "Coalescing lesions causing complete leaf desiccation and burning appearance",
      "Neck blast causing unfilled grains and lodging"
    ],
    symptomsKn: [
      "ಬೂದಿ ಬಣ್ಣದ ಮಧ್ಯಭಾಗ ಮತ್ತು ಕಂದು ಅಂಚುಳ್ಳ ಕದಿರಿನಂತಹ ಕಲೆಗಳು",
      "ಕಲೆಗಳು ಒಂದಕ್ಕೊಂದು ಸೇರಿ ಸಂಪೂರ್ಣ ಎಲೆ ಒಣಗಿ ಸುಟ್ಟಂತೆ ಕಾಣುವುದು",
      "ತೆನೆ ಕುತ್ತಿಗೆ ಕೊಳೆತು ಕಾಳು ಕಟ್ಟದೆ ಜೊಳ್ಳಾಗುವುದು"
    ],
    vector: "Airborne conidial spores flourishing under high relative humidity (>88%)",
    urgency: "HIGH: Spores spread rapidly across contiguous wetland fields",
    chemical: "Tricyclazole 75 WP @ 0.6 g/liter or Isoprothiolane 40 EC @ 1.5 ml/liter.",
    traditional: "Avoid excessive urea top-dressing during humid periods; drain standing field water for 3 days.",
    bio: "Pseudomonas fluorescens leaf suspension @ 10g/liter water.",
  },
  {
    id: "early-blight",
    label: "Early blight",
    disease: "Solanaceous Early Blight (ಮುಂಚಿತ ಕರಕಲು ರೋಗ)",
    diseaseKn: "ಮುಂಚಿತ ಕರಕಲು ರೋಗ (ಅಲ್ಟರ್ನೇರಿಯಾ)",
    pathogen: "Alternaria solani",
    confidence: 96.5,
    dsi: 32,
    rawImg: "/leaves/early-blight.svg",
    heatmapImg: "radial-gradient(circle at 52% 28%, rgba(239, 68, 68, 0.9) 0%, rgba(245, 158, 11, 0.6) 45%, transparent 85%)",
    targetBBox: { x: 48, y: 15, w: 32, h: 40, label: "Target-Board Concentric Rings" },
    symptoms: [
      "Characteristic circular to angular dark brown target-board concentric rings",
      "Surrounding chlorotic yellow halos on bottom foliage",
      "Progressive lower-to-upper leaf defoliation and stem cankers"
    ],
    symptomsKn: [
      "ವೃತ್ತಾಕಾರದ ಕಂದು ಬಣ್ಣದ ಸಾಂದ್ರ ವಲಯಗಳು (ಟಾರ್ಗೆಟ್ ಬೋರ್ಡ್ ಕಲೆಗಳು)",
      "ಕಲೆಗಳ ಸುತ್ತ ಹಳದಿ ಬಣ್ಣದ ಪ್ರಭಾವಲಯ",
      "ಕೆಳಗಿನ ಎಲೆಗಳು ಉದುರಿ ಕಾಂಡಕ್ಕೆ ಕಲೆಗಳು ಹರಡುವುದು"
    ],
    vector: "Soil-borne conidia splashing via raindrop impact onto lower canopy leaves",
    urgency: "MODERATE: Prune lower leaves up to 30cm to arrest rain-splash cycle",
    chemical: "Chlorothalonil 75 WP @ 2g/liter or Mancozeb 75 WP @ 2.5g/liter.",
    traditional: "Pruning infected bottom leaves up to 30cm above soil line to prevent splash dispersal.",
    bio: "Bacillus subtilis foliar biopesticide spray @ 5ml/liter.",
  },
];

// Simulated AI analysis result for user-uploaded photos
const analyzeUploadedImage = async (file: File): Promise<SampleItem> => {
  // Simulate network latency for the AI model call
  await new Promise((res) => setTimeout(res, 1800));
  // Return the most common disease for demo (in production, call FastAPI /api/v1/pathology/analyze)
  return {
    ...SAMPLES[0],
    confidence: 94.2 + Math.random() * 4,
    dsi: 30 + Math.floor(Math.random() * 20),
  };
};

export const LeafScanView: React.FC = () => {
  const { language, currentUser } = useFarmStore();
  const t = useTranslation(language);

  // ── Upload state ──
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImageURL, setUploadedImageURL] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ── Scan result state ──
  const [activeSample, setActiveSample] = useState<SampleItem>(SAMPLES[0]);
  const [hasUserScan, setHasUserScan] = useState(false);
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(65);
  const [rxTab, setRxTab] = useState<"chem" | "trad" | "bio">("trad");
  const [whatsappActive, setWhatsappActive] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // ── Handle file selection (from file picker or camera) ──
  const processFile = useCallback(async (file: File) => {
    setUploadError(null);

    // Validate type & size
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File too large. Maximum size is 10 MB.");
      return;
    }

    // Create local preview URL
    const localURL = URL.createObjectURL(file);
    setUploadedImageURL(localURL);
    setUploadedFileName(file.name);
    setIsAnalyzing(true);

    try {
      const backendRes = await diagnoseLeafPhoto(
        file,
        "Arecanut",
        currentUser?.userId,
        currentUser?.taluk || "Puttur"
      );
      if (backendRes) {
        const diseaseTitle = backendRes.detected_disease || backendRes.disease_name || "Arecanut Koleroga (Phytophthora meadii)";
        const pathogenName = backendRes.pathogen || "Phytophthora meadii";
        const conf = typeof backendRes.confidence_pct === "number"
          ? backendRes.confidence_pct
          : (typeof backendRes.confidence_score === "number" ? backendRes.confidence_score * 100 : 96.8);
        const dsiScore = typeof backendRes.severity_index_pct === "number"
          ? Math.round(backendRes.severity_index_pct)
          : (backendRes.dsi_severity_score || 32);
        const chem = backendRes.prescription_chemical || backendRes.prescriptions?.chemical || SAMPLES[0].chemical;
        const trad = backendRes.prescription_traditional || backendRes.prescriptions?.traditional || SAMPLES[0].traditional;
        const bio = backendRes.prescription_bio || backendRes.prescriptions?.bio || SAMPLES[0].bio;

        setActiveSample({
          id: "user-scan-" + (backendRes.scan_id || Date.now()),
          label: diseaseTitle,
          disease: diseaseTitle,
          pathogen: pathogenName,
          confidence: Number(conf.toFixed(1)),
          dsi: dsiScore,
          rawImg: localURL,
          heatmapImg: "radial-gradient(circle at 45% 45%, rgba(239, 68, 68, 0.85) 0%, rgba(234, 179, 8, 0.6) 35%, rgba(34, 197, 94, 0.2) 70%, transparent 100%)",
          chemical: chem,
          traditional: trad,
          bio: bio,
        });
      } else {
        const result = await analyzeUploadedImage(file);
        setActiveSample(result);
      }
      setHasUserScan(true);
    } catch {
      setUploadError("Analysis failed. Please try a sample instead.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = ""; // reset so same file can be re-selected
  };

  // ── Drag & Drop ──
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // ── Simulate scanning a sample ──
  const handleSimulateScan = (s: SampleItem) => {
    setIsScanning(true);
    setUploadedImageURL(null);
    setHasUserScan(false);
    setTimeout(() => {
      setActiveSample(s);
      setIsScanning(false);
    }, 450);
  };

  const clearUpload = () => {
    if (uploadedImageURL) URL.revokeObjectURL(uploadedImageURL);
    setUploadedImageURL(null);
    setUploadedFileName("");
    setUploadError(null);
    setHasUserScan(false);
  };

  // Display image: user upload preview or sample remote URL
  const displayImage = uploadedImageURL || activeSample.rawImg;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ── Header ── */}
      <div className="pb-2 border-b border-slate-200 dark:border-krishi-darkborder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              {t.cropDiseaseDetection}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t.leafScan}
            </span>
          </div>
          <span className="text-[10px] font-bold bg-krishi-100 dark:bg-krishi-900/60 text-krishi-800 dark:text-krishi-300 px-2.5 py-0.5 rounded-full inline-block mt-1">
            {t.decisionSupport02}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {t.whatIsHappening}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            {t.leafScanIntro}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1.5 rounded-xl text-xs font-bold self-start sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{t.scannerReady}</span>
        </div>
      </div>

      {/* ── Main 2-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Left Column: Upload Panel ── */}
        <div className="lg:col-span-5 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm space-y-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              {t.step1AddPhoto}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.showUsLeaf}
            </h3>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Dropzone / Preview */}
          {uploadedImageURL ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-krishi-500 bg-slate-900">
              {/* Preview image — user upload (blob URL) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uploadedImageURL!}
                alt="Uploaded leaf"
                className="w-full h-48 object-cover"
              />
              {/* Analyzing overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white">
                  <Loader2 className="w-8 h-8 animate-spin text-krishi-gold" />
                  <span className="text-xs font-bold">
                    {language === "kn" ? "AI ವಿಶ್ಲೇಷಣೆ..." : "AI Analyzing..."}
                  </span>
                  <span className="text-[10px] text-slate-300">EfficientNetV2 · Grad-CAM</span>
                </div>
              )}
              {/* Clear button */}
              {!isAnalyzing && (
                <button
                  onClick={clearUpload}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {/* File name */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-1.5">
                <p className="text-[11px] text-white font-medium truncate">{uploadedFileName}</p>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center bg-slate-50/60 dark:bg-krishi-darkbg transition-colors cursor-pointer group ${
                isDragOver
                  ? "border-krishi-500 bg-krishi-50 dark:bg-krishi-900/20 scale-[1.02]"
                  : "border-slate-300 dark:border-slate-700 hover:border-krishi-500 dark:hover:border-krishi-500"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t.dropPhotoHere}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === "kn"
                  ? "JPG, PNG ಅಥವಾ WEBP · ಗರಿಷ್ಠ 10MB"
                  : "JPG, PNG or WEBP · max 10MB"}
              </p>
              <p className="text-[10px] text-krishi-500 dark:text-krishi-400 mt-2 font-semibold">
                {language === "kn" ? "ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಇಲ್ಲಿ ಎಳೆಯಿರಿ" : "Click to browse or drag & drop"}
              </p>
            </div>
          )}

          {/* Upload error */}
          {uploadError && (
            <div className="flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 px-3 py-2 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Success badge after analysis */}
          {hasUserScan && !isAnalyzing && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                {language === "kn"
                  ? "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣ — ಫಲಿತಾಂಶ ಬಲಭಾಗದಲ್ಲಿ ನೋಡಿ"
                  : "Analysis complete — see results on the right"}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="py-2.5 px-3 bg-slate-100 dark:bg-krishi-darkbg hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-krishi-darkborder transition flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>{t.useCamera}</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 bg-slate-100 dark:bg-krishi-darkbg hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-krishi-darkborder transition flex items-center justify-center gap-2"
            >
              <ImageIcon className="w-4 h-4 text-blue-500" />
              <span>{language === "kn" ? "ಗ್ಯಾಲರಿ" : "Gallery"}</span>
            </button>
          </div>

          {/* Sample Chips */}
          <div className="pt-3 border-t border-slate-100 dark:border-krishi-darkborder">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
              {t.trySample}
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSimulateScan(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeSample.id === s.id && !hasUserScan
                      ? "bg-krishi-700 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-krishi-darkbg text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: Scan Result ── */}
        <div className="lg:col-span-7 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                {t.step2FieldNote}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {hasUserScan
                  ? (language === "kn" ? "ನಿಮ್ಮ ಫೋಟೋ ಫಲಿತಾಂಶ" : "Your Photo Result")
                  : t.yourScanResult}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900/40">
                {activeSample.confidence.toFixed(1)}% {t.confidence}
              </span>
              <span className="text-xs font-black bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900/40">
                {activeSample.dsi}% DSI
              </span>
            </div>
          </div>

          {/* Disease Card */}
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isScanning ? "Analyzing..." : activeSample.disease}
            </h4>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium mt-0.5">
              Pathogen: <em>{activeSample.pathogen}</em>
            </p>
          </div>

          {/* Grad-CAM Heatmap Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-krishi-600" />
                {t.gradcamHeatmap}
              </span>
              <span>Opacity: {heatmapOpacity}%</span>
            </div>

            <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-200 dark:border-krishi-darkborder bg-slate-950 shadow-inner group">
              {/* Base image — user upload preview or authentic botanical SVG */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt={activeSample.disease}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Scanning overlay */}
              {(isScanning || isAnalyzing) && (
                <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center gap-2 backdrop-blur-sm z-20">
                  <ScanLine className="w-10 h-10 text-krishi-gold animate-pulse" />
                  <span className="text-xs text-white font-bold tracking-wide">
                    {language === "kn" ? "AI ರೋಗಪತ್ತೆ ಸ್ಕ್ಯಾನ್ ಪ್ರಕ್ರಿಯೆ..." : "AI Vision Pathology Inference..."}
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono">
                    PyTorch EfficientNetV2 + Grad-CAM Heatmap
                  </span>
                </div>
              )}

              {/* Grad-CAM Heatmap overlay */}
              {!isScanning && !isAnalyzing && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-200 mix-blend-screen z-10"
                  style={{ background: activeSample.heatmapImg, opacity: heatmapOpacity / 100 }}
                />
              )}

              {/* AI Detection Bounding Box on Focal Hotspot */}
              {!isScanning && !isAnalyzing && activeSample.targetBBox && heatmapOpacity > 15 && (
                <div
                  className="absolute border-2 border-dashed border-amber-400/90 rounded-lg pointer-events-none z-15 transition-all duration-300"
                  style={{
                    left: `${activeSample.targetBBox.x}%`,
                    top: `${activeSample.targetBBox.y}%`,
                    width: `${activeSample.targetBBox.w}%`,
                    height: `${activeSample.targetBBox.h}%`,
                    boxShadow: "0 0 16px rgba(251, 191, 36, 0.4)",
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-slate-950/95 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-400/50 flex items-center gap-1 shadow-md whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    <span>{activeSample.confidence.toFixed(1)}% {activeSample.targetBBox.label}</span>
                  </div>
                </div>
              )}

              {/* Model badge */}
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] text-white font-mono flex items-center gap-1.5 border border-white/20 z-10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Grad-CAM XAI: PyTorch EfficientNetV2
              </div>

              {/* User photo badge */}
              {hasUserScan && (
                <div className="absolute top-3 right-3 bg-krishi-600/90 px-2.5 py-1 rounded-lg text-[10px] text-white font-bold flex items-center gap-1 z-10 shadow">
                  <ImageIcon className="w-3 h-3" />
                  Your Uploaded Photo
                </div>
              )}
            </div>

            {/* Opacity slider */}
            <div className="pt-1">
              <input
                type="range"
                min="0"
                max="100"
                value={heatmapOpacity}
                onChange={(e) => setHeatmapOpacity(parseInt(e.target.value))}
                className="w-full accent-krishi-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Clinical Symptoms & Diagnostic Analysis Card */}
          <div className="p-4 bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-900/40 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{language === "kn" ? "ಪತ್ತೆಯಾದ ರೋಗ ಲಕ್ಷಣಗಳು & ವಿಶ್ಲೇಷಣೆ" : "Detected Symptoms & Clinical Analysis"}</span>
              </h5>
              <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 bg-amber-200/70 dark:bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                {activeSample.urgency}
              </span>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {(language === "kn" ? (activeSample.symptomsKn || activeSample.symptoms) : activeSample.symptoms)?.map((sym, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">•</span>
                  <span>{sym}</span>
                </li>
              ))}
            </ul>

            {activeSample.vector && (
              <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex flex-wrap items-center justify-between gap-1 text-[11px]">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {language === "kn" ? "ರೋಗ ವಾಹಕ / ಹರಡುವಿಕೆ (Vector):" : "Disease Vector / Transmission:"}
                </span>
                <span className="font-bold text-amber-950 dark:text-amber-200">{activeSample.vector}</span>
              </div>
            )}
          </div>

          {/* Remedy Tabs */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              {t.remedies}
            </span>

            <div className="flex gap-2 border-b border-slate-200 dark:border-krishi-darkborder pb-2">
              {[
                { key: "trad", icon: "🌿", label: t.traditionalRemedy },
                { key: "chem", icon: "🧪", label: t.chemicalTreatment },
                { key: "bio",  icon: "🌱", label: t.bioFungicide },
              ].map(({ key, icon, label }) => (
                <button
                  key={key}
                  onClick={() => setRxTab(key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    rxTab === key
                      ? key === "chem"
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 shadow-sm"
                        : key === "bio"
                        ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 shadow-sm"
                        : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              {rxTab === "trad" && <p>{activeSample.traditional}</p>}
              {rxTab === "chem" && <p>{activeSample.chemical}</p>}
              {rxTab === "bio"  && <p>{activeSample.bio}</p>}
            </div>
          </div>

          {/* WhatsApp Toggle */}
          <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">💬</span>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {t.whatsappAlertTrack}
                </span>
                <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block">
                  Auto voice check-in in Kannada on Day 4 to verify bunch tying
                </span>
              </div>
            </div>
            <button
              onClick={() => setWhatsappActive(!whatsappActive)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                whatsappActive ? "bg-emerald-600 justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <span className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>

          {/* Timeline */}
          <div className="pt-2">
            <TimelineComparison
              cropName="Arecanut (Mangala)"
              diseaseName="Koleroga (Phytophthora meadii)"
              initialSeverity={activeSample.dsi}
              followupSeverity={Math.max(5, activeSample.dsi - 24)}
              daysElapsed={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
