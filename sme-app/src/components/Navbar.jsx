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
            ? "bg-slate-950/85 backdrop-blur-xl border-slate-800/80 shadow-sm"
            : "bg-white/85 backdrop-blur-xl border-white/80 shadow-sm"
          : dark
          ? "bg-slate-950/70 backdrop-blur-xl border-slate-800/70"
          : "bg-white/70 backdrop-blur-xl border-white/80"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setPage("landing")}
          className="flex items-center gap-3 shrink-0 group"
        >
          <div className="h-9 w-9 rounded-lg bg-teal-800 flex items-center justify-center transition-colors group-hover:bg-teal-900">
            <Gauge size={17} className="text-white" />
          </div>
          <span className={cn("text-sm font-semibold tracking-tight", T.text)}>
            SME Decision Simulator
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {items.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={cn(
                "relative px-3 py-2 rounded-md text-[13px] font-medium transition-colors duration-150",
                page === key
                  ? dark
                    ? "text-teal-200 bg-teal-400/10"
                    : "text-teal-900 bg-teal-50"
                  : dark
                  ? "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/70"
              )}
            >
              {label}
              {page === key && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-teal-700" />
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setPage("upload")}
            className="flex items-center gap-1.5 rounded-md bg-teal-800 text-white text-[13px] font-medium px-3.5 py-2 hover:bg-teal-900 transition-colors"
          >
            <Upload size={13} /> Upload
          </button>
          <button
            onClick={() => setDark(!dark)}
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center border transition-colors",
              dark ? "border-slate-700 hover:bg-slate-800 text-slate-400" : "border-slate-300 hover:bg-slate-100 text-slate-600"
            )}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {dark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className={cn("lg:hidden h-8 w-8 flex items-center justify-center rounded-lg", T.textMuted)}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
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
