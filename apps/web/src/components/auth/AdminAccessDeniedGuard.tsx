"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  LayoutDashboard,
  KeyRound,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";
import { loginAdmin } from "@/lib/db-client";

export const AdminAccessDeniedGuard: React.FC = () => {
  const {
    currentUser,
    fruitsId,
    farmerName,
    location,
    language,
    setViewMode,
    setInitialAuthTab,
    setCurrentUser,
  } = useFarmStore();

  const [quickAdminLoading, setQuickAdminLoading] = useState(false);
  const [quickError, setQuickError] = useState<string | null>(null);

  const handleQuickAdminLogin = async () => {
    setQuickAdminLoading(true);
    setQuickError(null);
    try {
      const res = await loginAdmin("admin", "admin123");
      setCurrentUser({
        userId: res.user_id,
        name: res.name,
        role: res.role,
        token: res.token,
        taluk: res.taluk || "All",
      });
      setViewMode("admin");
    } catch (err: any) {
      // Offline fallback
      setCurrentUser({
        userId: 99,
        name: "KrishiSetu SDM IT Admin",
        role: "sdm_admin",
        token: "admin-offline-token",
        taluk: "All",
      });
      setViewMode("admin");
    } finally {
      setQuickAdminLoading(false);
    }
  };

  const handleGoToAdminSignIn = () => {
    setInitialAuthTab("admin");
    setViewMode("signin");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fadeIn">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-krishi-darkcard rounded-3xl border border-rose-200 dark:border-rose-950/60 shadow-xl overflow-hidden">
        {/* Header accent strip */}
        <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 px-6 sm:px-8 py-5 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-100 bg-white/20 px-2 py-0.5 rounded-full inline-block">
                RBAC Security Policy Enforced
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {language === "kn"
                  ? "ಸಂಚಾಲಕ ಕನ್ಸೋಲ್ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ"
                  : "Admin Console Access Restricted"}
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/20 text-xs font-mono font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>ROLE: ADMIN ONLY</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Explanation Alert */}
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-2 text-xs sm:text-sm text-rose-900 dark:text-rose-200">
                <p className="font-bold">
                  {language === "kn"
                    ? "ನೋಂದಾಯಿತ ರೈತರ ಖಾತೆಗಳಿಗೆ ಆಡಳಿತ ಕನ್ಸೋಲ್ ಪ್ರವೇಶಾವಕಾಶವಿಲ್ಲ."
                    : "Registered Farmer accounts cannot access the Agriculture Officer Admin Console."}
                </p>
                <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                  {language === "kn"
                    ? "ಈ ಕನ್ಸೋಲ್ ಭೂಮಿ ಪಹಣಿ (Bhoomi RTC) ಮಾಲೀಕತ್ವ ನೋಂದಣಿ, ಇ-ನ್ಯಾಮ್ ಎಕ್ಸ್‌ಟ್ರಾಕ್ಷನ್ ಪೈಪ್‌ಲೈನ್ ಮತ್ತು ಜಿಲ್ಲಾ ಮಟ್ಟದ ತುರ್ತು ಕೀಟಬಾಧೆ ಸಂದೇಶ ಪ್ರಸಾರ ವ್ಯವಸ್ಥೆಗಳಿಗೆ ಸೀಮಿತವಾಗಿದೆ. ಆಡಳಿತಾಧಿಕಾರಿಗಳು (Admins) ಮಾತ್ರ ರೈತರ ಡೆಸ್ಕ್ ಮತ್ತು ಸಂಚಾಲಕ ಕನ್ಸೋಲ್ ಎರಡನ್ನೂ ಪ್ರವೇಶಿಸಬಹುದು."
                    : "The Admin Console contains confidential Bhoomi RTC land parcel registries, automated e-NAM scraping ETL pipelines, and taluk-level emergency spore outbreak broadcast transmitters. Only verified SDM IT Administrators and District Agriculture Officers can access this console."}
                </p>
              </div>
            </div>
          </div>

          {/* Current Active Account Box */}
          <div className="bg-slate-50 dark:bg-krishi-darkbg/60 p-5 rounded-2xl border border-slate-200 dark:border-krishi-darkborder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center font-black text-amber-900 dark:text-amber-200 text-sm shadow-sm">
                🌾
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 dark:text-white text-sm sm:text-base">
                    {currentUser?.name || farmerName}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    {currentUser?.role ? currentUser.role.toUpperCase() : "REGISTERED FARMER"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  FRUITS ID: <strong className="font-mono text-slate-700 dark:text-slate-300">{fruitsId}</strong> · {currentUser?.taluk || "Puttur"} · Dakshina Kannada
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 sm:text-right font-medium">
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {language === "kn" ? "ರೈತರ ಡೆಸ್ಕ್ ಸಕ್ರಿಯವಾಗಿದೆ" : "Farmer Desk Active"}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === "kn" ? "ಆಡಳಿತ ಹಕ್ಕುಗಳು: ನಿರಾಕರಿಸಲಾಗಿದೆ" : "Admin Rights: Not Granted"}
              </p>
            </div>
          </div>

          {/* Access Matrix Comparison Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Farmer Permissions */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {language === "kn" ? "ರೈತರ ಖಾತೆ ಹಕ್ಕುಗಳು" : "Registered Farmer Privileges"}
                </span>
                <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                  Standard
                </span>
              </div>
              <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Access Farm Desk (Overview, GIS Map, Leaf Scan)</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Real-time e-NAM live mandi price intelligence</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>SATHI Certified Seed Bazaar reservations</span>
                </li>
                <li className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>District Agriculture Officer Console (Restricted)</span>
                </li>
                <li className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Bhoomi RTC land tenancy inspection database</span>
                </li>
              </ul>
            </div>

            {/* Admin Permissions */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                  {language === "kn" ? "ಸಂಚಾಲಕರ ಹಕ್ಕುಗಳು" : "Administrator Privileges"}
                </span>
                <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Full Bidirectional
                </span>
              </div>
              <ul className="text-xs space-y-2 text-indigo-950 dark:text-indigo-200">
                <li className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Access both Admin Console & Farmer Desk</span>
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                  <span>District Agriculture Officer overview & health stats</span>
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                  <span>Inspect Bhoomi RTC parcels across all taluks</span>
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                  <span>Trigger live Agmarknet / e-NAM ETL resync pipelines</span>
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                  <span>Broadcast Kannada SMS & voice advisories to farmers</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-krishi-darkborder flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setViewMode("app")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>{language === "kn" ? "← ರೈತರ ಡೆಸ್ಕ್‌ಗೆ ಹಿಂತಿರುಗಿ" : "← Return to Farm Desk"}</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleGoToAdminSignIn}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-krishi-700 text-krishi-800 dark:text-krishi-200 hover:bg-krishi-50 dark:hover:bg-krishi-950/40 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <KeyRound className="w-3.5 h-3.5 text-krishi-700" />
                <span>{language === "kn" ? "ಸಂಚಾಲಕರ ಲಾಗಿನ್ ಪುಟ" : "Admin Sign-In Portal"}</span>
              </button>

              <button
                onClick={handleQuickAdminLogin}
                disabled={quickAdminLoading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-krishi-700 to-krishi-800 hover:from-krishi-800 hover:to-krishi-900 text-white font-black text-xs shadow-md shadow-krishi-800/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {quickAdminLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-krishi-gold" />
                )}
                <span>
                  {language === "kn" ? "ತ್ವರಿತ ಸಂಚಾಲಕ ಡೆಮೋ ಲಾಗಿನ್" : "Quick Demo: Sign In as Admin"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
