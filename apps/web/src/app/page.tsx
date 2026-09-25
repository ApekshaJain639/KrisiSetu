"use client";

import React, { useEffect, useState } from "react";
import { useFarmStore } from "@/stores/useFarmStore";
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

export default function AppHome() {
  const { viewMode, activeTab, theme } = useFarmStore();
  const [mounted, setMounted] = useState(false);

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

      {/* Main Body with Sidebar + Content Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Deep Forest Green Sidebar matching PDF */}
        <Sidebar />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
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

      {/* Global Kisan Mitra Voice & Agentic Reasoner Copilot Modal */}
      <KisanMitraModal />
    </div>
  );
}
