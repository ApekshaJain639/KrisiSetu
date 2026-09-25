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
} from "lucide-react";
import { useFarmStore, ActiveTab } from "@/stores/useFarmStore";
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
  } = useFarmStore();

  const t = useTranslation(language);

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: "overview", label: t.overview, icon: LayoutDashboard },
    { id: "crop-guide", label: t.cropGuide, icon: Sprout, badge: "01" },
    { id: "leaf-scan", label: t.leafScan, icon: ScanLine, badge: "02" },
    { id: "risk-forecast", label: t.riskForecast, icon: CloudRain, badge: "03" },
    { id: "ndvi", label: t.ndviNutrients, icon: Eye, badge: "04" },
    { id: "yield", label: t.yieldEstimate, icon: BarChart3, badge: "05" },
    { id: "market", label: t.marketPrices, icon: TrendingUp, badge: "06" },
    { id: "seed-bazaar", label: t.seedBazaar, icon: ShoppingBag, badge: "SATHI" },
    { id: "aiot-lab", label: t.aiotLab, icon: Cpu, badge: "IoT" },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0d2818] text-white flex flex-col min-h-[calc(100vh-4rem)] border-r border-[#1a4228] select-none shadow-xl">
      {/* Farmer Profile Card in Sidebar (as seen in PDF page 18) */}
      <div className="p-4 border-b border-[#1b4a2e]">
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
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto py-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group text-left ${
                isActive
                  ? "bg-white text-[#0d2818] shadow-md font-bold"
                  : "text-emerald-100/90 hover:bg-[#153e26] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-[#0d2818]" : "text-emerald-300"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-[#164329] text-emerald-300 group-hover:bg-[#1d5534]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Voice Copilot Shortcut */}
      <div className="p-3 border-t border-[#1b4a2e]">
        <button
          onClick={() => setCopilotOpen(!copilotOpen)}
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
    </aside>
  );
};
