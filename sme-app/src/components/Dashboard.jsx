import React from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Gauge, TrendingUp, DollarSign, Wallet, Clock, ShieldQuestion, Receipt, Package, Hash, Boxes, CalendarPlus, CalendarMinus, AlertCircle } from "lucide-react";
import { cn, formatLakh } from "../utils/helpers";
import { BASE, INSIGHTS, TIMELINE } from "../utils/constants";
import KPICard from "./KPICard";
import { Skeleton, ChartShell, InsightCard } from "./ui";

export default function Dashboard({ T, loading, data, chartData, error }) {
  const d = data || BASE;

  // Real backend data, sorted chronologically for trend/growth charts.
  const revenueByDate = [...(chartData?.revenueByDate || [])].sort((a, b) =>
    String(a.Date).localeCompare(String(b.Date))
  );
  const growthByDate = revenueByDate.map((row, i) => {
    const prevRevenue = i > 0 ? revenueByDate[i - 1].Revenue : row.Revenue;
    const growth = prevRevenue ? ((row.Revenue - prevRevenue) / prevRevenue) * 100 : 0;
    return { date: row.Date, growth: Math.round(growth * 10) / 10 };
  });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className={cn("rounded-2xl p-6 flex items-center gap-3 border", T.dark ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-600")}>
          <AlertCircle size={18} className="shrink-0" />
          <div>
            <p className="text-sm font-medium">Couldn't load dashboard data</p>
            <p className="text-xs mt-0.5 opacity-80">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      <div className="mb-8">
        <h1 className={cn("text-2xl font-semibold tracking-tight", T.text)}>Dashboard</h1>
        <p className={cn("text-sm mt-1", T.textMuted)}>Live overview of your business health.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} T={T} className="h-28" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KPICard T={T} label="Health Score" value={d.score} icon={Gauge} tone="emerald" sub="/ 100" delay={0} />
          <KPICard T={T} label="Revenue" value={d.revenue} icon={TrendingUp} tone="blue" format={formatLakh} sub="This period" delay={60} />
          <KPICard T={T} label="Expenses" value={d.expenses} icon={Receipt} tone="amber" format={formatLakh} sub="This period" delay={120} />
          <KPICard T={T} label="Profit" value={d.profit} icon={DollarSign} tone="emerald" format={formatLakh} sub="Net margin" delay={180} />
          <KPICard T={T} label="Cash Available" value={d.cash} icon={Wallet} tone="blue" format={formatLakh} sub="On hand" delay={240} />
          <KPICard T={T} label="Runway" value={d.runway} icon={Clock} tone="blue" format={(v) => `${Math.round(v)} mo`} sub="At current burn" delay={300} />
          <KPICard T={T} label="Risk Level" value={d.risk} icon={ShieldQuestion} tone={d.risk === "Low" ? "emerald" : d.risk === "High" ? "rose" : "amber"} sub="Overall" delay={360} />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} T={T} className="h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <KPICard T={T} label="Best Selling Product" value={d.bestSellingProduct ?? "—"} icon={Package} tone="blue" sub="By quantity" delay={0} />
          <KPICard T={T} label="Total Orders" value={d.totalOrders} icon={Hash} tone="blue" sub="This period" delay={40} />
          <KPICard T={T} label="Total Quantity" value={d.totalQuantity} icon={Boxes} tone="emerald" sub="Units sold" delay={80} />
          <KPICard T={T} label="Average Revenue" value={d.averageRevenue} icon={TrendingUp} tone="blue" format={formatLakh} sub="Per order" delay={120} />
          <KPICard T={T} label="Highest Revenue Day" value={d.highestRevenueDay ?? "—"} icon={CalendarPlus} tone="emerald" sub="Best performing day" delay={160} />
          <KPICard T={T} label="Lowest Revenue Day" value={d.lowestRevenueDay ?? "—"} icon={CalendarMinus} tone="amber" sub="Slowest day" delay={200} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <ChartShell T={T} title="Revenue Trend" sub="Revenue over time">
          <ResponsiveContainer>
            <AreaChart data={revenueByDate.map(row => ({ month: row.Date, revenue: row.Revenue }))}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.dark ? "#1e293b" : "#e5e7eb"} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: T.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 100000}L`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v) => formatLakh(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#rev)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell T={T} title="Revenue by Product" sub="Total revenue per product">
          <ResponsiveContainer>
            <AreaChart data={(chartData?.revenueByProduct || []).map(row => ({ month: row.Product, revenue: row.Revenue }))}>
              <defs>
                <linearGradient id="cash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.dark ? "#1e293b" : "#e5e7eb"} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: T.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 100000}L`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v) => formatLakh(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#cash)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell T={T} title="Quantity by Product" sub="Units sold per product">
          <ResponsiveContainer>
            <LineChart data={(chartData?.quantityByProduct || []).map(row => ({ month: row.Product, quantity: row.Quantity }))}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.dark ? "#1e293b" : "#e5e7eb"} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: T.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v) => `${v} units`} />
              <Line type="monotone" dataKey="quantity" stroke="#2563eb" strokeWidth={2.5} dot={false} name="Quantity" />
            </LineChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell T={T} title="Business Growth" sub="Day-over-day revenue growth">
          <ResponsiveContainer>
            <BarChart data={growthByDate.map(row => ({ month: row.date, growth: row.growth }))}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.dark ? "#1e293b" : "#e5e7eb"} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: T.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v) => `${v}%`} />
              <Bar dataKey="growth" fill="#10b981" radius={[6, 6, 0, 0]} name="Growth" />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className={cn("text-sm font-semibold mb-3", T.text)}>Business insights</h2>
          <div className="space-y-3">
            {INSIGHTS.map((it, i) => <InsightCard key={i} item={it} T={T} />)}
          </div>
        </div>
        <div>
          <h2 className={cn("text-sm font-semibold mb-3", T.text)}>Decision timeline</h2>
          <div className={cn("rounded-2xl p-5", T.card)}>
            <div className="space-y-5">
              {TIMELINE.map((ev, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn("h-7 w-7 rounded-full flex items-center justify-center shrink-0", T.accentEmeraldBg)}>
                      <ev.icon size={13} className={T.accentEmerald} />
                    </div>
                    {i < TIMELINE.length - 1 && <div className={cn("w-px flex-1 mt-1", T.dark ? "bg-slate-800" : "bg-gray-200")} />}
                  </div>
                  <div className="pb-5">
                    <div className={cn("text-sm font-medium", T.text)}>{ev.text}</div>
                    <div className={cn("text-xs mt-0.5", T.textFaint)}>{ev.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
