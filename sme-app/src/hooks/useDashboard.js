import { useState, useEffect, useCallback } from "react";
import { getDashboard, getChartData } from "../services/api";

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [chartData, setChartData] = useState({
    revenueByDate: [],
    quantityByProduct: [],
    revenueByProduct: [],
  });

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboard();

      // No CSV uploaded yet, or backend unreachable
      if (!data || data.error) {
        setDashboardData(null);
        setError(data?.error || "No dashboard data available.");
        return;
      }

      const charts = await getChartData();
      if (charts.error) {
        setError(charts.error);
      } else {
        setChartData(charts);
      }

      setDashboardData({
        ...data,
        score: data.businessHealth,
      });
    } catch (err) {
      setError("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    dashboardData,
    chartData,
    dashboardLoading: loading,
    dashboardError: error,
    refetchDashboard: loadDashboard,
  };
}
