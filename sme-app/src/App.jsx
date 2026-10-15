import React, { lazy, Suspense, useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";

import { getTheme } from "./utils/theme";
import { cn } from "./utils/helpers";
import { BASE } from "./utils/constants";

import { useDashboard } from "./hooks/useDashboard";
import { useToasts } from "./hooks/useToasts";
import { useSimulator } from "./hooks/useSimulator";

import Navbar from "./components/Navbar";
const Dashboard = lazy(() => import("./components/Dashboard"));
import Simulator from "./components/Simulator";
import AIAdvisor from "./components/AIAdvisor";
import Reports from "./components/Reports";
import UploadSection from "./components/UploadSection";
import LandingPage from "./components/pages/LandingPage";
import CompareScenarios from "./components/pages/CompareScenarios";
import About from "./components/pages/About";
import { Toasts } from "./components/ui";

export default function App() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("landing");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState({});

  const T = getTheme(dark);
  const { toasts, addToast } = useToasts();
  const { dashboardData, chartData, dashboardLoading, dashboardError, refetchDashboard } = useDashboard();
  const { sim, setSim, simulating, results, runSimulation } = useSimulator(addToast);

  useEffect(() => {
    if (page === "dashboard") {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 550);
      return () => clearTimeout(t);
    }
  }, [page]);

  const dashboardViewData = results
    ? { ...(dashboardData || BASE), ...results }
    : (dashboardData || BASE);

  const renderPage = () => {
    switch (page) {
      case "landing":   return <LandingPage setPage={setPage} T={T} />;
      case "upload":    return <UploadSection T={T} setPage={setPage} addToast={addToast} uploaded={uploaded} setUploaded={setUploaded} onUploaded={refetchDashboard} />;
      case "dashboard": return <Suspense fallback={<div className="p-8 text-center" role="status">Loading dashboard…</div>}><Dashboard T={T} loading={loading || dashboardLoading} data={dashboardViewData} chartData={chartData} error={dashboardError} /></Suspense>;
      case "simulator": return <Simulator T={T} sim={sim} setSim={setSim} onSimulate={runSimulation} results={results} simulating={simulating} dashboardData={dashboardData} />;
      case "advisor":   return <AIAdvisor T={T} />;
      case "compare":   return <CompareScenarios T={T} dashboardData={dashboardData} />;
      case "reports":   return <Reports T={T} addToast={addToast} dashboardData={dashboardData} />;
      case "about":     return <About T={T} />;
      default:          return <LandingPage setPage={setPage} T={T} />;
    }
  };

  return (
    <div className={cn("min-h-screen font-sans transition-colors duration-300", T.page, T.text)}>
      <Navbar page={page} setPage={setPage} T={T} dark={dark} setDark={setDark} addToast={addToast} />

      <div key={page} style={{ animation: "fadeIn 0.35s ease-out" }}>
        {renderPage()}
      </div>

      {page !== "advisor" && (
        <button
          onClick={() => setPage("advisor")}
          className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-teal-800 text-white shadow-lg shadow-slate-900/15 flex items-center justify-center transition-colors hover:bg-teal-900"
          aria-label="Open business advisor"
          title="Open business advisor"
        >
          <MessageSquare size={20} className="text-white" />
        </button>
      )}

      <Toasts toasts={toasts} T={T} />
    </div>
  );
}
