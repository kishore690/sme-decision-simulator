import React, { useState } from "react";
import {
  Users, Percent, Megaphone, CreditCard, Package,
  Building2, X, Zap, TrendingUp, DollarSign,
  Wallet, Gauge, Sparkles, ChevronRight,
} from "lucide-react";
import { cn, formatLakh } from "../utils/helpers";
import { BASE } from "../utils/constants";
import KPICard from "./KPICard";
import {
  simulateHiring, simulatePrice, simulateMarketing,
  simulateLoan, simulateInventory, simulateExpansion,
} from "../services/api";

const SIMULATORS = [
  {
    key: "hiring",
    icon: Users,
    title: "Hiring Simulator",
    desc: "Model the cost of bringing new employees on board.",
    color: "blue",
    fields: [
      { key: "employees", label: "Number of Employees to Hire", type: "number", min: 1, max: 50, placeholder: "e.g. 5" },
    ],
  },
  {
    key: "price",
    icon: Percent,
    title: "Price Simulator",
    desc: "See what a price increase does to revenue and demand.",
    color: "emerald",
    fields: [
      { key: "percentage", label: "Price Change (%)", type: "number", min: -50, max: 100, placeholder: "e.g. 10" },
    ],
  },
  {
    key: "marketing",
    icon: Megaphone,
    title: "Marketing Simulator",
    desc: "Estimate returns from a marketing budget increase.",
    color: "amber",
    fields: [
      { key: "budget", label: "Marketing Budget (₹)", type: "number", min: 0, placeholder: "e.g. 100000" },
    ],
  },
  {
    key: "loan",
    icon: CreditCard,
    title: "Loan Simulator",
    desc: "Understand the real cost of taking on new debt.",
    color: "rose",
    fields: [
      { key: "amount", label: "Loan Amount (₹)", type: "number", min: 0, placeholder: "e.g. 500000" },
      { key: "interestRate", label: "Annual Interest Rate (%)", type: "number", min: 0, max: 50, placeholder: "e.g. 12" },
      { key: "years", label: "Repayment Period (Years)", type: "number", min: 1, max: 30, placeholder: "e.g. 3" },
    ],
  },
  {
    key: "inventory",
    icon: Package,
    title: "Inventory Simulator",
    desc: "Optimize stock levels to reduce waste and stockouts.",
    color: "purple",
    fields: [
      { key: "units", label: "Units to Stock", type: "number", min: 0, placeholder: "e.g. 1000" },
      { key: "unitCost", label: "Cost per Unit (₹)", type: "number", min: 0, placeholder: "e.g. 250" },
    ],
  },
  {
    key: "expansion",
    icon: Building2,
    title: "Expansion Simulator",
    desc: "Project costs and returns from opening a new location.",
    color: "indigo",
    fields: [
      { key: "setupCost", label: "Setup Cost (₹)", type: "number", min: 0, placeholder: "e.g. 2000000" },
      { key: "monthlyRevenue", label: "Expected Monthly Revenue (₹)", type: "number", min: 0, placeholder: "e.g. 300000" },
    ],
  },
];

const COLOR_MAP = {
  blue:   { bg: "bg-blue-500/10",   text: "text-blue-500",   border: "border-blue-500/20",   dot: "bg-blue-500"   },
  emerald:{ bg: "bg-emerald-500/10",text: "text-emerald-500",border: "border-emerald-500/20",dot: "bg-emerald-500" },
  amber:  { bg: "bg-amber-500/10",  text: "text-amber-500",  border: "border-amber-500/20",  dot: "bg-amber-500"  },
  rose:   { bg: "bg-rose-500/10",   text: "text-rose-500",   border: "border-rose-500/20",   dot: "bg-rose-500"   },
  purple: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20", dot: "bg-purple-500" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-500", border: "border-indigo-500/20", dot: "bg-indigo-500" },
};

