"use client";

import React from "react";
import {
  LayoutDashboard,
  Sprout,
  ScanLine,
  CloudRain,
  Eye,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Cpu,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Lock,
  X,
} from "lucide-react";
import { useFarmStore, ActiveTab, isUserAdmin } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";

export const Sidebar: React.FC = () => {
  const {
    farmerName,
    location,
    acreage,
    language,
    activeTab,
    setActiveTab,
    copilotOpen,
    setCopilotOpen,
    setViewMode,
    currentUser,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useFarmStore();

  const isAdmin = isUserAdmin(currentUser);
  const t = useTranslation(language);

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: "overview", label: t.overview, icon: LayoutDashboard },
    { id: "gis-field-map", label: language === "kn" ? "ಜಿಐಎಸ್ ನಕ್ಷೆ" : "GIS & Field Map", icon: MapPin, badge: "GIS" },
    { id: "crop-guide", label: t.cropGuide, icon: Sprout, badge: "01" },
    { id: "leaf-scan", label: t.leafScan, icon: ScanLine, badge: "02" },
    { id: "risk-forecast", label: t.riskForecast, icon: CloudRain, badge: "03" },
    { id: "ndvi", label: t.ndviNutrients, icon: Eye, badge: "04" },
    { id: "yield", label: t.yieldEstimate, icon: BarChart3, badge: "05" },
    { id: "market", label: t.marketPrices, icon: TrendingUp, badge: "06" },
    { id: "seed-bazaar", label: t.seedBazaar, icon: ShoppingBag, badge: "SATHI" },
    { id: "aiot-lab", label: t.aiotLab, icon: Cpu, badge: "IoT" },
  ];

  const renderContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Farmer Profile Card in Sidebar */}
      <div className="p-4 border-b border-[#1b4a2e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-krishi-gold text-slate-950 font-black flex items-center justify-center text-sm shadow-md ring-2 ring-krishi-gold/30">
              SG
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-white truncate leading-snug">
                {farmerName}
              </h3>
              <p className="text-[11px] text-emerald-200/80 truncate">
                {location} · {acreage} acres
              </p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Farm Status indicator */}
        <div className="mt-3 flex items-center gap-2 bg-[#143a23] px-2.5 py-1.5 rounded-lg border border-[#235838]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="text-[11px] font-medium text-emerald-200">
            {t.farmStatusHealthy}
          </span>
        </div>
      </div>

      {/* Section Header */}
      <div className="px-4 pt-4 pb-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300/70">
          {t.farmDesk}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/30 ring-1 ring-emerald-400/40 translate-x-1"
                  : "text-emerald-100/90 hover:bg-[#153e24] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-krishi-gold" : "text-emerald-300/80"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isActive
                      ? "bg-emerald-700/80 text-white"
                      : "bg-[#184628] text-emerald-300 border border-[#246138]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section: Admin Entry / Status & Voice Copilot */}
      <div className="p-3 border-t border-[#1b4a2e] space-y-2 mt-auto">
        {isAdmin ? (
          <button
            onClick={() => {
              setViewMode("admin");
              if (isMobile) setMobileMenuOpen(false);
            }}
            className="w-full bg-gradient-to-r from-indigo-900/60 to-purple-900/40 hover:from-indigo-900/80 hover:to-purple-900/60 border border-indigo-400/40 p-2 rounded-xl flex items-center justify-between text-left text-xs font-bold text-white transition group shadow-sm"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-krishi-gold" />
              <div>
                <span className="block leading-tight">Admin Console</span>
                <span className="text-[9px] text-indigo-200/80 block leading-tight font-normal">Super Admin Mode</span>
              </div>
            </div>
            <span className="text-[9px] font-bold bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700">
              Active
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              setViewMode("admin");
              if (isMobile) setMobileMenuOpen(false);
            }}
            className="w-full bg-[#122c1b] hover:bg-[#183622] border border-[#1f472d] p-2 rounded-xl flex items-center justify-between text-left text-xs font-semibold text-slate-300 transition group"
            title="Admin authorization required"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <div>
                <span className="block leading-tight text-emerald-100">Admin Console</span>
                <span className="text-[9px] text-amber-300/80 block leading-tight">Admin Sign-In Only</span>
              </div>
            </div>
            <span className="text-[9px] font-bold bg-amber-950/60 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/60">
              Locked
            </span>
          </button>
        )}

        <button
          onClick={() => {
            setCopilotOpen(!copilotOpen);
            if (isMobile) setMobileMenuOpen(false);
          }}
          className="w-full bg-gradient-to-r from-emerald-600/40 to-emerald-500/20 hover:from-emerald-600/60 hover:to-emerald-500/40 border border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-between text-left transition-all group"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/30 flex items-center justify-center text-krishi-gold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-white block leading-tight">
                {t.kisanMitra}
              </span>
              <span className="text-[9px] text-emerald-200/70 block leading-tight">
                Kannada-First AI Copilot
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile/tablet screens < 1024px) */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[#0d2818] text-white flex-col min-h-[calc(100vh-4rem)] border-r border-[#1a4228] select-none shadow-xl">
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer (Slide-in menu for small screens) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-[#0d2818] text-white flex flex-col h-full shadow-2xl border-r border-[#1a4228] z-10 animate-in slide-in-from-left duration-200">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
