import React from "react";
import { cn } from "../utils/helpers";
import { CheckCircle2 } from "lucide-react";

export function Badge({ tone = "blue", children, T }) {
  const map = {
    blue: T.dark ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-50 text-blue-700 border-blue-200",
    emerald: T.dark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: T.dark ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-700 border-amber-200",
    rose: T.dark ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-rose-50 text-rose-700 border-rose-200",
    slate: T.dark ? "bg-slate-500/10 text-slate-300 border-slate-500/20" : "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium", map[tone])}>
      {children}
    </span>
  );
}

export function Toggle({ checked, onChange, T }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors duration-300 shrink-0",
        checked ? "bg-blue-600" : T.dark ? "bg-slate-700" : "bg-gray-300"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function SliderControl({ label, value, min, max, step = 1, suffix = "", onChange, T, icon: Icon }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className={T.accentBlue} />}
          <span className={cn("text-sm font-medium", T.text)}>{label}</span>
        </div>
        <span className={cn("text-sm font-mono font-semibold tabular-nums px-2 py-0.5 rounded-md", T.accentBlueBg, T.accentBlue)}>
          {value}{suffix}
        </span>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: T.dark ? "#1e293b" : "#e5e7eb" }}>
        <div
          className="absolute h-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-150"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white border-2 border-blue-600 shadow-md transition-all duration-150 pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  );
}

export function Skeleton({ className, T }) {
  return <div className={cn("rounded-xl animate-pulse", T.dark ? "bg-slate-800" : "bg-gray-200", className)} />;
}

export function ChartShell({ title, sub, T, children }) {
  return (
    <div className={cn("rounded-2xl p-5", T.card)}>
      <div className="mb-4">
        <h3 className={cn("text-sm font-semibold", T.text)}>{title}</h3>
        {sub && <p className={cn("text-xs mt-0.5", T.textMuted)}>{sub}</p>}
      </div>
      <div style={{ width: "100%", height: 220 }}>{children}</div>
    </div>
  );
}

export function InsightCard({ item, T }) {
  const toneMap = {
    emerald: { bg: T.accentEmeraldBg, text: T.accentEmerald },
    amber: { bg: T.dark ? "bg-amber-500/10" : "bg-amber-50", text: T.dark ? "text-amber-400" : "text-amber-600" },
    rose: { bg: T.dark ? "bg-rose-500/10" : "bg-rose-50", text: T.dark ? "text-rose-400" : "text-rose-600" },
  };
  const c = toneMap[item.tone];
  const Icon = item.icon;
  return (
    <div className={cn("flex items-start gap-3 rounded-xl p-4 transition-colors", T.card, T.cardHover)}>
      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", c.bg)}>
        <Icon size={16} className={c.text} />
      </div>
      <p className={cn("text-sm leading-relaxed", T.text)}>{item.text}</p>
    </div>
  );
}

export function Toasts({ toasts, T }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-lg animate-[fadeIn_0.2s_ease-out]",
            T.dark ? "bg-slate-800 text-slate-100 border border-slate-700" : "bg-white text-slate-800 border border-gray-200"
          )}
        >
          <CheckCircle2 size={15} className={T.accentEmerald} />
          {t.text}
        </div>
      ))}
    </div>
  );
}
