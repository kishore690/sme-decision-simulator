import React, { useState } from "react";
import { FileText, BarChart3, ShieldAlert, TrendingUp, Receipt, Download, FileDown, ArrowUpRight, Loader2 } from "lucide-react";
import { cn, formatLakh, downloadBlob } from "../utils/helpers";
import { downloadReportPDF, downloadReportCSV, exportAllReports } from "../services/api";

const TAG_COLORS = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  blue:    "bg-blue-500/10 text-blue-600",
  rose:    "bg-rose-500/10 text-rose-600",
  amber:   "bg-amber-500/10 text-amber-600",
};

export default function Reports({ T, addToast, dashboardData }) {
  const d = dashboardData;
  const [pending, setPending] = useState({}); // e.g. { "monthly-pdf": true }
  const [exportingAll, setExportingAll] = useState(false);

  const REPORTS = [
    {
      type: "monthly",
      title: "Monthly Report",
      desc: "Full breakdown of this month's performance across all key metrics.",
      icon: FileText,
      tag: d ? `Health ${d.businessHealth}%` : "No data",
      tagColor: d && d.businessHealth >= 50 ? "emerald" : "amber",
    },
    {
      type: "quarterly",
      title: "Quarterly Report",
      desc: "Trends and quarter-over-quarter comparisons with variance analysis.",
      icon: BarChart3,
      tag: d ? `${d.totalOrders} ${d.totalOrdersLabel || "sales rows"}` : "No data",
      tagColor: "blue",
    },
    {
      type: "risk",
      title: "Risk Report",
      desc: "Concentration risk, cash flow gaps, and operational red flags.",
      icon: ShieldAlert,
      tag: d ? `${d.risk} risk` : "No data",
      tagColor: d && d.risk === "Low" ? "emerald" : d && d.risk === "High" ? "rose" : "amber",
    },
    {
      type: "revenue",
      title: "Revenue Analysis",
      desc: "Revenue sources, customer concentration, and growth drivers.",
      icon: TrendingUp,
      tag: d ? `Best: ${d.bestSellingProduct}` : "No data",
      tagColor: "blue",
    },
    {
      type: "expense",
      title: "Expense Breakdown",
      desc: "Category-level spend analysis with month-on-month change.",
      icon: Receipt,
      tag: d ? formatLakh(d.expenses) : "No data",
      tagColor: "amber",
    },
  ];

  const setBusy = (key, value) =>
    setPending((prev) => ({ ...prev, [key]: value }));

  const handleDownload = async (report, format) => {
    if (!d) {
      addToast("Upload a CSV before downloading reports");
      return;
    }

    const key = `${report.type}-${format}`;
    setBusy(key, true);

    try {
      const blob =
        format === "pdf"
          ? await downloadReportPDF(report.type)
          : await downloadReportCSV(report.type);

      const filename = `${report.title.replace(/\s+/g, "_")}.${format}`;
      downloadBlob(blob, filename);
      addToast(`${report.title} downloaded as ${format.toUpperCase()}`);
    } catch (err) {
      addToast(err.message || `Failed to download ${report.title}`);
    } finally {
      setBusy(key, false);
    }
  };

  const handleExportAll = async () => {
    if (!d) {
      addToast("Upload a CSV before exporting reports");
      return;
    }

    setExportingAll(true);
    try {
      const blob = await exportAllReports();
      downloadBlob(blob, "SME_Reports.zip");
      addToast("All reports exported");
    } catch (err) {
      addToast(err.message || "Failed to export reports");
    } finally {
      setExportingAll(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className={cn("text-2xl font-semibold tracking-tight", T.text)}>Reports</h1>
          <p className={cn("text-sm mt-1", T.textMuted)}>Professional analytics, ready to export or share.</p>
        </div>
        <button
          onClick={handleExportAll}
          disabled={exportingAll}
          className={cn(
            "hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-colors",
            T.border, T.cardHover, T.textMuted,
            exportingAll && "opacity-60 cursor-not-allowed"
          )}
        >
          {exportingAll ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          {exportingAll ? "Exporting..." : "Export All"}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {REPORTS.map((r, i) => {
          const Icon = r.icon;
          const tagCls = TAG_COLORS[r.tagColor] || TAG_COLORS.blue;
          const pdfBusy = pending[`${r.type}-pdf`];
          const csvBusy = pending[`${r.type}-csv`];
          return (
            <div
              key={i}
              className={cn(
                "group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
                T.card, T.cardHover
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", T.accentBlueBg)}>
                  <Icon size={18} className={T.accentBlue} />
                </div>
                <span className={cn("text-[11px] font-medium px-2 py-1 rounded-full", tagCls)}>
                  {r.tag}
                </span>
              </div>

              <h3 className={cn("text-sm font-semibold mb-1", T.text)}>{r.title}</h3>
              <p className={cn("text-xs leading-relaxed mb-5", T.textMuted)}>{r.desc}</p>

              <div className={cn("flex items-center gap-2 pt-4 border-t", T.dark ? "border-slate-800" : "border-gray-100")}>
                <button
                  onClick={() => handleDownload(r, "pdf")}
                  disabled={pdfBusy}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors",
                    T.dark
                      ? "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      : "border-gray-200 text-slate-500 hover:bg-gray-50 hover:text-slate-700",
                    pdfBusy && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {pdfBusy ? <Loader2 size={12} className="animate-spin" /> : <FileDown size={12} />} PDF
                </button>
                <button
                  onClick={() => handleDownload(r, "csv")}
                  disabled={csvBusy}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors",
                    T.dark
                      ? "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      : "border-gray-200 text-slate-500 hover:bg-gray-50 hover:text-slate-700",
                    csvBusy && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {csvBusy ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />} CSV
                </button>
                <button
                  onClick={() => addToast(`${r.title} link copied`)}
                  className={cn(
                    "ml-auto flex items-center gap-1 text-xs font-medium transition-colors opacity-0 group-hover:opacity-100",
                    T.accentBlue
                  )}
                >
                  Share <ArrowUpRight size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
