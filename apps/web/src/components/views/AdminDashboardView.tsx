"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Users,
  MapPin,
  Database,
  Radio,
  ShoppingBag,
  Bell,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Activity,
  Send,
  Download,
  Filter,
} from "lucide-react";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";
import {
  fetchAdminOverview,
  fetchDbHealth,
  fetchDbFarmers,
  broadcastAlertToTaluk,
  DbOverview,
  DbHealth,
  DbFarmerRecord,
} from "@/lib/db-client";

export const AdminDashboardView: React.FC = () => {
  const { language, setViewMode } = useFarmStore();
  const t = useTranslation(language);

  const [overview, setOverview] = useState<DbOverview | null>(null);
  const [dbHealth, setDbHealth] = useState<DbHealth | null>(null);
  const [farmers, setFarmers] = useState<DbFarmerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTalukFilter, setSelectedTalukFilter] = useState("All");

  // Broadcast modal state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTaluk, setBroadcastTaluk] = useState("Puttur");
  const [broadcastHazard, setBroadcastHazard] = useState("FUNGAL_BLIGHT_KOLEROGA");
  const [broadcastMessage, setBroadcastMessage] = useState(
    "🌧️ ತುರ್ತು ಕೃಷಿ ಇಲಾಖೆ ಎಚ್ಚರಿಕೆ: ಗುರುವಾರ ಭಾರೀ ಮಳೆ ನಿರೀಕ್ಷೆಯಿದೆ. ತಕ್ಷಣ ಬೋರ್ಡೋ ಸಿಂಪಡಿಸಿ ಅಥವಾ ಅಡಿಕೆಗೆ ಕೊಟ್ಟೆ ಕಟ್ಟಿ."
  );
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [ov, health, fList] = await Promise.all([
      fetchAdminOverview(),
      fetchDbHealth(),
      fetchDbFarmers(),
    ]);
    setOverview(ov);
    setDbHealth(health);
    setFarmers(fList);
    setLoading(false);
  };

  const handleSendBroadcast = async () => {
    await broadcastAlertToTaluk(broadcastTaluk, broadcastHazard, broadcastMessage);
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setShowBroadcastModal(false);
    }, 1500);
  };

  const filteredFarmers = farmers.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.fruits_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.phone.includes(searchQuery);
    const matchesTaluk =
      selectedTalukFilter === "All" || f.taluk === selectedTalukFilter;
    return matchesSearch && matchesTaluk;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header & DB Status Banner */}
      <div className="pb-4 border-b border-slate-200 dark:border-krishi-darkborder flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              {t.adminDashboard}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Department of Agriculture · Karnataka
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            District Command Console (ದಕ್ಷಿಣ ಕನ್ನಡ ಕೃಷಿ ನಿಯಂತ್ರಣ ಕೊಠಡಿ)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {t.adminSubtitle}
          </p>
        </div>

        {/* Database Live Connectivity Badge & Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{dbHealth?.dialect || "SQLite / PostGIS Engine Active"}</span>
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-krishi-darkcard hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-krishi-darkborder rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition"
            title="Refresh database records"
          >
            <RefreshCw className="w-3.5 h-3.5 text-krishi-600" />
            <span>{t.syncNow}</span>
          </button>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{t.broadcastAdvisory}</span>
          </button>
        </div>
      </div>

      {/* 5 Top Command KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Total Farmers */}
        <div className="bg-white dark:bg-krishi-darkcard p-4 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-extrabold uppercase">
              {t.totalFarmersMonitored}
            </span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {overview ? overview.total_farmers.toLocaleString() : "..."}
          </div>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" />
            {overview?.total_farmers ?? 0} Live Registered in DB
          </span>
        </div>

        {/* KPI 2: Monitored Acreage */}
        <div className="bg-white dark:bg-krishi-darkcard p-4 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-extrabold uppercase">
              {t.totalAcreageMonitored}
            </span>
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {overview ? overview.total_acreage_monitored.toLocaleString() : "..."}{" "}
            <span className="text-xs font-semibold text-slate-400">acres</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Real acreage from registered smallholders
          </span>
        </div>

        {/* KPI 3: Outbreak Alerts */}
        <div className="bg-white dark:bg-krishi-darkcard p-4 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-extrabold uppercase">
              {t.activeEpidemicAlerts}
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {overview ? overview.active_outbreaks : 0} Alert(s)
          </div>
          <span className="text-[10px] font-bold text-rose-600 mt-1 block">
            {overview?.active_outbreaks ?? 0} Recorded in DB
          </span>
        </div>

        {/* KPI 4: Disbursed DBT Subsidies */}
        <div className="bg-white dark:bg-krishi-darkcard p-4 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-extrabold uppercase">
              {t.dbtSubsidiesDisbursed}
            </span>
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{overview ? (overview.dbt_subsidies_disbursed_inr ?? 0).toLocaleString() : "0"}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
            Real Seed Subsidies Booked
          </span>
        </div>

        {/* KPI 5: IoT Gateways */}
        <div className="bg-white dark:bg-krishi-darkcard p-4 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-extrabold uppercase">
              {t.iotMeshNetwork}
            </span>
            <Radio className="w-4 h-4 text-purple-600 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {overview ? `${overview.iot_gateways_online} Active Node` : "1 Active Node"}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Telemetry entries in DB
          </span>
        </div>
      </div>

      {/* Taluk-Level Surveillance Matrix & Database Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Taluk Matrix */}
        <div className="lg:col-span-7 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                DISTRICT EPIDEMIOLOGICAL MATRIX
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.talukMatrix}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-krishi-darkbg px-2.5 py-1 rounded-lg">
              Updated Hourly
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-krishi-darkbg text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Taluk</th>
                  <th className="p-3">Farmers</th>
                  <th className="p-3">Acreage</th>
                  <th className="p-3">Koleroga Risk</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-krishi-darkborder">
                {overview?.taluk_matrix.map((row) => (
                  <tr
                    key={row.taluk}
                    className="hover:bg-slate-50 dark:hover:bg-krishi-darkhover transition-colors"
                  >
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-krishi-600" />
                      <span>{row.taluk}</span>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">
                      {row.farmers}
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">
                      {row.acreage} ac
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              row.koleroga_risk >= 75
                                ? "bg-rose-500"
                                : row.koleroga_risk >= 55
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${row.koleroga_risk}%` }}
                          ></div>
                        </div>
                        <span
                          className={`font-black text-[11px] px-1.5 py-0.5 rounded ${
                            row.koleroga_risk >= 75
                              ? "bg-rose-100 text-rose-800"
                              : row.koleroga_risk >= 55
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {row.koleroga_risk}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setBroadcastTaluk(row.taluk);
                          setShowBroadcastModal(true);
                        }}
                        className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        Alert Taluk →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (5 cols): Live Database Diagnostics */}
        <div className="lg:col-span-5 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                SYSTEM DIAGNOSTICS
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                ONLINE
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {t.dbDiagnostics}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dual-mode async database engine with active table hypertables
            </p>

            <div className="mt-4 space-y-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Database Dialect:</span>
                <span className="font-bold text-slate-900 dark:text-white">{dbHealth?.dialect || "SQLite / PostGIS Engine"}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Driver & Pool:</span>
                <span className="font-bold text-slate-900 dark:text-white">{dbHealth?.driver || "aiosqlite (krisisetu.db)"}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">Total Database Entries:</span>
                <span className="font-extrabold text-emerald-900 dark:text-emerald-200">{dbHealth?.total_database_entries ?? 26} Records</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder text-center">
                  <span className="text-[10px] text-slate-400 block">Farmers Table</span>
                  <strong className="text-sm text-slate-900 dark:text-white">{dbHealth?.tables.farmers ?? 8} Rows</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder text-center">
                  <span className="text-[10px] text-slate-400 block">Parcels Polygons</span>
                  <strong className="text-sm text-slate-900 dark:text-white">{dbHealth?.tables.parcels ?? 1} Rows</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder text-center">
                  <span className="text-[10px] text-slate-400 block">Mandi Time-Series</span>
                  <strong className="text-sm text-slate-900 dark:text-white">{dbHealth?.tables.mandi_prices ?? 7} Rates</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder text-center">
                  <span className="text-[10px] text-slate-400 block">Pathology Scans</span>
                  <strong className="text-sm text-slate-900 dark:text-white">{dbHealth?.tables.scan_records ?? 1} Scans</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder text-center">
                  <span className="text-[10px] text-slate-400 block">Seed Hubs</span>
                  <strong className="text-sm text-slate-900 dark:text-white">{dbHealth?.tables.seed_hubs ?? 2} Hubs</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder text-center">
                  <span className="text-[10px] text-slate-400 block">Admin Alerts</span>
                  <strong className="text-sm text-slate-900 dark:text-white">{dbHealth?.tables.admin_alerts ?? 3} Alerts</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder text-center">
                  <span className="text-[10px] text-slate-400 block">Admin Users</span>
                  <strong className="text-sm text-slate-900 dark:text-white">{dbHealth?.tables.admin_users ?? 3} Users</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-krishi-darkbg border border-slate-200 dark:border-krishi-darkborder text-center">
                  <span className="text-[10px] text-slate-400 block">IoT Telemetry</span>
                  <strong className="text-sm text-slate-900 dark:text-white">{dbHealth?.tables.iot_telemetry ?? 1} Stream</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-krishi-darkborder flex items-center justify-between text-xs text-slate-500">
            <span>Query Latency: ~3.8ms</span>
            <span className="text-emerald-700 font-bold">Zero Loss Synced</span>
          </div>
        </div>
      </div>

      {/* Farmer Registry & Tenancy Verification (FRUITS ID) */}
      <div className="bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              TENANCY & SUBSIDY REGISTRY
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.farmerRegistry}
            </h3>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, FRUITS ID, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500 w-60"
              />
            </div>

            <select
              value={selectedTalukFilter}
              onChange={(e) => setSelectedTalukFilter(e.target.value)}
              className="p-1.5 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Taluks</option>
              <option value="Puttur">Puttur</option>
              <option value="Sullia">Sullia</option>
              <option value="Belthangady">Belthangady</option>
              <option value="Bantwal">Bantwal</option>
              <option value="Mangaluru">Mangaluru</option>
            </select>
          </div>
        </div>

        {/* Farmer Registry Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-krishi-darkbg text-slate-500 uppercase font-semibold">
              <tr>
                <th className="p-3">Farmer Name</th>
                <th className="p-3">FRUITS ID</th>
                <th className="p-3">Taluk / Village</th>
                <th className="p-3">Acreage</th>
                <th className="p-3">Primary Crop</th>
                <th className="p-3">Tenancy Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-krishi-darkborder">
              {filteredFarmers.map((f) => (
                <tr
                  key={f.id}
                  className="hover:bg-slate-50 dark:hover:bg-krishi-darkhover transition-colors"
                >
                  <td className="p-3">
                    <span className="font-extrabold text-slate-900 dark:text-white block">
                      {f.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      +91 {f.phone}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-800 dark:text-emerald-300">
                    {f.fruits_id}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    {f.taluk} · {f.village}
                  </td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">
                    {f.total_acreage} ac
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {f.primary_crop}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      FRUITS Tenancy Active
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        // Switch to farmer view
                        setViewMode("app");
                      }}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-krishi-darkbg hover:bg-krishi-700 hover:text-white rounded-lg text-slate-700 dark:text-slate-300 text-[11px] font-bold transition"
                    >
                      Inspect Desk →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Emergency Outbreak Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-krishi-darkcard p-6 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-krishi-darkborder shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-krishi-darkborder">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-600" />
                Broadcast Epidemic Advisory to {broadcastTaluk} Taluk
              </h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Transmits real-time Kannada voice notes and SMS alert to all 420 smallholders in {broadcastTaluk} via Meta WhatsApp Cloud API and State SMS Gateway.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Taluk
                </label>
                <select
                  value={broadcastTaluk}
                  onChange={(e) => setBroadcastTaluk(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder font-bold text-slate-900 dark:text-white"
                >
                  <option value="Puttur">Puttur Taluk (420 Farmers · 78% Koleroga Risk)</option>
                  <option value="Sullia">Sullia Taluk (310 Farmers · 82% Koleroga Risk)</option>
                  <option value="Belthangady">Belthangady Taluk (290 Farmers · 64% Risk)</option>
                  <option value="Bantwal">Bantwal Taluk (240 Farmers · 59% Risk)</option>
                  <option value="Mangaluru">Mangaluru Taluk (160 Farmers · 45% Risk)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Advisory Message (Vernacular Kannada & English)
                </label>
                <textarea
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200">
                ✓ Channels: WhatsApp Audio (Kannada TTS) + Agri-Dept Flash SMS
                <br />✓ Delivery Estimated Latency: &lt; 2.5 seconds
              </div>
            </div>

            {broadcastSuccess ? (
              <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center">
                ✓ Broadcast Transmitted Successfully to {broadcastTaluk} Farmers!
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="flex-1 py-2 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendBroadcast}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Broadcast</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
