import React, { useState, useEffect } from "react";
import { Sun, Moon, Upload, Menu, X, Gauge } from "lucide-react";
import { cn } from "../utils/helpers";

export default function Navbar({ page, setPage, T, dark, setDark, addToast }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const items = [
    ["dashboard", "Dashboard"],
    ["simulator", "Simulators"],
    ["advisor", "AI Advisor"],
    ["compare", "Compare"],
    ["reports", "Reports"],
    ["about", "About"],
  ];

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-300",
        scrolled
          ? dark
            ? "bg-slate-950/90 backdrop-blur-2xl border-slate-800 shadow-[0_1px_0_0_rgba(255,255,255,0.04)]"
            : "bg-white/90 backdrop-blur-2xl border-gray-200 shadow-sm"
          : dark
          ? "bg-slate-950/70 backdrop-blur-xl border-slate-800/60"
          : "bg-white/70 backdrop-blur-xl border-gray-200/60"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setPage("landing")}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-sm group-hover:shadow-blue-500/25 transition-shadow">
            <Gauge size={14} className="text-white" />
          </div>
          <span className={cn("font-semibold tracking-tight text-[14px]", T.text)}>
            SME<span className={dark ? "text-slate-500" : "text-slate-400"}>/</span>DS
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {items.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={cn(
                "relative px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
                page === key
                  ? dark
                    ? "text-white bg-white/8"
                    : "text-slate-900 bg-slate-100"
                  : dark
                  ? "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/70"
              )}
            >
              {label}
              {page === key && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" />
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setPage("upload")}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[13px] font-medium px-3 py-1.5 hover:opacity-90 transition-opacity shadow-sm shadow-blue-500/20"
          >
            <Upload size={13} /> Upload
          </button>
          <button
            onClick={() => setDark(!dark)}
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center border transition-colors",
              dark ? "border-slate-700 hover:bg-slate-800 text-slate-400" : "border-gray-200 hover:bg-gray-100 text-slate-500"
            )}
          >
            {dark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className={cn("lg:hidden h-8 w-8 flex items-center justify-center rounded-lg", T.textMuted)}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={cn("lg:hidden border-t px-5 py-3 flex flex-col gap-0.5", dark ? "border-slate-800 bg-slate-950" : "border-gray-200 bg-white")}>
          {items.map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setPage(key); setOpen(false); }}
              className={cn(
                "text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                page === key
                  ? dark ? "bg-white/8 text-white" : "bg-slate-100 text-slate-900"
                  : dark ? "text-slate-400" : "text-slate-500"
              )}
            >
              {label}
            </button>
          ))}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t" style={{ borderColor: dark ? "#1e293b" : "#f1f5f9" }}>
            <button
              onClick={() => { setPage("upload"); setOpen(false); }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium px-3 py-2"
            >
              <Upload size={13} /> Upload Data
            </button>
            <button
              onClick={() => setDark(!dark)}
              className={cn("h-9 w-9 rounded-lg flex items-center justify-center border", dark ? "border-slate-700" : "border-gray-200")}
            >
              {dark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
