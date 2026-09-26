"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  ShieldCheck,
  MapPin,
  QrCode,
  Tag,
  CheckCircle,
  Truck,
  Filter,
  DollarSign,
  ArrowRight,
  Download,
  Loader2,
} from "lucide-react";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";
import { reserveSeedStock } from "@/lib/db-client";

interface SeedHub {
  id: string;
  name: string;
  type: "RSK" | "KVK" | "NSC" | "Heritage";
  distanceKm: number;
  location: string;
  crop: string;
  variety: string;
  tagColor: "Blue" | "White" | "Green";
  germinationRate: number;
  purity: number;
  lotNumber: string;
  marketPrice: number;
  subsidizedPrice: number;
  stockBags: number;
}

export const SeedBazaarView: React.FC = () => {
  const { language, fruitsId, currentUser } = useFarmStore();
  const t = useTranslation(language);

  const [radiusKm, setRadiusKm] = useState(25);
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [selectedHub, setSelectedHub] = useState<SeedHub | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [reservationResult, setReservationResult] = useState<any>(null);

  const handleReserve = async (item: SeedHub) => {
    setSelectedHub(item);
    setShowQrModal(true);
    setIsReserving(true);
    setBookingConfirmed(false);

    try {
      const res = await reserveSeedStock({
        hub_id: item.id.replace(/\D/g, "") || "1",
        crop: item.crop,
        variety: item.variety,
        quantity_kg: 5,
        farmer_phone: currentUser?.phone || "9876543210",
        fruits_id: fruitsId || "KA-FRUITS-2026-9981",
        farmer_id: currentUser?.userId ? String(currentUser.userId) : "1",
      });
      if (res) {
        setReservationResult(res);
        setBookingConfirmed(true);
      }
    } catch (err) {
      console.error("Seed reservation failed", err);
    } finally {
      setIsReserving(false);
    }
  };

  const seedInventory: SeedHub[] = [
    {
      id: "hub-1",
      name: "Raitha Samparka Kendra (RSK) Belthangady",
      type: "RSK",
      distanceKm: 8.5,
      location: "Belthangady Main Road, DK",
      crop: "Arecanut",
      variety: "Mangala Certified Seedlings",
      tagColor: "Blue",
      germinationRate: 94,
      purity: 99.4,
      lotNumber: "SATHI-KA-2026-8819",
      marketPrice: 180,
      subsidizedPrice: 90,
      stockBags: 450,
    },
    {
      id: "hub-2",
      name: "Krishi Vigyan Kendra (KVK) Mangaluru",
      type: "KVK",
      distanceKm: 22.0,
      location: "Kankanady, Mangaluru",
      crop: "Paddy",
      variety: "MO-4 (Bhadra) Foundation Seed",
      tagColor: "White",
      germinationRate: 96,
      purity: 99.8,
      lotNumber: "SATHI-KA-2026-4412",
      marketPrice: 950,
      subsidizedPrice: 475,
      stockBags: 120,
    },
    {
      id: "hub-3",
      name: "National Seeds Corporation (NSC) Depot",
      type: "NSC",
      distanceKm: 34.0,
      location: "Baikampady Industrial Area",
      crop: "Cowpea",
      variety: "C-152 Nitrogen Fixing Companion",
      tagColor: "Green",
      germinationRate: 92,
      purity: 98.6,
      lotNumber: "SATHI-NSC-2026-1109",
      marketPrice: 420,
      subsidizedPrice: 210,
      stockBags: 300,
    },
    {
      id: "hub-4",
      name: "South Kanara Heritage Seed Bank",
      type: "Heritage",
      distanceKm: 14.2,
      location: "Uppinangady",
      crop: "Black Pepper",
      variety: "Panniyur-1 Disease Resistant Rootstock",
      tagColor: "Blue",
      germinationRate: 91,
      purity: 99.0,
      lotNumber: "SATHI-KA-2026-7734",
      marketPrice: 85,
      subsidizedPrice: 42.5,
      stockBags: 600,
    },
  ];

  const filteredInventory = seedInventory.filter(
    (item) =>
      item.distanceKm <= radiusKm &&
      (selectedCrop === "All" || item.crop === selectedCrop)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-krishi-darkborder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              MODULE 2: CERTIFIED SEED BANK & E-BAZAAR
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              SATHI Verified
            </span>
          </div>
          <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full inline-block mt-1">
            Zero Counterfeit Guarantee
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Where to Get Quality Seeds
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Direct connection to Raitha Samparka Kendras, KVKs, and verified community seed banks with automated 50% DBT subsidy via FRUITS ID.
          </p>
        </div>

        {/* FRUITS ID Badge */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs self-start sm:self-auto">
          <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
            Karnataka FRUITS ID
          </span>
          <span className="font-mono font-black text-emerald-900 dark:text-emerald-200">
            {fruitsId}
          </span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">
            ✓ 50% DBT Subsidy Auto-Applied
          </span>
        </div>
      </div>

      {/* Discovery Filters Bar */}
      <div className="bg-white dark:bg-krishi-darkcard p-4 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Radius Slider */}
        <div className="w-full md:w-80 space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-krishi-600" />
              Search Radius:
            </span>
            <span className="text-krishi-700 dark:text-krishi-400">{radiusKm} km</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={radiusKm}
            onChange={(e) => setRadiusKm(parseInt(e.target.value))}
            className="w-full accent-krishi-600 cursor-pointer"
          />
        </div>

        {/* Crop Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {["All", "Arecanut", "Paddy", "Cowpea", "Black Pepper"].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCrop === c
                  ? "bg-krishi-700 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-krishi-darkbg text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInventory.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-krishi-darkcard p-5 rounded-2xl border border-slate-200 dark:border-krishi-darkborder shadow-sm hover:border-krishi-400 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      item.tagColor === "Blue"
                        ? "bg-blue-100 text-blue-800"
                        : item.tagColor === "White"
                        ? "bg-slate-100 text-slate-800 border border-slate-300"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    SATHI {item.tagColor} Tag Certified
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1.5">
                    {item.variety}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.name} ({item.distanceKm} km)</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 line-through block">
                    ₹{item.marketPrice}
                  </span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 block">
                    ₹{item.subsidizedPrice}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                    50% DBT OFF
                  </span>
                </div>
              </div>

              {/* Seed Passport Specs */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-krishi-darkborder text-center">
                <div className="p-2 bg-slate-50 dark:bg-krishi-darkbg rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Germination</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                    {item.germinationRate}%
                  </span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-krishi-darkbg rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Genetic Purity</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                    {item.purity}%
                  </span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-krishi-darkbg rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Live Depot Stock</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                    {item.stockBags} Units
                  </span>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-slate-400 font-mono">
                Lot No: {item.lotNumber}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleReserve(item)}
                className="flex-1 py-2.5 bg-krishi-700 hover:bg-krishi-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Reserve for Pickup (QR Token)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Pickup Modal */}
      {showQrModal && selectedHub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-krishi-darkcard p-6 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-krishi-darkborder shadow-2xl space-y-4 animate-fadeIn text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
                SATHI 48-HR OFFLINE PICKUP PASS
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                {selectedHub.variety}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedHub.name}
              </p>
            </div>

            {/* Simulated QR Code Canvas */}
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 dark:border-slate-100 shadow-inner flex flex-col items-center justify-center">
              <div className="w-44 h-44 bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center p-2 relative">
                {/* SVG QR Pattern */}
                <div className="grid grid-cols-6 gap-1 w-36 h-36 p-1 bg-white rounded-lg">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        (i * 7 + 3) % 2 === 0 ? "bg-black" : "bg-white"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-700 font-bold mt-2 truncate max-w-[240px]">
                {reservationResult?.qr_token
                  ? reservationResult.qr_token.slice(0, 32) + "..."
                  : `TOKEN: QR-${selectedHub.lotNumber.slice(-8)}`}
              </span>
            </div>

            {isReserving ? (
              <div className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-emerald-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Recording reservation in database...</span>
              </div>
            ) : bookingConfirmed ? (
              <div className="flex items-center justify-center gap-1.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>DBT Subsidy auto-credited & locked in DB!</span>
              </div>
            ) : null}

            <div className="p-2.5 bg-slate-50 dark:bg-krishi-darkbg rounded-xl text-xs text-slate-600 dark:text-slate-300 text-left space-y-1">
              <div className="flex justify-between">
                <span>Subsidized Rate:</span>
                <strong className="text-emerald-700">₹{selectedHub.subsidizedPrice} / unit</strong>
              </div>
              <div className="flex justify-between">
                <span>DBT Subsidy Saved:</span>
                <strong className="text-emerald-700">
                  ₹{reservationResult?.dbt_savings_inr || (selectedHub.marketPrice - selectedHub.subsidizedPrice) * 5}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Valid Until:</span>
                <strong>48 Hours (Offline Guaranteed)</strong>
              </div>
              <div className="flex justify-between">
                <span>Farmer FRUITS ID:</span>
                <strong className="font-mono">{fruitsId}</strong>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert("Offline QR Token downloaded to phone pass gallery.");
                  setShowQrModal(false);
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
