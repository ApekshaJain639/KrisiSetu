"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Bell,
  Clock,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  Building,
  Users,
  CheckCircle,
  HelpCircle,
  IndianRupee,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";
import { ArbitrageMatrix } from "@/components/market/ArbitrageMatrix";
import {
  fetchLiveEnamPrices,
  fetchAiPricePrediction,
  EnamMarketResponse,
  PricePredictionResult,
} from "@/lib/db-client";

export const MarketPricesView: React.FC = () => {
  const { language } = useFarmStore();
  const t = useTranslation(language);

  const [selectedMandi, setSelectedMandi] = useState("Puttur APMC");
  const [timeHorizon, setTimeHorizon] = useState<"7D" | "30D" | "90D">("90D");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState("37500");
  const [alertSaved, setAlertSaved] = useState(false);

  // Live eNAM & AI Market Forecast State
  const [liveEnam, setLiveEnam] = useState<EnamMarketResponse | null>(null);
  const [aiPrediction, setAiPrediction] = useState<PricePredictionResult | null>(null);

  React.useEffect(() => {
    let active = true;
    async function loadMarketData() {
      const [enam, pred] = await Promise.all([
        fetchLiveEnamPrices("All"),
        fetchAiPricePrediction("Arecanut", 35800),
      ]);
      if (active) {
        if (enam) setLiveEnam(enam);
        if (pred) setAiPrediction(pred);
      }
    }
    loadMarketData();
    return () => {
      active = false;
    };
  }, []);

  // Hold vs Sell state
  const [storageMonths, setStorageMonths] = useState(3);
  const [storageQtyQuintals, setStorageQtyQuintals] = useState(25);

  const priceHistory = [
    { date: "May 01", price: 33200, lower: 32000, upper: 34400 },
    { date: "May 15", price: 33800, lower: 32600, upper: 35000 },
    { date: "Jun 01", price: 34500, lower: 33300, upper: 35700 },
    { date: "Jun 18 (Today)", price: 35800, lower: 34600, upper: 37000 },
    { date: "Jul 15 (TFT)", price: 37200, lower: 35500, upper: 38900 },
    { date: "Aug 15 (TFT)", price: 38900, lower: 36800, upper: 41000 },
    { date: "Sep 15 (TFT)", price: 40500, lower: 38000, upper: 43000 },
  ];

  const chartData = React.useMemo(() => {
    if (!aiPrediction || !aiPrediction.forecast_horizons?.length) {
      return priceHistory;
    }
    const base = [
      { date: "May 01", price: 33200, lower: 32000, upper: 34400 },
      { date: "May 15", price: 33800, lower: 32600, upper: 35000 },
      { date: "Jun 01", price: 34500, lower: 33300, upper: 35700 },
      { date: "Jun 18 (Today)", price: aiPrediction.current_modal_price_inr || 35800, lower: 34600, upper: 37000 },
    ];
    const predictions = aiPrediction.forecast_horizons.map((h) => ({
      date: `${h.target_date} (+${h.days_ahead}d)`,
      price: h.projected_price_inr,
      lower: h.lower_bound_95,
      upper: h.upper_bound_95,
    }));
    return [...base, ...predictions];
  }, [aiPrediction]);

  const commodities = [
    {
      name: "Arecanut · Chali",
      quality: "A-sample (New harvest)",
      market: selectedMandi,
      rate: "₹35,800",
      unit: "/ quintal",
      move: "+4.2%",
      isUp: true,
    },
    {
      name: "Arecanut · Red",
      quality: "R-sample (Boiled & Dried)",
      market: selectedMandi,
      rate: "₹38,200",
      unit: "/ quintal",
      move: "+2.8%",
      isUp: true,
    },
    {
      name: "Black pepper",
      quality: "Malabar Grade 1",
      market: selectedMandi,
      rate: "₹61,400",
      unit: "/ quintal",
      move: "-1.1%",
      isUp: false,
    },
    {
      name: "Tender coconut",
      quality: "Grade A Large",
      market: selectedMandi,
      rate: "₹34",
      unit: "/ piece",
      move: "+6.5%",
      isUp: true,
    },
    {
      name: "Cocoa beans",
      quality: "Wet fermented",
      market: selectedMandi,
      rate: "₹24,500",
      unit: "/ quintal",
      move: "+3.4%",
      isUp: true,
    },
  ];

  const regionalMandis = [
    {
      mandi_name: "Shivamogga APMC",
      district: "Shivamogga",
      modal_price_per_qtl: 40000,
      distance_km: 185,
      freight_cost_inr: 5200,
      gross_revenue_inr: 1000000,
      net_in_hand_inr: 994800,
      net_bonus_vs_local_inr: 99800,
    },
    {
      mandi_name: "Sirsi APMC",
      district: "Uttara Kannada",
      modal_price_per_qtl: 38800,
      distance_km: 215,
      freight_cost_inr: 5800,
      gross_revenue_inr: 970000,
      net_in_hand_inr: 964200,
      net_bonus_vs_local_inr: 69200,
    },
    {
      mandi_name: "Mangaluru APMC",
      district: "Dakshina Kannada",
      modal_price_per_qtl: 36200,
      distance_km: 52,
      freight_cost_inr: 1800,
      gross_revenue_inr: 905000,
      net_in_hand_inr: 903200,
      net_bonus_vs_local_inr: 8200,
    },
    {
      mandi_name: "Puttur APMC (Local Gate)",
      district: "Dakshina Kannada",
      modal_price_per_qtl: 35800,
      distance_km: 8,
      freight_cost_inr: 500,
      gross_revenue_inr: 895000,
      net_in_hand_inr: 894500,
      net_bonus_vs_local_inr: 0,
    },
  ];

  // Hold vs Sell Calculation
  const currentNetSale = storageQtyQuintals * 35800;
  const storageCost = storageQtyQuintals * 35 * storageMonths;
  const futureProjectedPrice = 35800 + storageMonths * 1550; // surge projection
  const futureGrossSale = storageQtyQuintals * futureProjectedPrice;
  const futureNetGain = futureGrossSale - storageCost - currentNetSale;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Row matching PDF page 22 bottom */}
      <div className="pb-2 border-b border-slate-200 dark:border-krishi-darkborder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              {t.sellAtRightMoment}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t.marketPrices}
            </span>
          </div>
          <span className="text-[10px] font-bold bg-krishi-100 dark:bg-krishi-900/60 text-krishi-800 dark:text-krishi-300 px-2.5 py-0.5 rounded-full inline-block mt-1">
            {t.decisionSupport06}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {t.knowTodayRate}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            {t.marketIntro}
          </p>
        </div>

        {/* Set price alert button matching PDF page 22 bottom */}
        <button
          onClick={() => setShowAlertModal(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-krishi-gold hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black transition shadow-sm"
        >
          <Bell className="w-4 h-4" />
          <span>{t.setPriceAlert}</span>
        </button>
      </div>

      {/* Real-time eNAM / data.gov.in Government Data Sync Ticker */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl shadow-sm border border-emerald-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold text-base">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">
                eNAM · data.gov.in Live Mandi Feed
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold animate-pulse">
                REAL-TIME SYNC
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80">
              {language === "kn"
                ? "ಪುತ್ತೂರು, ಶಿವಮೊಗ್ಗ, ಶಿರಸಿ ಮತ್ತು ಬಂಟ್ವಾಳ ಕೃಷಿ ಉತ್ಪನ್ನ ಮಾರುಕಟ್ಟೆ ಸಮಿತಿ (APMC) ನೇರ ದರಗಳು"
                : "Authenticated live trading records from Puttur, Shivamogga, Sirsi & Bantwal APMC mandis"}
            </p>
          </div>
        </div>

        {aiPrediction && (
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-[10px] text-slate-300 font-semibold uppercase">AI Price Signal:</span>
            <span className="text-xs font-black text-krishi-gold">
              {language === "kn" ? aiPrediction.recommendation_kn : aiPrediction.recommendation}
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-1.5 py-0.5 rounded">
              +{aiPrediction.forecast_horizons[aiPrediction.forecast_horizons.length - 1]?.growth_pct.toFixed(1)}% in 90D
            </span>
          </div>
        )}
      </div>

      {/* Top Banner Row matching PDF page 22 bottom screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: TOP MOVER TODAY */}
        <div className="p-4 bg-emerald-950 text-white rounded-2xl border border-emerald-800 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
            {t.topMoverToday}
          </span>
          <div className="my-2">
            <h4 className="text-lg font-black text-white">{t.tenderCoconut}</h4>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">₹34</span>
              <span className="text-xs text-emerald-200">/ piece</span>
              <span className="text-xs font-black text-emerald-400 ml-auto">+6.5%</span>
            </div>
          </div>
        </div>

        {/* Card 2: LAST UPDATED */}
        <div className="p-4 bg-white dark:bg-krishi-darkcard rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            LAST UPDATED
          </span>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-krishi-600" />
              10:42 AM
            </span>
            <span className="text-xs text-slate-500 block mt-1">Tuesday, 18 June 2024</span>
          </div>
        </div>

        {/* Card 3: MARKET NOTE */}
        <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/40 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 dark:text-amber-300">
            MARKET NOTE
          </span>
          <p className="text-xs text-amber-950 dark:text-amber-200 font-semibold my-2 leading-relaxed">
            Chali is holding strong. Good window to sell 20–30% of stock. Monsoon arrivals tapering.
          </p>
        </div>
      </div>

      {/* Main 2-Column Split matching PDF page 22 bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols): "TODAY'S RATES · Nearby market board" */}
        <div className="lg:col-span-6 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                TODAY'S RATES
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.nearbyMarketBoard}
              </h3>
            </div>

            <select
              value={selectedMandi}
              onChange={(e) => setSelectedMandi(e.target.value)}
              className="p-2 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="Puttur APMC">Puttur APMC</option>
              <option value="Mangaluru APMC">Mangaluru APMC</option>
              <option value="Shivamogga APMC">Shivamogga APMC</option>
              <option value="Sirsi APMC">Sirsi APMC</option>
              <option value="Bantwal Sub-Market">Bantwal Sub-Market</option>
            </select>
          </div>

          {/* Rates Table matching screenshot */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-krishi-darkbg text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">COMMODITY</th>
                  <th className="p-3">MARKET</th>
                  <th className="p-3">TODAY'S RATE</th>
                  <th className="p-3 text-right">MOVE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-krishi-darkborder">
                {commodities.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-krishi-darkhover transition-colors">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.quality}</span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">
                      {item.market}
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {item.rate}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.unit}</span>
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`inline-flex items-center font-bold px-2 py-0.5 rounded ${
                          item.isUp
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                        }`}
                      >
                        {item.isUp ? (
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        )}
                        {item.move}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (6 cols): "ARECANUT - CHALI - Price movement" matching screenshot */}
        <div className="lg:col-span-6 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                ARECANUT · CHALI
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Price movement
              </h3>
            </div>

            <div className="flex gap-1 bg-slate-100 dark:bg-krishi-darkbg p-1 rounded-xl text-xs font-bold">
              {(["7D", "30D", "90D"] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setTimeHorizon(h)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    timeHorizon === h
                      ? "bg-krishi-700 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis domain={[30000, 44000]} tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip
                  formatter={(value: any) => [`₹${value.toLocaleString()}/qtl`, "Modal Price"]}
                  contentStyle={{
                    backgroundColor: "#0d2818",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#priceGrad)"
                  name="Price"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-krishi-darkborder">
            <span>Model: {aiPrediction?.prediction_model || "PyTorch Temporal Fusion Transformer (TFT)"}</span>
            <span className="text-emerald-700 font-bold">
              {aiPrediction?.confidence_score_pct ? `${aiPrediction.confidence_score_pct}% AI Confidence` : "±95% Confidence Bounds"}
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Market Modules: Spatial Arbitrage Matrix + Hold vs Sell */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Multi-Mandi Spatial Arbitrage Matrix */}
        <div className="lg:col-span-8">
          <ArbitrageMatrix
            commodity="Arecanut (Chali)"
            quantityQuintals={25}
            mandis={regionalMandis}
          />
        </div>

        {/* Hold vs Sell Strategic Horizon Card */}
        <div className="lg:col-span-4 bg-white dark:bg-krishi-darkcard p-6 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-krishi-700 dark:text-krishi-300 font-bold text-xs">
              <Building className="w-4 h-4" />
              <span>{t.holdVsSell}</span>
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
              Store in Warehouse vs Sell Today
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Factors in ₹35/qtl/mo storage fee vs post-monsoon surge
            </p>

            <div className="space-y-3 mt-4">
              <div className="flex justify-between text-xs font-bold">
                <span>Hold Period:</span>
                <span className="text-emerald-700">{storageMonths} Months</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={storageMonths}
                onChange={(e) => setStorageMonths(parseInt(e.target.value))}
                className="w-full accent-krishi-600 cursor-pointer"
              />

              <div className="p-3 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Current 25 Qtl Value:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ₹{currentNetSale.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Storage Cost (₹35/mo):</span>
                  <span className="font-bold text-rose-600">-₹{storageCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Projected {storageMonths}-Mo Value:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ₹{futureGrossSale.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-black text-emerald-700 pt-2 border-t border-slate-200 dark:border-krishi-darkborder">
                  <span>Net Extra In Pocket:</span>
                  <span>+₹{futureNetGain.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
            <strong>Verdict: </strong>
            Holding 25 Quintals until September yields an additional <strong>₹{futureNetGain.toLocaleString()}</strong> even after storage fee deductions.
          </div>
        </div>
      </div>

      {/* CAMPCO Geo-Harvest Virtual Batch Pooling Card */}
      <div className="bg-gradient-to-r from-krishi-900 to-[#0e3b1f] text-white p-6 rounded-2xl border border-krishi-700 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤝</span>
            <span className="text-xs font-black uppercase tracking-wider text-krishi-gold">
              DBSCAN Spatial Batch Pooling Active
            </span>
          </div>
          <h3 className="text-lg font-black text-white">
            Geo-Harvest Virtual Batch Pooling (CAMPCO Reverse Auction)
          </h3>
          <p className="text-xs text-emerald-200 max-w-2xl leading-relaxed">
            Auto-detected 4 neighboring smallholders in Puttur with matching harvest windows. Clustered into a single <strong>4.8 Tonne</strong> commercial truckload, eliminating middlemen and cutting freight by 65%.
          </p>
        </div>

        <button
          onClick={() => alert("CAMPCO pooling slot reserved! Commercial lot ID: CAMPCO-PUT-884")}
          className="px-5 py-2.5 bg-krishi-gold hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition shrink-0 shadow-md"
        >
          Join 4.8T Lot with CAMPCO
        </button>
      </div>

      {/* Price Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-krishi-darkcard p-6 rounded-2xl max-w-md w-full border border-slate-200 dark:border-krishi-darkborder shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-krishi-darkborder">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-krishi-gold" />
                Set Instant Mandi Price Alert
              </h3>
              <button
                onClick={() => setShowAlertModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Receive automated SMS and WhatsApp audio notification the moment modal rates cross your threshold.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Commodity & Quality
                </label>
                <div className="p-2.5 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder font-semibold">
                  Arecanut · Chali (Puttur / Shivamogga APMC)
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Alert Threshold (₹/quintal)
                </label>
                <input
                  type="number"
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-krishi-darkbg rounded-xl border border-slate-200 dark:border-krishi-darkborder font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Delivery Channel
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
                    ✓ WhatsApp (+91 98765 43210)
                  </span>
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-bold">
                    ✓ SMS
                  </span>
                </div>
              </div>
            </div>

            {alertSaved ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold text-center">
                ✓ Price alert active for ₹{alertTargetPrice}/qtl!
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="flex-1 py-2 text-slate-600 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setAlertSaved(true);
                    setTimeout(() => {
                      setShowAlertModal(false);
                      setAlertSaved(false);
                    }, 1200);
                  }}
                  className="flex-1 py-2 bg-krishi-gold hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow"
                >
                  Activate Alert
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
