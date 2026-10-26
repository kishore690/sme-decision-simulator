import React from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ClipboardList,
  FileSpreadsheet,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { cn } from "../../utils/helpers";

const CAPABILITIES = [
  {
    icon: FileSpreadsheet,
    title: "Start with your numbers",
    text: "Upload sales data from CSV, Excel, Word, JSON, or PDF, or explore the workspace with sample data.",
  },
  {
    icon: SlidersHorizontal,
    title: "Compare the options",
    text: "Model changes to hiring, pricing, marketing, loans, and inventory.",
  },
  {
    icon: ClipboardList,
    title: "Make a clearer plan",
    text: "Review the projected impact and export a report to share.",
  },
];

export default function LandingPage({ setPage, T }) {
  return (
    <main>
      <section className="border-b border-slate-200/80">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1.5 text-xs font-medium text-teal-800 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
              Business planning, made practical
            </div>

            <h1 className={cn("max-w-2xl text-4xl font-semibold leading-[1.12] tracking-[-0.035em] sm:text-5xl lg:text-[58px]", T.text)}>
              Make your next business decision with <span className="text-teal-700">more clarity.</span>
            </h1>
            <p className={cn("mt-6 max-w-xl text-base leading-7 sm:text-lg", T.textMuted)}>
              Understand your numbers, explore possible outcomes, and plan your next move before committing resources.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setPage("upload")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-800 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-900 focus-visible:outline-teal-700"
              >
                Open your workspace <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setPage("about")}
                className={cn("inline-flex min-h-11 items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors", T.dark ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}
              >
                How it works
              </button>
            </div>

            <div className={cn("mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t pt-5 text-xs", T.border, T.textMuted)}>
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-teal-700" /> Business file upload</span>
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-teal-700" /> Decision simulations</span>
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-teal-700" /> Downloadable reports</span>
            </div>
          </div>

          <div className={cn("relative overflow-hidden rounded-2xl border p-5 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.35)] backdrop-blur-2xl sm:p-7", T.dark ? "border-slate-700/80 bg-slate-900/70" : "border-white/90 bg-white/70")}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={cn("text-xs font-medium uppercase tracking-[0.12em]", T.textFaint)}>Example workspace</p>
                <h2 className={cn("mt-1.5 text-lg font-semibold tracking-tight", T.text)}>Business overview</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2.5 py-1.5 text-xs font-medium text-teal-800">
                <ShieldCheck size={14} /> Sample view
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              <div className={cn("rounded-xl border p-4 backdrop-blur-md", T.border, T.dark ? "bg-slate-950/45" : "bg-white/45")}>
                <p className={cn("text-xs", T.textMuted)}>Revenue</p>
                <p className={cn("mt-2 text-xl font-semibold tracking-tight tabular-nums", T.text)}>₹12.8L</p>
                <p className="mt-1 text-xs text-teal-700">Performance at a glance</p>
              </div>
              <div className={cn("rounded-xl border p-4 backdrop-blur-md", T.border, T.dark ? "bg-slate-950/45" : "bg-white/45")}>
                <p className={cn("text-xs", T.textMuted)}>Projected profit</p>
                <p className={cn("mt-2 text-xl font-semibold tracking-tight tabular-nums", T.text)}>₹3.4L</p>
                <p className="mt-1 text-xs text-slate-500">Based on sample data</p>
              </div>
            </div>

            <div className={cn("mt-4 rounded-xl border p-4 sm:p-5", T.border)}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className={cn("text-sm font-medium", T.text)}>Monthly revenue</p>
                  <p className={cn("mt-0.5 text-xs", T.textMuted)}>A simple view of your sales trend</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
                  <BarChart3 size={17} />
                </div>
              </div>
              <div className="mt-5 flex h-28 items-end gap-2 border-b border-slate-200 px-1" aria-label="Illustrative monthly revenue bars">
                {[38, 54, 47, 68, 59, 82, 73, 94, 76, 100, 86, 92].map((height, index) => (
                  <div key={index} className="flex h-full flex-1 items-end">
                    <div className={cn("w-full rounded-t-sm", index === 9 ? "bg-teal-700" : "bg-teal-700/20")} style={{ height: `${height}%` }} />
                  </div>
                ))}
              </div>
              <div className={cn("mt-2 flex justify-between text-[10px]", T.textFaint)}><span>Jan</span><span>Apr</span><span>Aug</span><span>Dec</span></div>
            </div>

            <div className={cn("mt-4 flex items-center gap-3 rounded-xl border p-3.5 backdrop-blur-md", T.border, T.dark ? "bg-slate-950/45" : "bg-white/45")}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700"><Sparkles size={16} /></div>
              <div>
                <p className={cn("text-xs font-medium", T.text)}>Explore a decision before you commit</p>
                <p className={cn("mt-0.5 text-xs", T.textMuted)}>Test different scenarios side by side.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-8 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-800">A straightforward workflow</p>
          <h2 className={cn("mt-2 text-2xl font-semibold tracking-tight sm:text-3xl", T.text)}>From raw numbers to a considered next step.</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {CAPABILITIES.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className={cn("rounded-xl border p-5 sm:p-6", T.cardSolid)}>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-800"><Icon size={18} /></span>
                <span className={cn("font-mono text-xs", T.textFaint)}>0{index + 1}</span>
              </div>
              <h3 className={cn("mt-5 text-base font-semibold", T.text)}>{title}</h3>
              <p className={cn("mt-2 text-sm leading-6", T.textMuted)}>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
