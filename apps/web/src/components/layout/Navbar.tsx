"use client";

import React, { useState } from "react";
import {
  Sun,
  Moon,
  Globe,
  Bell,
  Sparkles,
  Settings,
  ChevronDown,
  LayoutDashboard,
  Compass,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  LogOut,
  MapPin,
  Loader2,
  Lock,
  Menu,
  X,
} from "lucide-react";
import { useFarmStore, Language, ViewMode, isUserAdmin } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";

export const Navbar: React.FC = () => {
  const {
    farmerName,
    farmName,
    location,
    language,
    theme,
    viewMode,
    copilotOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    currentUser,
    isGpsLocating,
    gpsStatusMessage,
    locateGps,
    setLanguage,
    toggleTheme,
    setViewMode,
    setCopilotOpen,
    logoutUser,
  } = useFarmStore();

  const isAdmin = isUserAdmin(currentUser);
  const t = useTranslation(language);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "kn", label: "ಕನ್ನಡ (Kannada)", flag: "🌾" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
    { code: "mr", label: "मराठी (Marathi)", flag: "🚩" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-krishi-darkcard/95 backdrop-blur-md border-b border-slate-200 dark:border-krishi-darkborder transition-colors duration-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / View indicator */}
        <div className="flex items-center gap-2 sm:gap-4">
          {viewMode === "app" && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-krishi-darkborder/50 rounded-xl transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-600" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
          <button
            onClick={() => setViewMode("landing")}
            className="flex items-center gap-3 text-left group"
            title="Go to Landing Page"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-krishi-600 to-krishi-800 flex items-center justify-center text-white shadow-md shadow-krishi-700/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                  {t.brandName}
                </span>
                <span className="text-[10px] font-bold bg-krishi-100 dark:bg-krishi-900/60 text-krishi-800 dark:text-krishi-200 px-2 py-0.5 rounded-full border border-krishi-300 dark:border-krishi-700">
                  PUTTUR 4.2A
                </span>
              </div>
              <p className="text-[10px] font-semibold text-krishi-700 dark:text-krishi-300 uppercase tracking-widest">
                {t.brandSubtitle}
              </p>
            </div>
          </button>

          {/* Mode Switcher Pills */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-krishi-darkbg/80 p-1 rounded-xl border border-slate-200 dark:border-krishi-darkborder">
            <button
              onClick={() => setViewMode("app")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === "app"
                  ? "bg-krishi-700 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{language === "kn" ? "ರೈತರ ಡೆಸ್ಕ್" : "Farm Desk"}</span>
            </button>

            {/* Admin Console Pill - Unlocked for Admins, Locked indicator for Farmers */}
            {isAdmin ? (
              <button
                onClick={() => setViewMode("admin")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === "admin"
                    ? "bg-krishi-700 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-krishi-gold" />
                <span>{language === "kn" ? "ಸಂಚಾಲಕ ಕನ್ಸೋಲ್" : "Admin Console"}</span>
              </button>
            ) : (
              <button
                onClick={() => setViewMode("admin")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === "admin"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
                }`}
                title={language === "kn" ? "ಸಂಚಾಲಕ ಕನ್ಸೋಲ್ (ಅಧಿಕಾರಿಗಳಿಗೆ ಮಾತ್ರ)" : "Admin Console (Admin Sign-In Required)"}
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === "kn" ? "ಸಂಚಾಲಕ ಕನ್ಸೋಲ್" : "Admin Console"}</span>
                <span className="text-[9px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-1 py-0.2 rounded border border-amber-300 dark:border-amber-700">
                  Locked
                </span>
              </button>
            )}

            <button
              onClick={() => setViewMode("landing")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === "landing"
                  ? "bg-krishi-700 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === "kn" ? "ಮುಖಪುಟ" : "Landing"}</span>
            </button>
            <button
              onClick={() => setViewMode("signin")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === "signin"
                  ? "bg-krishi-700 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>{language === "kn" ? "ಲಾಗಿನ್" : "Sign In"}</span>
            </button>
          </div>
        </div>

        {/* Right Tools & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GPS Location Button */}
          <button
            onClick={() => locateGps()}
            disabled={isGpsLocating}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              isGpsLocating
                ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-800 dark:text-amber-300 animate-pulse"
                : "bg-slate-50 dark:bg-krishi-darkbg border-slate-200 dark:border-krishi-darkborder text-slate-700 dark:text-slate-200 hover:border-krishi-500 hover:text-krishi-700 dark:hover:text-krishi-300"
            }`}
            title={gpsStatusMessage || (language === "kn" ? "ಜಿಪಿಎಸ್ ಸ್ಥಳ ಪತ್ತೆ ಮಾಡಿ" : "Detect Current GPS Location")}
          >
            {isGpsLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-krishi-600 dark:text-krishi-400" />
            )}
            <span className="truncate max-w-[130px]">
              {isGpsLocating
                ? (language === "kn" ? "ಶೋಧಿಸಲಾಗುತ್ತಿದೆ..." : "Locating GPS...")
                : location || "GPS Location"}
            </span>
          </button>

          {/* Kisan Mitra Voice Copilot Trigger */}
          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-krishi-600 to-krishi-700 hover:from-krishi-700 hover:to-krishi-800 text-white rounded-full text-xs font-bold shadow-sm shadow-krishi-700/30 transition-all hover:scale-105"
            title="Open Kisan Mitra AI Assistant"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-krishi-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-krishi-gold"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-krishi-gold" />
            <span className="hidden sm:inline">Kisan Mitra</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-krishi-darkborder bg-slate-50 dark:bg-krishi-darkbg text-slate-800 dark:text-slate-100 text-xs font-bold hover:bg-slate-100 dark:hover:bg-krishi-darkhover transition-colors"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-krishi-600 dark:text-krishi-400" />
              <span>
                {languages.find((l) => l.code === language)?.label.split(" ")[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-krishi-darkcard rounded-xl shadow-xl border border-slate-200 dark:border-krishi-darkborder py-1.5 z-50 animate-fadeIn">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-50 dark:hover:bg-krishi-darkhover transition-colors ${
                      language === l.code
                        ? "text-krishi-700 dark:text-krishi-300 bg-krishi-50 dark:bg-krishi-900/40 font-bold"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    {language === l.code && (
                      <CheckCircle className="w-3.5 h-3.5 text-krishi-600 dark:text-krishi-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-200 dark:border-krishi-darkborder bg-slate-50 dark:bg-krishi-darkbg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-krishi-darkhover transition-all"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 rounded-lg border border-slate-200 dark:border-krishi-darkborder bg-slate-50 dark:bg-krishi-darkbg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-krishi-darkhover transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-krishi-darkcard"></span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-krishi-darkcard rounded-xl shadow-xl border border-slate-200 dark:border-krishi-darkborder p-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-krishi-darkborder">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Field Alerts (2 New)
                  </span>
                  <span className="text-[10px] text-krishi-700 dark:text-krishi-300 font-semibold cursor-pointer">
                    Clear all
                  </span>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs">
                    <p className="font-bold text-amber-900 dark:text-amber-200">
                      🌧️ Koleroga Spore Alert
                    </p>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                      88% humidity expected this Thursday. Apply Bordeaux spray before rain.
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs">
                    <p className="font-bold text-emerald-900 dark:text-emerald-200">
                      📈 Shivamogga Mandi Surge
                    </p>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                      Chali price +₹4,200/qtl higher than Puttur. Net bonus ₹18,500 after freight.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-krishi-darkborder">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-sm ring-2 ${
              isAdmin
                ? "bg-slate-900 text-krishi-gold ring-krishi-gold/40 dark:bg-slate-800"
                : "bg-krishi-gold text-slate-900 ring-krishi-gold/20"
            }`}>
              {currentUser?.name
                ? currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                : "SG"}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight truncate max-w-[120px]">
                {currentUser?.name || farmerName}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
                {isAdmin
                  ? "👑 SDM Administrator"
                  : `${currentUser?.taluk || "Puttur"} · Farmer`}
              </span>
            </div>
            <button
              onClick={() => logoutUser()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title={language === "kn" ? "ಲಾಗ್‌ಔಟ್" : "Sign Out"}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
