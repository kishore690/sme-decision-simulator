const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

async function fetchJSON(url, options) {
  const response = await fetch(`${BASE_URL}${url}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || data.error || `Request failed (${response.status}).`);
  return data;
}

// Dashboard
export async function getDashboard() {
  return fetchJSON("/dashboard");
}

export async function getChartData() {
  return fetchJSON("/chart-data");
}

// Upload
export async function uploadBusinessFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  return fetchJSON("/upload", {
    method: "POST",
    body: formData,
  });
}

// AI Advisor
export async function askAI(question) {
  return fetchJSON("/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });
}

// Hiring
export async function simulateHiring(employees) {
  return fetchJSON("/simulate/hiring", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ employees }),
  });
}

// Price
export async function simulatePrice(percentage) {
  return fetchJSON("/simulate/price", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ percentage }),
  });
}

// Marketing
export async function simulateMarketing(budget) {
  return fetchJSON("/simulate/marketing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ budget }),
  });
}

// Loan
export async function simulateLoan(loanAmount, interestRate, loanPeriod) {
  return fetchJSON("/simulate/loan", {
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
}

// Inventory
export async function simulateInventory(quantity, costPerUnit, expectedProfitPerUnit) {
  return fetchJSON("/simulate/inventory", {
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
}

// Expansion
export async function simulateExpansion(
  expansionCost,
  expectedRevenue,
  expectedExpenses
) {
  return fetchJSON("/simulate/expansion", {
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
    throw new Error(data?.detail || data?.error || "Failed to download report.");
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
