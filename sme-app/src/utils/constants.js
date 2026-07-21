import {
  TrendingUp, AlertTriangle, ShieldAlert, Package, Clock, Users,
  Wrench, CreditCard, FileText, FileSpreadsheet, Receipt,
} from "lucide-react";

export const BASE = {
  score: 89,
  revenue: 1840000,
  expenses: 1220000,
  profit: 620000,
  cash: 1530000,
  runway: 14,
  risk: "Medium",
};

export const INSIGHTS = [
  { icon: TrendingUp, tone: "emerald", text: "Revenue increased 12% this month, driven mainly by repeat customers." },
  { icon: AlertTriangle, tone: "amber", text: "Payroll expenses are increasing rapidly — up 18% over the last quarter." },
  { icon: ShieldAlert, tone: "rose", text: "One customer contributes 48% of revenue. Losing them would be a major risk." },
  { icon: Package, tone: "amber", text: "Inventory turnover is slowing — stock is sitting 9 days longer on average." },
  { icon: Clock, tone: "rose", text: "Late payments increased — average collection time is now 38 days." },
];

export const TIMELINE = [
  { date: "2 Jul 2026", text: "Increased prices by 5%", icon: TrendingUp },
  { date: "18 Jun 2026", text: "Hired 2 employees", icon: Users },
  { date: "29 May 2026", text: "Bought new equipment", icon: Wrench },
  { date: "6 May 2026", text: "Took ₹20L loan", icon: CreditCard },
];

export const UPLOAD_TYPES = [
  { key: "sales", label: "Sales", desc: "Sales CSV", icon: Receipt },
  { key: "expenses", label: "Expenses", desc: "Expenses CSV", icon: CreditCard },
  { key: "invoices", label: "Invoices", desc: "Invoices CSV", icon: FileText },
  { key: "bank", label: "Bank Statements", desc: "Bank Statements CSV", icon: FileSpreadsheet },
  { key: "inventory", label: "Inventory", desc: "Inventory CSV", icon: Package },
];

export const CHAT_SUGGESTIONS = [
  "Can I hire three employees?",
  "Should I take a loan?",
  "What is my biggest financial risk?",
  "Can I open another branch?",
  "Should I increase prices?",
];

