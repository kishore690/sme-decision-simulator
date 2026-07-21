import React, { useState, useEffect } from "react";
import { cn } from "../utils/helpers";
import { useCountUp } from "../hooks/useCountUp";

export default function KPICard({ label, value, format, icon: Icon, tone, sub, T, delay = 0 }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const num = useCountUp(typeof value === "number" ? value : 0);

  const toneMap = {
    blue:   { text: T.accentBlue,                                       bg: T.accentBlueBg },
    emerald:{ text: T.accentEmerald,                                    bg: T.accentEmeraldBg },
    amber:  { text: T.dark ? "text-amber-400" : "text-amber-600",       bg: T.dark ? "bg-amber-500/10" : "bg-amber-50" },
    rose:   { text: T.dark ? "text-rose-400" : "text-rose-600",         bg: T.dark ? "bg-rose-500/10" : "bg-rose-50" },
  };

  const { text: iconText, bg: iconBg } = toneMap[tone] || toneMap.blue;

  return (
    <div
      className={cn(
        "rounded-2xl p-5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-md",
        T.card, T.cardHover,
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={cn("text-[11px] font-medium uppercase tracking-widest leading-tight", T.textFaint)}>{label}</span>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", iconBg)}>
          <Icon size={15} className={iconText} />
        </div>
      </div>
      <div className={cn("text-[22px] font-semibold font-mono tabular-nums leading-none", T.text)}>
        {typeof value === "number"
          ? (format ? format(num) : Math.round(num))
          : value}
      </div>
      {sub && <div className={cn("text-[11px] mt-1.5", T.textMuted)}>{sub}</div>}
    </div>
  );
}
