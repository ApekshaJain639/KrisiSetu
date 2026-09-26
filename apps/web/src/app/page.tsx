"use client";

import React, { useEffect, useState } from "react";
import { useFarmStore, isUserAdmin } from "@/stores/useFarmStore";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { OverviewView } from "@/components/views/OverviewView";
import { CropGuideView } from "@/components/views/CropGuideView";
import { LeafScanView } from "@/components/views/LeafScanView";
import { RiskForecastView } from "@/components/views/RiskForecastView";
import { NdviNutrientsView } from "@/components/views/NdviNutrientsView";
import { YieldEstimateView } from "@/components/views/YieldEstimateView";
import { MarketPricesView } from "@/components/views/MarketPricesView";
import { SeedBazaarView } from "@/components/views/SeedBazaarView";
import { AiotLabView } from "@/components/views/AiotLabView";
import { GisFieldMapView } from "@/components/views/GisFieldMapView";
import { LandingPageView } from "@/components/views/LandingPageView";
import { SignInView } from "@/components/views/SignInView";
import { AdminDashboardView } from "@/components/views/AdminDashboardView";
import { KisanMitraModal } from "@/components/copilot/KisanMitraModal";
import { AdminAccessDeniedGuard } from "@/components/auth/AdminAccessDeniedGuard";
import {
  ShieldCheck,
  LayoutDashboard,
  ScanLine,
  CloudRain,
  TrendingUp,
  Sparkles,
  Menu,
} from "lucide-react";

export default function AppHome() {
  const {
    viewMode,
    activeTab,
    theme,
    currentUser,
    language,
    setViewMode,
    setActiveTab,
    setCopilotOpen,
    setMobileMenuOpen,
  } = useFarmStore();
  const [mounted, setMounted] = useState(false);
  const isAdmin = isUserAdmin(currentUser);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync dark class on documentElement
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0d2818] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-bounce">🌾</span>
          <span className="font-extrabold text-lg tracking-wider">KRISHISETU</span>
          <span className="text-xs text-emerald-300">Loading Farm Intelligence...</span>
        </div>
      </div>
    );
  }

  // 1. Public Landing Page view (PDF page 18 top & page 23)
  if (viewMode === "landing") {
    return <LandingPageView />;
  }

  // 2. Farmer Workspace Auth view (PDF page 19 top)
  if (viewMode === "signin") {
    return <SignInView />;
  }

  // 3. Admin Console (SDM IT / District-level oversight)
  if (viewMode === "admin") {
    // RBAC: Farmers cannot access the Admin Console
    if (!isAdmin) {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-krishi-darkbg transition-colors duration-200">
          <Navbar />
          <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center">
            <AdminAccessDeniedGuard />
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-krishi-darkbg transition-colors duration-200">
        <Navbar />
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
          <AdminDashboardView />
        </main>
      </div>
    );
  }

  // 4. Farm Desk Workspace (PDF page 18 bottom to page 22)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-krishi-darkbg transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Admin Mode Inspection Banner when Admin is viewing Farmer Desk */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/30 px-4 sm:px-6 py-2 text-white flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 font-black text-[10px] uppercase tracking-wider">
              👑 ADMIN ACTIVE
            </span>
            <span className="text-slate-200">
              Viewing Farmer Desk as <strong className="text-white">{currentUser?.name}</strong> ({currentUser?.role}). Admins have full access to both Farmer Desk and Admin Console.
            </span>
          </div>
          <button
            onClick={() => setViewMode("admin")}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open Admin Console →</span>
          </button>
        </div>
      )}

      {/* Main Body with Sidebar + Content Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Deep Forest Green Sidebar matching PDF */}
        <Sidebar />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
          {activeTab === "overview" && <OverviewView />}
          {activeTab === "gis-field-map" && <GisFieldMapView />}
          {activeTab === "crop-guide" && <CropGuideView />}
          {activeTab === "leaf-scan" && <LeafScanView />}
          {activeTab === "risk-forecast" && <RiskForecastView />}
          {activeTab === "ndvi" && <NdviNutrientsView />}
          {activeTab === "yield" && <YieldEstimateView />}
          {activeTab === "market" && <MarketPricesView />}
          {activeTab === "seed-bazaar" && <SeedBazaarView />}
          {activeTab === "aiot-lab" && <AiotLabView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile/tablet < 1024px) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0d2818]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#1a4228] px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-inset-bottom">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "overview"
              ? "text-emerald-700 dark:text-emerald-400 font-bold scale-105"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{language === "kn" ? "ಮುಖಪುಟ" : "Desk"}</span>
        </button>

        <button
          onClick={() => setActiveTab("leaf-scan")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "leaf-scan"
              ? "text-emerald-700 dark:text-emerald-400 font-bold scale-105"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <ScanLine className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{language === "kn" ? "ಸ್ಕ್ಯಾನ್" : "Scan"}</span>
        </button>

        {/* Center Elevated Voice Copilot Action */}
        <button
          onClick={() => setCopilotOpen(true)}
          className="flex flex-col items-center -mt-6 group"
          title="Open Kisan Mitra AI Voice Copilot"
        >
          <div className="w-13 h-13 p-3 rounded-full bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-900/40 ring-4 ring-white dark:ring-slate-900 group-hover:scale-110 active:scale-95 transition-transform duration-150">
            <Sparkles className="w-6 h-6 text-krishi-gold animate-pulse" />
          </div>
          <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
            {language === "kn" ? "ಮಿತ್ರ AI" : "Copilot"}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("risk-forecast")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "risk-forecast"
              ? "text-emerald-700 dark:text-emerald-400 font-bold scale-105"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <CloudRain className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{language === "kn" ? "ಹವಾಮಾನ" : "Weather"}</span>
        </button>

        <button
          onClick={() => setActiveTab("market")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "market"
              ? "text-emerald-700 dark:text-emerald-400 font-bold scale-105"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{language === "kn" ? "ಮಾರುಕಟ್ಟೆ" : "Market"}</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center py-1 px-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{language === "kn" ? "ಇನ್ನಷ್ಟು" : "More"}</span>
        </button>
      </nav>

      {/* Global Kisan Mitra Voice & Agentic Reasoner Copilot Modal */}
      <KisanMitraModal />
    </div>
  );
}
