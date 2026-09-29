"use client";

import React from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ScanLine,
  Eye,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Droplets,
  Layers,
  ChevronRight,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";

export const LandingPageView: React.FC = () => {
  const { setViewMode, setActiveTab, language, setLanguage, theme, toggleTheme } = useFarmStore();
  const t = useTranslation(language);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-krishi-darkbg text-slate-900 dark:text-white transition-colors animate-fadeIn">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-40 bg-[#0d2818]/95 backdrop-blur-md text-white border-b border-[#1a4228] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-krishi-gold text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
            🌿
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-white block leading-tight">
              KrishiSetu
            </span>
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block leading-tight">
              FARM INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Center Links matching screenshot on page 18 */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-emerald-100">
          <button onClick={() => setViewMode("app")} className="hover:text-white transition-colors">
            How it works
          </button>
          <button onClick={() => setViewMode("app")} className="hover:text-white transition-colors">
            Farm tools
          </button>
          <button onClick={() => setViewMode("app")} className="hover:text-white transition-colors">
            Farmer stories
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "kn" ? "en" : "kn")}
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5 text-krishi-gold" />
            <span>{language === "kn" ? "English" : "ಕನ್ನಡ"}</span>
          </button>

          <button
            onClick={() => setViewMode("signin")}
            className="text-xs font-bold text-white hover:text-emerald-200 px-3 py-1.5"
          >
            Sign in
          </button>

          <button
            onClick={() => setViewMode("app")}
            className="px-4 py-2 bg-krishi-gold hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all hover:scale-105 flex items-center gap-1.5"
          >
            <span>Try Farm AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section matching PDF page 18 top screenshot */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0d2818] via-[#10331f] to-[#07170e] text-white py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs px-3 py-1.5 rounded-full font-bold">
              <span>🌱</span>
              <span>Built for Dakshina Kannada farmers</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Better decisions. <br />
              <span className="text-krishi-gold">Healthier farms.</span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl font-normal leading-relaxed">
              One calm, practical view of your crop health, disease risk, nutrients, yield and local market prices.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setViewMode("app")}
                className="px-6 py-3.5 bg-krishi-gold hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>Explore Farm AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setViewMode("app");
                  setActiveTab("crop-guide");
                }}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/20 transition-all flex items-center gap-1.5"
              >
                <span>See the tools</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-6 border-t border-emerald-900/60 flex items-center gap-4 text-xs text-emerald-300/80">
              <span>© Local agronomy guidance</span>
              <span>·</span>
              <span>Monsoon-aware insights</span>
            </div>
          </div>

          {/* Hero Right: "FARM PULSE" Card matching page 18 */}
          <div className="lg:col-span-5">
            <div className="bg-[#143a24]/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-600/30">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                    FARM PULSE
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    Shrinivasa Farm
                  </h3>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE
                </span>
              </div>

              {/* Crop Health Bar */}
              <div className="p-4 bg-[#0d2818] rounded-2xl border border-emerald-500/20 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-200">Crop health:</span>
                  <strong className="text-white font-mono">0.76 NDVI</strong>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "76%" }}></div>
                </div>
                <span className="text-[11px] text-emerald-300 block">
                  Healthy canopy · 4.2 acres monitored
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-[#0d2818] rounded-2xl border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-300 uppercase block font-semibold">
                    Rain Chance
                  </span>
                  <span className="text-2xl font-black text-white mt-1 block">
                    68%
                  </span>
                </div>

                <div className="p-3 bg-[#0d2818] rounded-2xl border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-300 uppercase block font-semibold">
                    Market Trend
                  </span>
                  <span className="text-2xl font-black text-emerald-400 mt-1 block">
                    +4.2%
                  </span>
                </div>
              </div>

              {/* Ready Action Pill */}
              <button
                onClick={() => setViewMode("app")}
                className="w-full p-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-2xl text-xs font-bold text-emerald-200 text-center flex items-center justify-center gap-2 transition"
              >
                <span>⚡ 3 actions ready for today</span>
                <ArrowRight className="w-3.5 h-3.5 text-krishi-gold" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: "MADE FOR THE COAST" matching PDF page 23 */}
      <section className="py-16 px-4 sm:px-8 border-b border-slate-200 dark:border-krishi-darkborder bg-white dark:bg-krishi-darkcard">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-krishi-700 dark:text-krishi-400">
              MADE FOR THE COAST
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Your farm, with its own context.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              From laterite soil to southwest monsoon patterns, every recommendation is framed for how farming works here.
            </p>
            <button
              onClick={() => setViewMode("app")}
              className="text-xs font-bold text-krishi-700 dark:text-krishi-400 hover:underline flex items-center gap-1 pt-2"
            >
              <span>See your farm view</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stats Boxes matching page 23 */}
          <div className="flex flex-wrap gap-4">
            <div className="p-6 bg-[#0f2d1e] text-white rounded-3xl min-w-[140px] text-center shadow-md">
              <span className="text-3xl font-black block">3,500+</span>
              <span className="text-xs text-emerald-200 mt-1 block">acres monitored</span>
            </div>

            <div className="p-6 bg-slate-100 dark:bg-krishi-darkbg rounded-3xl min-w-[120px] text-center border border-slate-200 dark:border-krishi-darkborder">
              <span className="text-3xl font-black text-slate-900 dark:text-white block">7</span>
              <span className="text-xs text-slate-500 mt-1 block">taluks connected</span>
            </div>

            <div className="p-6 bg-amber-50 dark:bg-amber-950/40 rounded-3xl min-w-[120px] text-center border border-amber-200 dark:border-amber-900/50">
              <span className="text-3xl font-black text-amber-800 dark:text-amber-300 block">24/7</span>
              <span className="text-xs text-amber-700 dark:text-amber-400 mt-1 block">climate telemetry</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: "From field signals to a clear next step" matching PDF page 23 */}
      <section className="py-16 px-4 sm:px-8 bg-slate-50 dark:bg-krishi-darkbg">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              YOUR EVERYDAY FARM COMPANION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              From field signals to a clear next step.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              No complicated dashboards. KrishiSetu brings the signals that matter together in language that helps you act.
            </p>
          </div>

          {/* 3 Pillar Cards matching screenshot on page 23 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Spot disease early */}
            <div className="bg-white dark:bg-krishi-darkcard p-6 rounded-3xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <ScanLine className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Spot disease early
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Take a leaf photo and get a clear, practical treatment plan in minutes.
                </p>
              </div>

              <button
                onClick={() => {
                  setViewMode("app");
                  setActiveTab("leaf-scan");
                }}
                className="text-xs font-bold text-slate-900 dark:text-white hover:text-krishi-600 dark:hover:text-krishi-400 flex items-center gap-1 pt-2"
              >
                <span>Explore tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: See what your farm needs */}
            <div className="bg-white dark:bg-krishi-darkcard p-6 rounded-3xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  See what your farm needs
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  NDVI insights turn satellite signals into simple nutrient actions.
                </p>
              </div>

              <button
                onClick={() => {
                  setViewMode("app");
                  setActiveTab("ndvi");
                }}
                className="text-xs font-bold text-slate-900 dark:text-white hover:text-krishi-600 dark:hover:text-krishi-400 flex items-center gap-1 pt-2"
              >
                <span>Explore tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Sell with confidence */}
            <div className="bg-white dark:bg-krishi-darkcard p-6 rounded-3xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Sell with confidence
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Compare nearby APMC rates and follow the right market movement.
                </p>
              </div>

              <button
                onClick={() => {
                  setViewMode("app");
                  setActiveTab("market");
                }}
                className="text-xs font-bold text-slate-900 dark:text-white hover:text-krishi-600 dark:hover:text-krishi-400 flex items-center gap-1 pt-2"
              >
                <span>Explore tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer matching PDF */}
      <footer className="bg-[#091b10] text-emerald-200/80 py-10 px-4 sm:px-8 border-t border-[#153e24]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌾</span>
            <div>
              <span className="font-extrabold text-white text-base block">
                KrishiSetu
              </span>
              <span className="text-[11px] text-emerald-300 block">
                Simple intelligence for the farms of coastal Karnataka.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button onClick={() => setViewMode("app")} className="hover:text-white">
              Launch Farm Desk
            </button>
            <span>·</span>
            <button onClick={() => setViewMode("signin")} className="hover:text-white">
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
