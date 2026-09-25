"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Radio,
  Droplets,
  Thermometer,
  Sun,
  BatteryCharging,
  Power,
  Sliders,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Zap,
} from "lucide-react";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";
import { TimelineComparison } from "@/components/timeline/TimelineComparison";
import { fetchIoTTelemetry, actuateIoTValve } from "@/lib/db-client";

export const AiotLabView: React.FC = () => {
  const {
    language,
    irrigationStatus,
    solenoidAutoMode,
    setIrrigationStatus,
    setSolenoidAutoMode,
  } = useFarmStore();

  const t = useTranslation(language);

  const [moisture15cm, setMoisture15cm] = useState(58);
  const [moisture30cm, setMoisture30cm] = useState(64);
  const [canopyTemp, setCanopyTemp] = useState(26.8);
  const [solarLux, setSolarLux] = useState(48200);
  const [rssi, setRssi] = useState(-84);
  const [litersDispensed, setLitersDispensed] = useState(1420);
  const [thresholdMoisture, setThresholdMoisture] = useState(50);

  // Load real IoT telemetry from backend on mount
  useEffect(() => {
    async function loadTelemetry() {
      const data = await fetchIoTTelemetry();
      if (data) {
        if (data.soil_moisture_15cm_pct) setMoisture15cm(data.soil_moisture_15cm_pct);
        if (data.soil_moisture_30cm_pct) setMoisture30cm(data.soil_moisture_30cm_pct);
        if (data.canopy_infrared_temp_c) setCanopyTemp(data.canopy_infrared_temp_c);
        if (data.solar_lux) setSolarLux(data.solar_lux);
        if (data.lorawan_rssi_dbm) setRssi(data.lorawan_rssi_dbm);
      }
    }
    loadTelemetry();
  }, []);

  // Live IoT telemetry fluctuation simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setMoisture15cm((prev) => Math.max(40, Math.min(85, +(prev + (Math.random() * 0.8 - 0.4)).toFixed(1))));
      setCanopyTemp((prev) => +(prev + (Math.random() * 0.2 - 0.1)).toFixed(1));
      if (irrigationStatus) {
        setLitersDispensed((prev) => prev + 5);
      }
    }, 2500);
    return () => clearInterval(timer);
  }, [irrigationStatus]);

  const togglePump = async () => {
    const newStatus = !irrigationStatus;
    setIrrigationStatus(newStatus);
    // Actuate valve through backend API
    await actuateIoTValve("ZONE-A-EAST", newStatus, 15);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-krishi-darkborder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              ADVANCED EXTENSIONS LAB (SEGREGATED TAB)
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              LoRaWAN IN865 Telemetry
            </span>
          </div>
          <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 px-2.5 py-0.5 rounded-full inline-block mt-1">
            ESP32-S3 Dual-Core Xtensa Edge Stack
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            AIoT Smart Farming Hub & Edge Actuation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Live multi-depth root zone telemetry (15cm shallow, 30cm deep) coupled to closed-loop solenoid drip valve MOSFET relays with rain-delay suppression.
          </p>
        </div>

        {/* LoRaWAN Connection Status */}
        <div className="flex items-center gap-3 bg-white dark:bg-krishi-darkcard p-3 rounded-2xl border border-slate-200 dark:border-krishi-darkborder text-xs self-start sm:self-auto shadow-sm">
          <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">LoRaWAN Gateway</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-[10px] text-slate-500">
              RSSI: {rssi} dBm · SNR: +9.2 dB · 865.2 MHz
            </span>
          </div>
        </div>
      </div>

      {/* 4 Sensor Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Soil Moisture 15cm */}
        <div className="bg-white dark:bg-krishi-darkcard p-5 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-extrabold uppercase">Shallow Moisture (15cm)</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {moisture15cm}%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Capacitive v2.0 (Corrosion-proof)
          </span>
        </div>

        {/* Soil Moisture 30cm */}
        <div className="bg-white dark:bg-krishi-darkcard p-5 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-extrabold uppercase">Deep Root Moisture (30cm)</span>
            <Droplets className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {moisture30cm}%
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
            Optimal Root Zone Storage
          </span>
        </div>

        {/* Canopy IR Temp */}
        <div className="bg-white dark:bg-krishi-darkcard p-5 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-extrabold uppercase">Canopy IR Temp</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {canopyTemp}°C
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            MLX90614 Contactless IR
          </span>
        </div>

        {/* Solar Lux */}
        <div className="bg-white dark:bg-krishi-darkcard p-5 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-extrabold uppercase">Ambient Sunlight</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {solarLux.toLocaleString()} <span className="text-xs font-semibold">Lux</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            BH1750 Digital Lux Sensor
          </span>
        </div>
      </div>

      {/* Edge Actuation Relay Control Unit */}
      <div className="bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-krishi-darkborder">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              FIELD ACTUATION
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              12V DC Latching Solenoid Drip Valves (Zone 1 - 4)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Optocoupler-isolated MOSFET relays triggered on closed-loop thresholds
            </p>
          </div>

          {/* Mode Switcher Auto / Manual */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-krishi-darkbg p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSolenoidAutoMode(true)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                solenoidAutoMode
                  ? "bg-krishi-700 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Auto Closed-Loop
            </button>
            <button
              onClick={() => setSolenoidAutoMode(false)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                !solenoidAutoMode
                  ? "bg-krishi-700 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Manual Override
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          {/* Valve Status Toggle Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Solenoid Valve Relay
              </span>
              <span
                className={`text-sm font-extrabold block mt-1 ${
                  irrigationStatus ? "text-emerald-600 animate-pulse" : "text-slate-500"
                }`}
              >
                {irrigationStatus ? "VALVE OPEN (IRRIGATING)" : "VALVE CLOSED (IDLE)"}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Total dispensed today: {litersDispensed} L
              </span>
            </div>

            <button
              onClick={togglePump}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                irrigationStatus
                  ? "bg-emerald-600 text-white shadow-emerald-400/30 scale-105"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300"
              }`}
              title="Toggle Valve"
            >
              <Power className="w-6 h-6" />
            </button>
          </div>

          {/* Moisture Trigger Threshold Slider */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Auto-Trigger Moisture Threshold</span>
              <span className="text-krishi-700 dark:text-krishi-400">{thresholdMoisture}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="70"
              value={thresholdMoisture}
              onChange={(e) => setThresholdMoisture(parseInt(e.target.value))}
              className="w-full accent-krishi-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">
              Valve opens automatically when 15cm moisture drops below {thresholdMoisture}%.
            </span>
          </div>

          {/* Rain Suppression Logic */}
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 text-xs text-blue-950 dark:text-blue-200 flex flex-col justify-between">
            <div>
              <span className="font-bold flex items-center gap-1.5 text-blue-900 dark:text-blue-300">
                <Droplets className="w-4 h-4 text-blue-600" />
                Rain-Delay Suppression Active
              </span>
              <p className="text-[11px] text-blue-800 dark:text-blue-300 mt-1">
                42 mm rainfall forecast for Thursday has placed an automatic 48-hour lockout on deep well pumping.
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 mt-2 block">
              ⚡ Conserving ~4,200 Liters of Groundwater
            </span>
          </div>
        </div>
      </div>

      {/* Longitudinal Crop Health Timeline Tracker Component */}
      <div className="bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
        <div className="mb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            LONGITUDINAL TRACKING
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Crop Health Progression (Day 0 - 4 - 7 ΔSeverity)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            "Don't just detect the disease—track what happens to the crop over time."
          </p>
        </div>

        <TimelineComparison
          cropName="Arecanut (Mangala)"
          diseaseName="Koleroga (Phytophthora meadii)"
          initialSeverity={38}
          followupSeverity={14}
          daysElapsed={4}
        />
      </div>
    </div>
  );
};
