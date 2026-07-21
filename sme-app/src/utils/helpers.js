export const cn = (...a) => a.filter(Boolean).join(" ");

export const formatLakh = (n) => {
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(n);
  if (v >= 100000) return `${sign}₹${(v / 100000).toFixed(1)}L`;
  return `${sign}₹${v.toLocaleString("en-IN")}`;
};

// Triggers a browser download for a Blob returned from the backend
// (PDF, CSV, ZIP, etc). Used by the Reports page's download buttons.
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};