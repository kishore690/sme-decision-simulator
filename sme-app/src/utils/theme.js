export function getTheme(dark) {
  return {
    dark,
    page: dark ? "bg-slate-950/85" : "bg-slate-50/75",
    text: dark ? "text-slate-100" : "text-slate-900",
    textMuted: dark ? "text-slate-400" : "text-slate-500",
    textFaint: dark ? "text-slate-500" : "text-slate-400",
    card: dark
      ? "bg-slate-900/70 border border-slate-700/80 backdrop-blur-xl shadow-sm shadow-black/10"
      : "bg-white/70 border border-white/80 backdrop-blur-xl shadow-sm shadow-slate-900/5",
    cardSolid: dark ? "bg-slate-900/70 border border-slate-700/80 backdrop-blur-xl" : "bg-white/70 border border-white/80 backdrop-blur-xl shadow-sm shadow-slate-900/5",
    cardHover: dark ? "hover:bg-slate-800/80 hover:border-slate-600" : "hover:bg-white/90 hover:border-white",
    nav: dark ? "bg-slate-950/75 border-slate-800/80 backdrop-blur-xl" : "bg-white/75 border-white/80 backdrop-blur-xl",
    accentBlue: dark ? "text-teal-300" : "text-teal-700",
    accentBlueBg: dark ? "bg-teal-400/10" : "bg-teal-50",
    accentEmerald: dark ? "text-emerald-300" : "text-emerald-700",
    accentEmeraldBg: dark ? "bg-emerald-400/10" : "bg-emerald-50",
    border: dark ? "border-slate-800" : "border-slate-200",
    inputBg: dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300",
    divide: dark ? "divide-slate-800" : "divide-slate-200",
  };
}
