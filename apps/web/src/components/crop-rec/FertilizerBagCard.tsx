import React from "react";
import { Package, ShieldAlert } from "lucide-react";

interface FertilizerBagCardProps {
  ureaBags: number;
  dapBags: number;
  mopBags: number;
  acreage: number;
}

export const FertilizerBagCard: React.FC<FertilizerBagCardProps> = ({
  ureaBags,
  dapBags,
  mopBags,
  acreage,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-4 h-4 text-krishi-600" />
          Commercial Fertilizer Dosage ({acreage} Acres)
        </h4>
        <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
          50 kg Bags
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* DAP */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
          <span className="text-xs font-bold text-amber-900 block">DAP (18:46:0)</span>
          <span className="text-2xl font-extrabold text-amber-800 mt-1 block">
            {dapBags}
          </span>
          <span className="text-[10px] text-amber-700 block mt-1">100% Basal</span>
        </div>

        {/* Urea */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <span className="text-xs font-bold text-blue-900 block">Urea (46% N)</span>
          <span className="text-2xl font-extrabold text-blue-800 mt-1 block">
            {ureaBags}
          </span>
          <span className="text-[10px] text-blue-700 block mt-1">Split (Basal + 30 DAS)</span>
        </div>

        {/* MOP */}
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center">
          <span className="text-xs font-bold text-rose-900 block">MOP (60% K)</span>
          <span className="text-2xl font-extrabold text-rose-800 mt-1 block">
            {mopBags}
          </span>
          <span className="text-[10px] text-rose-700 block mt-1">50% Basal + 25% Top</span>
        </div>
      </div>
    </div>
  );
};
