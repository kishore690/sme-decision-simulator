import React, { useState, useRef } from "react";
import { Upload, Sparkles, Check, CheckCircle2, ArrowRight, AlertCircle, FileText } from "lucide-react";
import { cn } from "../utils/helpers";
import { UPLOAD_TYPES } from "../utils/constants";
import { uploadCSV } from "../services/api";

export default function UploadSection({ T, setPage, addToast, uploaded, setUploaded, onUploaded }) {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(null); // null | 0-100
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const uploadToBackend = async (file) => {
    setError(null);
    setProgress(10);
    try {
      const result = await uploadCSV(file);
      setProgress(100);
      if (result.success) {
        addToast("CSV uploaded successfully");
        const all = {};
        UPLOAD_TYPES.forEach(type => {
          all[type.key] = true;
        });
        setUploaded(all);
        if (onUploaded) await onUploaded();
        setTimeout(() => {
          setProgress(null);
          setPage("dashboard");
        }, 800);
      } else {
        setProgress(null);
        setError(result.error || "Upload failed.");
      }
    } catch (err) {
      setProgress(null);
      setError(err.message || "Unable to connect to backend.");
    }
  };

  const toggle = (key) => {
    if (uploaded[key]) return;
    setUploaded((u) => ({ ...u, [key]: true }));
    addToast(`${key[0].toUpperCase() + key.slice(1)} data uploaded`);
  };

  const demo = async () => {
    setError(null);
    setProgress(10);
    try {
      const sampleResponse = await fetch("/demo-sales.csv");
      if (!sampleResponse.ok) throw new Error("Could not download the sample dataset.");
      const csv = await sampleResponse.text();
      const file = new File([csv], "sme-demo-sales.csv", { type: "text/csv" });
      const result = await uploadCSV(file);
      setProgress(100);
      if (!result.success) throw new Error(result.error || "Could not load the demo dataset.");

      const all = {};
      UPLOAD_TYPES.forEach((t) => (all[t.key] = true));
      setUploaded(all);
      if (onUploaded) await onUploaded();
      addToast("Demo sales data loaded");
      setTimeout(() => {
        setProgress(null);
        setPage("dashboard");
      }, 300);
    } catch (err) {
      setProgress(null);
      setError(err.message || "Unable to load the demo dataset.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setError("Only CSV files are supported. Please drop a valid CSV file.");
      return;
    }
    uploadToBackend(file);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setError("Only CSV files are supported.");
      return;
    }
    uploadToBackend(file);
  };

  const count = Object.values(uploaded).filter(Boolean).length;

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
      <div className="text-center mb-10">
        <h1 className={cn("text-3xl font-semibold tracking-tight", T.text)}>Upload your business data</h1>
        <p className={cn("mt-2 text-sm", T.textMuted)}>
          Upload your own sales CSV, or use the sample file to explore the dashboard and simulations.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => progress === null && fileRef.current?.click()}
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 mb-5",
          dragging
            ? T.dark ? "border-blue-500 bg-blue-500/5" : "border-blue-400 bg-blue-50"
            : T.dark ? "border-slate-700 hover:border-slate-600" : "border-gray-300 hover:border-gray-400"
        )}
      >
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />

        {progress !== null ? (
          <div className="space-y-4">
            <div className={cn("h-12 w-12 rounded-2xl mx-auto flex items-center justify-center", T.accentBlueBg)}>
              <FileText size={20} className={T.accentBlue} />
            </div>
            <p className={cn("text-sm font-medium", T.text)}>Uploading...</p>
            <div className="relative h-2 rounded-full w-full max-w-xs mx-auto" style={{ background: T.dark ? "#1e293b" : "#e5e7eb" }}>
              <div
                className="absolute h-2 rounded-full bg-teal-700 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={cn("text-xs tabular-nums", T.textMuted)}>{Math.round(progress)}%</p>
          </div>
        ) : (
          <>
            <div className={cn(
              "h-14 w-14 rounded-2xl mx-auto flex items-center justify-center mb-4 transition-transform",
              dragging ? "scale-110" : "",
              T.accentBlueBg
            )}>
              <Upload size={22} className={T.accentBlue} />
            </div>
            <p className={cn("font-medium text-sm", T.text)}>
              {dragging ? "Drop your CSV here" : "Drag & drop a CSV file here"}
            </p>
            <p className={cn("text-xs mt-1", T.textMuted)}>or click to browse — max 10 MB</p>
            <button
              onClick={(e) => { e.stopPropagation(); demo(); }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-800 text-white text-xs font-medium hover:bg-teal-900 transition-colors"
            >
              <Sparkles size={12} /> Load Demo Dataset
            </button>
            <a
              href="/demo-sales.csv"
              download="sme-demo-sales.csv"
              onClick={(e) => e.stopPropagation()}
              className={cn("mt-3 inline-flex items-center rounded px-2 py-1 text-xs font-medium underline underline-offset-4", T.accentBlue)}
            >
              Download sample CSV
            </a>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className={cn("flex items-center gap-2.5 rounded-xl px-4 py-3 mb-4 text-sm border", T.dark ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-600")}>
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Data type toggles */}
      <p className={cn("text-xs font-semibold uppercase tracking-wide mb-3", T.textMuted)}>Or connect data sources individually</p>
      <div className="grid sm:grid-cols-2 gap-2.5">
        {UPLOAD_TYPES.map((t) => (
          <button
            key={t.key}
            onClick={() => toggle(t.key)}
            className={cn(
              "flex items-center gap-3 rounded-xl p-4 text-left transition-all duration-200",
              uploaded[t.key]
                ? T.dark ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-200"
                : cn(T.card, T.cardHover)
            )}
          >
            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-colors", uploaded[t.key] ? T.accentEmeraldBg : T.accentBlueBg)}>
              {uploaded[t.key] ? <Check size={15} className={T.accentEmerald} /> : <t.icon size={15} className={T.accentBlue} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className={cn("text-xs font-medium", uploaded[t.key] ? T.accentEmerald : T.text)}>{t.desc}</div>
              <div className={cn("text-[11px] mt-0.5", T.textFaint)}>{uploaded[t.key] ? "Connected" : "Not connected"}</div>
            </div>
            {uploaded[t.key] && <CheckCircle2 size={15} className={T.accentEmerald} />}
          </button>
        ))}
      </div>

      {count > 0 && (
        <div className="mt-8 text-center">
          <p className={cn("text-xs mb-3", T.textMuted)}>{count} of {UPLOAD_TYPES.length} data sources connected</p>
          <button
            onClick={() => setPage("dashboard")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-800 text-white text-sm font-medium hover:bg-teal-900 transition-colors"
          >
            View Dashboard <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
