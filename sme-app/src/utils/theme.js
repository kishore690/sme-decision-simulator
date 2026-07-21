export function getTheme(dark) {
  return {
    dark,
    page: dark ? "bg-slate-950" : "bg-gray-50",
    text: dark ? "text-slate-100" : "text-slate-900",
    textMuted: dark ? "text-slate-400" : "text-slate-500",
    textFaint: dark ? "text-slate-500" : "text-slate-400",
    card: dark
      ? "bg-slate-900/60 border border-slate-800 backdrop-blur-xl"
      : "bg-white/80 border border-gray-200 backdrop-blur-xl",
    cardSolid: dark ? "bg-slate-900 border border-slate-800" : "bg-white border border-gray-200",
    cardHover: dark ? "hover:bg-slate-900/90 hover:border-slate-700" : "hover:bg-white hover:border-gray-300",
    nav: dark ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-gray-200",
    accentBlue: dark ? "text-blue-400" : "text-blue-600",
    accentBlueBg: dark ? "bg-blue-500/10" : "bg-blue-50",
    accentEmerald: dark ? "text-emerald-400" : "text-emerald-600",
    accentEmeraldBg: dark ? "bg-emerald-500/10" : "bg-emerald-50",
    border: dark ? "border-slate-800" : "border-gray-200",
    inputBg: dark ? "bg-slate-800/60 border-slate-700" : "bg-gray-50 border-gray-200",
    divide: dark ? "divide-slate-800" : "divide-gray-200",
  };
}
