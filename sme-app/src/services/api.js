const BASE_URL = "http://127.0.0.1:8000";

// Dashboard
export async function getDashboard() {
  const response = await fetch(`${BASE_URL}/dashboard`);
  return response.json();
}

export async function getChartData() {
  const response = await fetch(`${BASE_URL}/chart-data`);
  return response.json();
}

// Upload
export async function uploadCSV(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return response.json();
}

// AI Advisor
export async function askAI(question) {
  const response = await fetch(`${BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  return response.json();
}

// Hiring
export async function simulateHiring(employees) {
  const response = await fetch(`${BASE_URL}/simulate/hiring`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ employees }),
  });

  return response.json();
}

// Price
export async function simulatePrice(percentage) {
  const response = await fetch(`${BASE_URL}/simulate/price`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ percentage }),
  });

  return response.json();
}

// Marketing
export async function simulateMarketing(budget) {
  const response = await fetch(`${BASE_URL}/simulate/marketing`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ budget }),
  });

  return response.json();
}

// Loan
export async function simulateLoan(loanAmount, interestRate, loanPeriod) {
  const response = await fetch(`${BASE_URL}/simulate/loan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      loanAmount,
      interestRate,
      years: loanPeriod,
    }),
  });

  return response.json();
}

// Inventory
export async function simulateInventory(quantity, costPerUnit, expectedProfitPerUnit) {
  const response = await fetch(`${BASE_URL}/simulate/inventory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantity,
      costPerUnit,
      expectedProfitPerUnit,
    }),
  });

  return response.json();
}

// Expansion
export async function simulateExpansion(
  expansionCost,
  expectedRevenue,
  expectedExpenses
) {
  const response = await fetch(`${BASE_URL}/simulate/expansion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      expansionCost,
      expectedRevenue,
      expectedExpenses,
    }),
  });

  return response.json();
}

// ---------------- REPORT DOWNLOADS ----------------

async function fetchReportBlob(url) {
  const response = await fetch(url);

  // Backend returns JSON ({ error: ... }) when something goes wrong
  // (no CSV uploaded, unknown report type, etc). A real file download
  // comes back as a binary blob instead.
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok || contentType.includes("application/json")) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Failed to download report.");
  }

  return response.blob();
}

export async function downloadReportPDF(reportType) {
  return fetchReportBlob(`${BASE_URL}/reports/${reportType}/pdf`);
}

export async function downloadReportCSV(reportType) {
  return fetchReportBlob(`${BASE_URL}/reports/${reportType}/csv`);
}

export async function exportAllReports() {
  return fetchReportBlob(`${BASE_URL}/reports/export-all`);
}