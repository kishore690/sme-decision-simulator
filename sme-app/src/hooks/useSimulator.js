import { useState } from "react";
import { simulateHiring } from "../services/api";

const DEFAULT_SIM = {
  hire: 3, price: 5, marketing: 50000, loan: 0,
  supplierCost: 5, paymentDelay: 10, branch: false, machine: false,
};

export function useSimulator(addToast) {
  const [sim, setSim] = useState(DEFAULT_SIM);
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState(null);

  const runSimulation = async () => {
    setSimulating(true);
    setResults(null);

    const response = await simulateHiring(parseInt(sim.hire, 10) || 0);

    if (!response || response.error) {
      setSimulating(false);
      addToast(response?.error || "Unable to run simulation");
      return;
    }

    const { currentBusiness, simulation, aiRecommendation } = response;
    const burn = Math.max(simulation.projectedExpenses / 12, 1);
    const runway = Math.max(1, Math.round((currentBusiness.cash / burn) * 10) / 10);

    setResults({
      revenue: currentBusiness.revenue,
      expenses: simulation.projectedExpenses,
      profit: simulation.projectedProfit,
      cash: simulation.projectedCash,
      runway,
      risk: simulation.risk,
      score: simulation.businessHealth,
      recommendation: aiRecommendation,
    });
    setSimulating(false);
    addToast("Simulation complete");
  };

  return { sim, setSim, simulating, results, runSimulation };
}
