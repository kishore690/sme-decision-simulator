import React from "react";
import { Upload, BarChart3, Zap, Sparkles, ArrowRight, TrendingUp, ShieldCheck, Clock } from "lucide-react";
import { cn } from "../../utils/helpers";

const STEPS = [
  { icon: Upload,    title: "Upload Business Data",    text: "Bring in sales, expenses, invoices and bank data — CSV or a demo dataset." },
  { icon: BarChart3, title: "Business Analysis",       text: "We map your revenue, costs and cash position into a clear health score." },
  { icon: Zap,       title: "Run Simulations",         text: "Test hiring, pricing, loans and expansion decisions before committing." },
  { icon: Sparkles,  title: "AI Recommendations",      text: "Get plain-language guidance on the safest path forward." },
];

const STATS = [
  { label: "Decisions simulated", value: "12,000+", icon: TrendingUp },
  { label: "Risk avoided",        value: "₹2.4Cr",  icon: ShieldCheck },
  { label: "Avg time saved",      value: "14 hrs",  icon: Clock },
];

export default function LandingPage({ setPage, T }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className={cn("absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-[100px] opacity-25", T.dark ? "bg-blue-700" : "bg-blue-200")} />
          <div className={cn("absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full blur-[100px] opacity-20", T.dark ? "bg-emerald-700" : "bg-emerald-200")} />
          <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-[120px] opacity-[0.07]", T.dark ? "bg-blue-500" : "bg-blue-400")} />
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-24 pb-20 text-center">
          <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium mb-7", T.dark ? "border-slate-700 bg-slate-900/80 text-slate-400" : "border-gray-200 bg-white/80 text-slate-500")}>
            <Sparkles size={11} className="text-blue-500" />
            Built for small &amp; medium businesses
          </div>

          <h1 className={cn("text-[44px] sm:text-[62px] font-semibold tracking-tight leading-[1.07] mb-6", T.text)}>
            Test decisions
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-emerald-500 bg-clip-text text-transparent">
              before spending money
            </span>
          </h1>

          <p className={cn("text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-9", T.textMuted)}>
            Upload your data, simulate future decisions, understand risk, and receive AI guidance — all before committing real resources.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setPage("upload")}
              className={cn(
                "w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-medium border transition-colors",
                T.dark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-gray-200 text-slate-600 hover:bg-gray-50"
              )}
            >
              Try with sample data
            </button>
            <button
              onClick={() => setPage("dashboard")}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25"
            >
              Get started
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-14 pt-8 border-t" style={{ borderColor: T.dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex items-center gap-2.5">
                  <Icon size={16} className={T.dark ? "text-slate-500" : "text-slate-400"} />
                  <span className={cn("text-lg font-semibold tabular-nums", T.text)}>{s.value}</span>
                  <span className={cn("text-sm", T.textMuted)}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
        <div className="text-center mb-10">
          <h2 className={cn("text-2xl sm:text-3xl font-semibold tracking-tight", T.text)}>How it works</h2>
          <p className={cn("mt-2 text-sm", T.textMuted)}>Four steps from raw numbers to a confident decision.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className={cn("relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1", T.card, T.cardHover)}
              >
                {/* Step connector line (desktop) */}
                {i < STEPS.length - 1 && (
                  <div className={cn("hidden lg:block absolute top-[30px] right-0 translate-x-1/2 h-px w-4 z-10", T.dark ? "bg-slate-700" : "bg-gray-200")} />
                )}
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-4", T.accentBlueBg)}>
                  <Icon size={17} className={T.accentBlue} />
                </div>
                <div className={cn("text-[10px] font-mono font-semibold mb-1.5 tracking-widest", T.textFaint)}>0{i + 1}</div>
                <h3 className={cn("text-sm font-semibold mb-1.5", T.text)}>{s.title}</h3>
                <p className={cn("text-xs leading-relaxed", T.textMuted)}>{s.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
