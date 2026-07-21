import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn, formatLakh } from "../../utils/helpers";
import { BASE } from "../../utils/constants";
import { Badge, Skeleton } from "../ui";
import { simulateExpansion, simulatePrice } from "../../services/api";

const ROWS = [
  { key: "revenue", label: "Revenue", fmt: formatLakh, higherBetter: true },
  { key: "profit", label: "Profit", fmt: formatLakh, higherBetter: true },
  { key: "cash", label: "Cash", fmt: formatLakh, higherBetter: true },
  { key: "score", label: "Business Health", fmt: (v) => v, higherBetter: true },
  { key: "risk", label: "Risk", fmt: (v) => v, higherBetter: false, isRisk: true },
];
const riskScore = (r) => ({ Low: 3, Medium: 2, High: 1 }[r] ?? 0);

const winnerIdx = (row, cols) => {
  if (row.isRisk) {
    const scores = cols.map((c) => riskScore(c.risk));
    return scores.indexOf(Math.max(...scores));
  }
  const vals = cols.map((c) => c[row.key]);
  return row.higherBetter ? vals.indexOf(Math.max(...vals)) : vals.indexOf(Math.min(...vals));
};

export default function CompareScenarios({ T, dashboardData }) {
  const [scenarios, setScenarios] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScenarios() {
      if (!dashboardData) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      const current = {
        name: "Current Business",
        revenue: dashboardData.revenue,
        profit: dashboardData.profit,
        cash: dashboardData.cash,
        risk: dashboardData.risk,
        score: dashboardData.businessHealth,
      };

      // Scenario A: expand — open a new location.
      const expansionCost = Math.round(dashboardData.cash * 0.3);
      const expectedRevenue = Math.round(dashboardData.revenue * 1.2);
      const expectedExpenses = Math.round(expectedRevenue * (dashboardData.expenses / dashboardData.revenue));
      const expansionRes = await simulateExpansion(expansionCost, expectedRevenue, expectedExpenses);

      // Scenario B: optimize — a moderate price increase.
      const priceRes = await simulatePrice(5);

      if (expansionRes.error || priceRes.error) {
        setError(expansionRes.error || priceRes.error);
        setLoading(false);
        return;
      }

      setScenarios([
        current,
        {
          name: "Scenario A — Expand",
          revenue: expectedRevenue,
          profit: expansionRes.simulation.projectedProfit,
          cash: expansionRes.simulation.projectedCash,
          risk: expansionRes.simulation.risk,
          score: expansionRes.simulation.businessHealth,
        },
        {
          name: "Scenario B — Optimize",
          revenue: priceRes.simulation.newRevenue,
          profit: priceRes.simulation.newProfit,
          cash: priceRes.simulation.newCash,
          risk: priceRes.simulation.risk,
          score: priceRes.simulation.businessHealth,
        },
      ]);
      setLoading(false);
    }

    loadScenarios();
  }, [dashboardData]);

  const cols = scenarios || [
    { name: "Current Business", ...BASE },
    { name: "Scenario A — Expand", ...BASE },
    { name: "Scenario B — Optimize", ...BASE },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <div className="mb-8">
        <h1 className={cn("text-2xl font-semibold tracking-tight", T.text)}>Compare Scenarios</h1>
        <p className={cn("text-sm mt-1", T.textMuted)}>See how your current business stacks up against two alternative paths.</p>
      </div>

      {!dashboardData && !loading && (
        <div className={cn("flex items-center gap-2.5 rounded-xl px-4 py-3 mb-6 text-sm border", T.dark ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-700")}>
          <AlertCircle size={15} className="shrink-0" />
          Upload your business data first to compare scenarios against real numbers.
        </div>
      )}

      {error && (
        <div className={cn("flex items-center gap-2.5 rounded-xl px-4 py-3 mb-6 text-sm border", T.dark ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-600")}>
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} T={T} className="h-14" />)}
        </div>
      ) : (
        <>
          <div className={cn("rounded-2xl overflow-hidden", T.card)}>
            <div className="grid grid-cols-4">
              <div className={cn("p-4 text-xs font-medium uppercase tracking-wide", T.textMuted)}>Metric</div>
              {cols.map((c, i) => (
                <div key={i} className={cn("p-4 text-sm font-semibold text-center border-l", T.border, T.text)}>{c.name}</div>
              ))}
            </div>
            {ROWS.map((row) => {
              const win = winnerIdx(row, cols);
              return (
                <div key={row.key} className={cn("grid grid-cols-4 border-t", T.border)}>
                  <div className={cn("p-4 text-sm font-medium", T.textMuted)}>{row.label}</div>
                  {cols.map((c, i) => (
                    <div key={i} className={cn("p-4 text-center border-l text-sm font-mono tabular-nums flex items-center justify-center gap-1.5", T.border)}>
                      {row.isRisk ? (
                        <Badge T={T} tone={c.risk === "Low" ? "emerald" : c.risk === "High" ? "rose" : "amber"}>{c.risk}</Badge>
                      ) : (
                        <span className={T.text}>{row.fmt(c[row.key])}</span>
                      )}
                      {win === i && <CheckCircle2 size={13} className={T.accentEmerald} />}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            {cols.map((c, i) => (
              <div key={i} className={cn("rounded-2xl p-5", T.card)}>
                <div className={cn("text-sm font-semibold mb-2", T.text)}>{c.name}</div>
                <p className={cn("text-xs leading-relaxed", T.textMuted)}>
                  {i === 0 && "Your business as it stands today, based on uploaded data."}
                  {i === 1 && "Aggressive growth through a new branch — higher revenue, tighter cash."}
                  {i === 2 && "A moderate price increase — steadier, lower-risk growth."}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