function SimulatorCard({ sim, T, onOpen }) {
  const c = COLOR_MAP[sim.color];
  const Icon = sim.icon;
  return (
    <button
      onClick={() => onOpen(sim)}
      className={cn(
        "group relative w-full text-left rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        T.card, T.cardHover
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", c.bg)}>
          <Icon size={20} className={c.text} />
        </div>
        <ChevronRight size={16} className={cn("transition-transform group-hover:translate-x-0.5 mt-1", T.textFaint)} />
      </div>
      <h3 className={cn("text-sm font-semibold mb-1.5", T.text)}>{sim.title}</h3>
      <p className={cn("text-xs leading-relaxed", T.textMuted)}>{sim.desc}</p>
      <div className={cn("mt-4 pt-4 border-t flex items-center gap-2", T.dark ? "border-slate-800" : "border-gray-100")}>
        <div className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
        <span className={cn("text-xs font-medium", c.text)}>Open Simulator</span>
      </div>
    </button>
  );
}

function SimulatorForm({ sim, T, onClose, results, simulating, onSimulate, error, currentProfit }) {
  const [values, setValues] = useState(() => Object.fromEntries(sim.fields.map(f => [f.key, ""])));
  const c = COLOR_MAP[sim.color];
  const Icon = sim.icon;

  const handleRun = () => {
    onSimulate(sim.key, values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className={cn("w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl", T.dark ? "bg-slate-900 border border-slate-800" : "bg-white border border-gray-200")}>
        {/* Header */}
        <div className={cn("flex items-center justify-between px-6 py-5 border-b", T.dark ? "border-slate-800" : "border-gray-100")}>
          <div className="flex items-center gap-3">
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", c.bg)}>
              <Icon size={18} className={c.text} />
            </div>
            <div>
              <h2 className={cn("text-sm font-semibold", T.text)}>{sim.title}</h2>
              <p className={cn("text-xs", T.textMuted)}>{sim.desc}</p>
            </div>
          </div>
          <button onClick={onClose} className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-colors", T.cardHover, T.textMuted)}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {sim.fields.map(f => (
            <div key={f.key}>
              <label className={cn("block text-xs font-medium mb-1.5", T.textMuted)}>{f.label}</label>
              <input
                type={f.type}
                min={f.min}
                max={f.max}
                placeholder={f.placeholder}
                value={values[f.key]}
                onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                className={cn(
                  "w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors border",
                  T.dark
                    ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500"
                    : "bg-gray-50 border-gray-200 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white"
                )}
              />
            </div>
          ))}

          <button
            onClick={handleRun}
            disabled={simulating}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-medium text-white transition-opacity flex items-center justify-center gap-2",
              simulating ? "opacity-60 cursor-not-allowed" : "hover:opacity-90",
              "bg-gradient-to-r from-blue-600 to-emerald-500"
            )}
          >
            {simulating ? (
              <><span className="animate-spin">⟳</span> Running simulation...</>
            ) : (
              <><Zap size={14} /> Run Simulation</>
            )}
          </button>
        </div>

        {/* Error */}
        {error && !simulating && (
          <div className={cn("mx-6 mb-5 rounded-xl px-4 py-3 text-sm border", T.dark ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-600")}>
            {error}
          </div>
        )}

        {/* Results */}
        {results && !simulating && (
          <div className={cn("px-6 pb-6 space-y-3 border-t pt-5", T.dark ? "border-slate-800" : "border-gray-100")}>
            <p className={cn("text-xs font-semibold uppercase tracking-wide", T.textMuted)}>Projected Results</p>
            <div className="grid grid-cols-2 gap-3">
              <KPICard T={T} label="Revenue" value={results.revenue ?? results.newRevenue} icon={TrendingUp} tone="blue" format={formatLakh} delay={0} />
              <KPICard T={T} label="Profit" value={results.profit ?? results.projectedProfit ?? results.newProfit} icon={DollarSign} tone={((results.profit ?? results.projectedProfit ?? results.newProfit) >= currentProfit) ? "emerald" : "rose"} format={formatLakh} delay={50} />
              <KPICard T={T} label="Cash" value={results.cash ?? results.projectedCash ?? results.newCash} icon={Wallet} tone="blue" format={formatLakh} delay={100} />
              <KPICard T={T} label="Health" value={results.score ?? results.businessHealth} icon={Gauge} tone={(results.score ?? results.businessHealth ?? 50) >= 60 ? "emerald" : "amber"} delay={150} />
            </div>
            {results.aiRecommendation && (
              <div className={cn("rounded-xl p-4 border-l-4 mt-2", T.dark ? "bg-slate-800" : "bg-gray-50")} style={{ borderLeftColor: "#10b981" }}>
                <div className="flex items-start gap-2">
                  <Sparkles size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                  <p className={cn("text-xs leading-relaxed whitespace-pre-wrap break-words",T.text)}>{results.aiRecommendation}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Simulator({ T, sim, setSim, onSimulate, results, simulating, dashboardData }) {
  const [active, setActive] = useState(null);
  const [formResults, setFormResults] = useState(null);
  const [formSimulating, setFormSimulating] = useState(false);
  const [formError, setFormError] = useState(null);

  // Backend requires a couple of inputs the current UI doesn't collect
  // (inventory's expected profit per unit, expansion's expected expenses).
  // Derive reasonable defaults from the business's own current ratios.
  const d = dashboardData || BASE;
  const expenseRatio = d.revenue ? d.expenses / d.revenue : 0.6;

  const handleSimulate = async (key, values) => {
    setFormSimulating(true);
    setFormResults(null);
    setFormError(null);

    let response;
    switch (key) {
      case "hiring":
        response = await simulateHiring(parseInt(values.employees, 10) || 0);
        break;
      case "price":
        response = await simulatePrice(parseFloat(values.percentage) || 0);
        break;
      case "marketing":
        response = await simulateMarketing(parseFloat(values.budget) || 0);
        break;
      case "loan":
        response = await simulateLoan(
          parseFloat(values.amount) || 0,
          parseFloat(values.interestRate) || 0,
          parseInt(values.years, 10) || 1
        );
        break;
      case "inventory": {
        const costPerUnit = parseFloat(values.unitCost) || 0;
        response = await simulateInventory(
          parseInt(values.units, 10) || 0,
          costPerUnit,
          Math.round(costPerUnit * 0.3) // assumed 30% profit margin per unit
        );
        break;
      }
      case "expansion": {
        const expectedRevenue = (parseFloat(values.monthlyRevenue) || 0) * 12;
        response = await simulateExpansion(
          parseFloat(values.setupCost) || 0,
          expectedRevenue,
          Math.round(expectedRevenue * expenseRatio)
        );
        break;
      }
      default:
        response = { error: "Unknown simulator." };
    }

    if (!response || response.error) {
      setFormError(response?.error || "Unable to run simulation.");
      setFormSimulating(false);
      return;
    }

    setFormResults({
      ...response.simulation,
      aiRecommendation: response.aiRecommendation,
    });
    setFormSimulating(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <div className="mb-8">
        <h1 className={cn("text-2xl font-semibold tracking-tight", T.text)}>Business Simulators</h1>
        <p className={cn("text-sm mt-1", T.textMuted)}>Choose a simulator to model a decision before committing real resources.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SIMULATORS.map(s => (
          <SimulatorCard key={s.key} sim={s} T={T} onOpen={setActive} />
        ))}
      </div>

      {active && (
        <SimulatorForm
          sim={active}
          T={T}
          onClose={() => { setActive(null); setFormResults(null); setFormError(null); }}
          results={formResults}
          simulating={formSimulating}
          error={formError}
          onSimulate={handleSimulate}
          currentProfit={d.profit}
        />
      )}
    </div>
  );
}
