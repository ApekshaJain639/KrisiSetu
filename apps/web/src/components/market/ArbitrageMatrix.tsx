import React from "react";
import { TrendingUp, Truck, MapPin, IndianRupee } from "lucide-react";

interface MandiOption {
  mandi_name: string;
  district: string;
  modal_price_per_qtl: number;
  distance_km: number;
  freight_cost_inr: number;
  gross_revenue_inr: number;
  net_in_hand_inr: number;
  net_bonus_vs_local_inr: number;
}

interface ArbitrageMatrixProps {
  commodity: string;
  quantityQuintals: number;
  mandis: MandiOption[];
}

export const ArbitrageMatrix: React.FC<ArbitrageMatrixProps> = ({
  commodity,
  quantityQuintals,
  mandis,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-krishi-600" />
            Multi-Mandi Spatial Arbitrage Matrix
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Comparing net cash in hand for {quantityQuintals} Quintals of {commodity}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-semibold">
            <tr>
              <th className="px-4 py-3">Mandi / District</th>
              <th className="px-4 py-3">Modal Price</th>
              <th className="px-4 py-3">Road Distance</th>
              <th className="px-4 py-3">Est. Freight</th>
              <th className="px-4 py-3">Net In Hand</th>
              <th className="px-4 py-3 text-right">Net Bonus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mandis.map((m, idx) => (
              <tr
                key={idx}
                className={idx === 0 ? "bg-emerald-50/60 font-semibold" : "hover:bg-slate-50"}
              >
                <td className="px-4 py-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {m.mandi_name}
                  {idx === 0 && (
                    <span className="ml-1.5 text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                      TOP PROFIT
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">₹{m.modal_price_per_qtl.toLocaleString()}/qtl</td>
                <td className="px-4 py-3">{m.distance_km} km</td>
                <td className="px-4 py-3 text-slate-600">-₹{m.freight_cost_inr.toLocaleString()}</td>
                <td className="px-4 py-3 font-bold text-slate-900">
                  ₹{m.net_in_hand_inr.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {m.net_bonus_vs_local_inr >= 0 ? (
                    <span className="text-emerald-700 font-bold">
                      +₹{m.net_bonus_vs_local_inr.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-slate-400">Baseline</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
