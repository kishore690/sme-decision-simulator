from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import pandas as pd
from business import get_business_metrics
from ai import ask_ai
from simulator import simulate_hiring
from price_simulator import simulate_price_change
from marketing_simulator import simulate_marketing
from loan_simulator import simulate_loan
from inventory_simulator import simulate_inventory
from expansion_simulator import simulate_expansion
from reports import (
    REPORT_TYPES,
    build_report_data,
    generate_all_reports_zip,
    generate_csv_report,
    generate_pdf_report,
)
app = FastAPI()

# Store uploaded CSV in memory
uploaded_data = None

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REQUIRED_COLUMNS = ["Date", "Product", "Quantity", "Revenue"]


# ---------------- REQUEST MODELS ----------------

class Question(BaseModel):
    question: str


class HiringRequest(BaseModel):
    employees: int


class PriceRequest(BaseModel):
    percentage: float

class MarketingRequest(BaseModel):
    budget: float

class LoanRequest(BaseModel):
    loanAmount: float
    interestRate: float
    years: int

class InventoryRequest(BaseModel):
    quantity: int
    costPerUnit: float
    expectedProfitPerUnit: float

class ExpansionRequest(BaseModel):
    expansionCost: float
    expectedRevenue: float
    expectedExpenses: float

# ---------------- HOME ----------------

@app.get("/")
def home():
    return {
        "message": "Welcome to SME Decision Simulator Backend!"
    }


# ---------------- DASHBOARD ----------------

@app.get("/dashboard")
def dashboard():
    global uploaded_data

    if uploaded_data is None:
        return {
            "error": "No CSV uploaded. Please upload a CSV first."
        }

    try:
        metrics = get_business_metrics(uploaded_data)

        total_orders = len(uploaded_data)
        total_quantity = uploaded_data["Quantity"].sum()

        best_selling_product = (
            uploaded_data.groupby("Product")["Quantity"]
            .sum()
            .idxmax()
        )

        average_revenue = round(uploaded_data["Revenue"].mean(), 2)

        highest_day = uploaded_data.loc[
            uploaded_data["Revenue"].idxmax(),
            "Date"
        ]

        lowest_day = uploaded_data.loc[
            uploaded_data["Revenue"].idxmin(),
            "Date"
        ]

        return {
            "businessHealth": metrics["businessHealth"],
            "revenue": int(metrics["revenue"]),
            "expenses": int(metrics["expenses"]),
            "profit": int(metrics["profit"]),
            "cash": int(metrics["cash"]),
            "runway": 12,
            "risk": metrics["risk"],

            "totalOrders": total_orders,
            "totalQuantity": int(total_quantity),
            "bestSellingProduct": best_selling_product,
            "averageRevenue": average_revenue,
            "highestRevenueDay": highest_day,
            "lowestRevenueDay": lowest_day
        }
    except Exception as e:
        return {
            "error": f"Failed to compute dashboard metrics: {str(e)}"
        }


# ---------------- CSV UPLOAD ----------------

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    global uploaded_data

    try:
        df = pd.read_csv(file.file)

        missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
        if missing:
            return {
                "success": False,
                "error": f"CSV is missing required column(s): {', '.join(missing)}. "
                         f"Expected columns: {', '.join(REQUIRED_COLUMNS)}."
            }

        uploaded_data = df

        return {
            "success": True,
            "message": "CSV uploaded successfully!",
            "filename": file.filename,
            "rows": len(uploaded_data),
            "columns": list(uploaded_data.columns),
            "preview": uploaded_data.head(5).to_dict(orient="records")
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to parse CSV: {str(e)}"
        }


# ---------------- CHART DATA ----------------

@app.get("/chart-data")
def chart_data():
    global uploaded_data

    if uploaded_data is None:
        return {
            "error": "No CSV uploaded. Please upload a CSV first."
        }

    try:
        revenue_by_date = (
            uploaded_data.groupby("Date")["Revenue"]
            .sum()
            .reset_index()
        )

        quantity_by_product = (
            uploaded_data.groupby("Product")["Quantity"]
            .sum()
            .reset_index()
        )

        revenue_by_product = (
            uploaded_data.groupby("Product")["Revenue"]
            .sum()
            .reset_index()
        )

        return {
            "revenueByDate": revenue_by_date.to_dict(orient="records"),
            "quantityByProduct": quantity_by_product.to_dict(orient="records"),
            "revenueByProduct": revenue_by_product.to_dict(orient="records")
        }
    except Exception as e:
        return {
            "error": f"Failed to compute chart data: {str(e)}"
        }


# ---------------- AI BUSINESS ADVISOR ----------------

@app.post("/ask")
def ask(question: Question):
    global uploaded_data

    if uploaded_data is None:
        return {
            "error": "Please upload a CSV before asking AI questions."
        }

    # Greeting handling
    greetings = [
        "hi", "hii", "hello", "hey",
        "good morning", "good afternoon", "good evening"
    ]

    user_question = question.question.strip().lower()

    if user_question in greetings:
        return {
            "answer": """Decision:
👋 Hello!

Reason:
I'm your SME Business AI Advisor. I can analyze your uploaded business data and help you make better business decisions.

Recommendations:
- Ask about hiring employees
- Ask about pricing strategy
- Ask about taking a business loan
- Ask about inventory planning
- Ask about business expansion
- Ask about your revenue, profit, cash flow or business health"""
        }

    metrics = get_business_metrics(uploaded_data)

    revenue = metrics["revenue"]
    expenses = metrics["expenses"]
    profit = metrics["profit"]
    cash = metrics["cash"]
    business_health = metrics["businessHealth"]
    risk = metrics["risk"]

    best_selling_product = (
        uploaded_data.groupby("Product")["Quantity"]
        .sum()
        .idxmax()
    )

    prompt = f"""You are an experienced SME Business Consultant.

Business Summary

Revenue: ₹{int(revenue)}
Expenses: ₹{int(expenses)}
Profit: ₹{int(profit)}
Cash Available: ₹{int(cash)}
Business Health: {business_health}%
Risk Level: {risk}
Best Selling Product: {best_selling_product}

User Question:
{question.question}

Respond ONLY in the following format.

Decision:
✅ Approve
or
❌ Reject

Reason:
Maximum 2 short sentences.

Recommendations:
- Recommendation 1
- Recommendation 2
- Recommendation 3

Rules:
- Maximum 80 words.
- No introduction.
- No conclusion.
- Be concise.
- Be practical.
- Do not explain calculations.
"""

    answer = ask_ai(prompt)

    return {
        "answer": answer
    }
# ---------------- HIRING SIMULATION ----------------

@app.post("/simulate/hiring")
def hiring_simulation(data: HiringRequest):
    global uploaded_data

    if uploaded_data is None:
        return {
            "error": "Please upload a CSV first."
        }

    metrics = get_business_metrics(uploaded_data)

    revenue = metrics["revenue"]
    expenses = metrics["expenses"]
    profit = metrics["profit"]
    cash = metrics["cash"]

    simulation = simulate_hiring(
        revenue=revenue,
        expenses=expenses,
        cash=cash,
        employees=data.employees
    )

    prompt = f"""You are an experienced SME Business Consultant.

Current Business

Revenue: ₹{int(revenue)}
Expenses: ₹{int(expenses)}
Profit: ₹{int(profit)}
Cash: ₹{int(cash)}

Hiring Simulation

Employees to Hire: {data.employees}
Annual Salary Cost: ₹{simulation['annualSalaryCost']}
Projected Expenses: ₹{simulation['projectedExpenses']}
Projected Profit: ₹{simulation['projectedProfit']}
Projected Cash: ₹{simulation['projectedCash']}
Business Health: {simulation['businessHealth']}%
Risk Level: {simulation['risk']}

Should the company hire these employees?

Respond ONLY in the following format.

Decision:
✅ Approve
or
❌ Reject

Reason:
Maximum 2 short sentences.

Recommendations:
- Recommendation 1
- Recommendation 2
- Recommendation 3

Rules:
- Maximum 80 words.
- Focus only on the hiring decision.
- No introduction.
- No conclusion.
- Do not explain calculations.
"""

    ai_answer = ask_ai(prompt)

    return {
        "currentBusiness": {
            "revenue": int(revenue),
            "expenses": int(expenses),
            "profit": int(profit),
            "cash": int(cash)
        },
        "simulation": simulation,
        "aiRecommendation": ai_answer
    }

# ---------------- PRICE SIMULATION ----------------

@app.post("/simulate/price")
def price_simulation(data: PriceRequest):
    global uploaded_data

    if uploaded_data is None:
        return {
            "error": "Please upload a CSV first."
        }

    metrics = get_business_metrics(uploaded_data)

    simulation = simulate_price_change(
        revenue=metrics["revenue"],
        expenses=metrics["expenses"],
        percentage=data.percentage
    )

    prompt = f"""You are an experienced SME Business Consultant.

Current Business

Revenue: ₹{int(metrics['revenue'])}
Expenses: ₹{int(metrics['expenses'])}
Profit: ₹{int(metrics['profit'])}
Cash: ₹{int(metrics['cash'])}

Price Change Simulation

Price Change: {data.percentage}%
Projected Revenue: ₹{simulation['newRevenue']}
Projected Profit: ₹{simulation['newProfit']}
Projected Cash: ₹{simulation['newCash']}
Business Health: {simulation['businessHealth']}%
Risk Level: {simulation['risk']}

Should the company increase prices?

Respond ONLY in the following format.

Decision:
✅ Approve
or
❌ Reject

Reason:
Maximum 2 short sentences.

Recommendations:
- Recommendation 1
- Recommendation 2
- Recommendation 3

Rules:
- Maximum 80 words.
- Focus only on the pricing decision.
- No introduction.
- No conclusion.
- Do not explain calculations.
"""

    ai_answer = ask_ai(prompt)

    return {
        "currentBusiness": {
            "revenue": int(metrics["revenue"]),
            "expenses": int(metrics["expenses"]),
            "profit": int(metrics["profit"]),
            "cash": int(metrics["cash"])
        },
        "simulation": simulation,
        "aiRecommendation": ai_answer
    }

# ---------------- MARKETING SIMULATION ----------------

@app.post("/simulate/marketing")
def marketing_simulation(data: MarketingRequest):
    global uploaded_data

    if uploaded_data is None:
        return {
            "error": "Please upload a CSV first."
        }

    metrics = get_business_metrics(uploaded_data)

    simulation = simulate_marketing(
        revenue=metrics["revenue"],
        expenses=metrics["expenses"],
        budget=data.budget
    )

    prompt = f"""
You are an experienced SME Business Consultant.

Current Business

Revenue: ₹{int(metrics['revenue'])}
Expenses: ₹{int(metrics['expenses'])}
Profit: ₹{int(metrics['profit'])}
Cash: ₹{int(metrics['cash'])}

Marketing Simulation

Marketing Budget: ₹{simulation['marketingBudget']}
Estimated Revenue Increase: ₹{simulation['estimatedRevenueIncrease']}
Projected Revenue: ₹{simulation['newRevenue']}
Projected Profit: ₹{simulation['newProfit']}
Projected Cash: ₹{simulation['newCash']}
Business Health: {simulation['businessHealth']}%
Risk Level: {simulation['risk']}

Should the company invest this amount in marketing?

Respond ONLY in the following format.

Decision:
Approve or Reject

Reason:
Maximum 2 short sentences.

Recommendations:
• Recommendation 1
• Recommendation 2
• Recommendation 3

Rules:
- Maximum 80 words.
- Focus only on the marketing investment decision.
- No introduction.
- No conclusion.
- Do not explain calculations.
"""

    ai_answer = ask_ai(prompt)

    return {
        "currentBusiness": {
            "revenue": int(metrics["revenue"]),
            "expenses": int(metrics["expenses"]),
            "profit": int(metrics["profit"]),
            "cash": int(metrics["cash"])
        },
        "simulation": simulation,
        "aiRecommendation": ai_answer
    }

# ---------------- LOAN SIMULATION ----------------

@app.post("/simulate/loan")
def loan_simulation(data: LoanRequest):
    global uploaded_data

    if uploaded_data is None:
        return {
            "error": "Please upload a CSV first."
        }

    metrics = get_business_metrics(uploaded_data)

    simulation = simulate_loan(
        cash=metrics["cash"],
        loan_amount=data.loanAmount,
        interest_rate=data.interestRate,
        years=data.years,
        revenue=metrics["revenue"],
        profit=metrics["profit"]
    )

    prompt = f"""
You are an experienced SME Business Consultant.

Current Business

Cash Available: ₹{int(metrics['cash'])}
Business Health: {metrics['businessHealth']}%
Risk Level: {metrics['risk']}

Loan Simulation

Loan Amount: ₹{simulation['loanAmount']}
Interest Rate: {simulation['interestRate']}%
Loan Period: {simulation['loanPeriod']} years
Total Interest: ₹{simulation['totalInterest']}
Total Repayment: ₹{simulation['totalRepayment']}
Monthly EMI: ₹{simulation['monthlyEMI']}
Cash After Loan: ₹{simulation['newCash']}
Cash After First EMI: ₹{simulation['cashAfterFirstEMI']}
Business Health: {simulation['businessHealth']}%
Risk Level: {simulation['risk']}

Should the company take this loan?

Respond ONLY in the following format.

Decision:
Approve or Reject

Reason:
Maximum 2 short sentences.

Recommendations:
• Recommendation 1
• Recommendation 2
• Recommendation 3

Rules:
- Maximum 80 words.
- Focus only on the loan decision.
- No introduction.
- No conclusion.
- Do not explain calculations.
"""

    ai_answer = ask_ai(prompt)

    return {
        "currentBusiness": {
            "cash": int(metrics["cash"]),
            "businessHealth": metrics["businessHealth"],
            "risk": metrics["risk"]
        },
        "simulation": simulation,
        "aiRecommendation": ai_answer
    }

# ---------------- INVENTORY SIMULATION ----------------

@app.post("/simulate/inventory")
def inventory_simulation(data: InventoryRequest):
    global uploaded_data

    if uploaded_data is None:
        return {
            "error": "Please upload a CSV first."
        }

    metrics = get_business_metrics(uploaded_data)

    simulation = simulate_inventory(
        cash=metrics["cash"],
        quantity=data.quantity,
        cost_per_unit=data.costPerUnit,
        expected_profit_per_unit=data.expectedProfitPerUnit,
        revenue=metrics["revenue"]
    )

    prompt = f"""
You are an experienced SME Business Consultant.

Current Business

Cash Available: ₹{int(metrics['cash'])}
Business Health: {metrics['businessHealth']}%
Risk Level: {metrics['risk']}

Inventory Simulation

Quantity: {simulation['quantity']}
Cost Per Unit: ₹{simulation['costPerUnit']}
Inventory Cost: ₹{simulation['inventoryCost']}
Expected Profit: ₹{simulation['expectedProfit']}
Remaining Cash: ₹{simulation['remainingCash']}
Projected Cash: ₹{simulation['projectedCash']}
Business Health: {simulation['businessHealth']}%
Risk Level: {simulation['risk']}

Should the company purchase this inventory?

Respond ONLY in the following format.

Decision:
Approve or Reject

Reason:
Maximum 2 short sentences.

Recommendations:
• Recommendation 1
• Recommendation 2
• Recommendation 3

Rules:
- Maximum 80 words.
- Focus only on the inventory purchase decision.
- No introduction.
- No conclusion.
- Do not explain calculations.
"""

    ai_answer = ask_ai(prompt)

    return {
        "currentBusiness": {
            "cash": int(metrics["cash"]),
            "businessHealth": metrics["businessHealth"],
            "risk": metrics["risk"]
        },
        "simulation": simulation,
        "aiRecommendation": ai_answer
    }

# ---------------- EXPANSION SIMULATION ----------------

@app.post("/simulate/expansion")
def expansion_simulation(data: ExpansionRequest):
    global uploaded_data

    if uploaded_data is None:
        return {
            "error": "Please upload a CSV first."
        }

    metrics = get_business_metrics(uploaded_data)

    simulation = simulate_expansion(
        cash=metrics["cash"],
        expansion_cost=data.expansionCost,
        expected_revenue=data.expectedRevenue,
        expected_expenses=data.expectedExpenses
    )

    prompt = f"""
You are an experienced SME Business Consultant.

Current Business

Cash Available: ₹{int(metrics['cash'])}
Business Health: {metrics['businessHealth']}%
Risk Level: {metrics['risk']}

Expansion Simulation

Expansion Cost: ₹{simulation['expansionCost']}
Expected Revenue: ₹{simulation['expectedRevenue']}
Expected Expenses: ₹{simulation['expectedExpenses']}
Projected Profit: ₹{simulation['projectedProfit']}
Remaining Cash: ₹{simulation['remainingCash']}
Projected Cash: ₹{simulation['projectedCash']}
Business Health: {simulation['businessHealth']}%
Risk Level: {simulation['risk']}

Should the company proceed with this expansion?

Respond ONLY in the following format.

Decision:
Approve or Reject

Reason:
Maximum 2 short sentences.

Recommendations:
• Recommendation 1
• Recommendation 2
• Recommendation 3

Rules:
- Maximum 80 words.
- Focus only on the expansion decision.
- No introduction.
- No conclusion.
- Do not explain calculations.
"""

    ai_answer = ask_ai(prompt)

    return {
        "currentBusiness": {
            "cash": int(metrics["cash"]),
            "businessHealth": metrics["businessHealth"],
            "risk": metrics["risk"]
        },
        "simulation": simulation,
        "aiRecommendation": ai_answer
    }
# ---------------- REPORT DOWNLOADS ----------------

@app.get("/reports/{report_type}/pdf")
def download_report_pdf(report_type: str):
    global uploaded_data

    if uploaded_data is None:
        return {"error": "Please upload a CSV first."}

    if report_type not in REPORT_TYPES:
        return {"error": f"Unknown report type: {report_type}"}

    try:
        data = build_report_data(uploaded_data)
        pdf_buffer = generate_pdf_report(report_type, data)
        filename = f"{REPORT_TYPES[report_type]['title'].replace(' ', '_')}.pdf"

        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        return {"error": f"Failed to generate PDF report: {str(e)}"}


@app.get("/reports/{report_type}/csv")
def download_report_csv(report_type: str):
    global uploaded_data

    if uploaded_data is None:
        return {"error": "Please upload a CSV first."}

    if report_type not in REPORT_TYPES:
        return {"error": f"Unknown report type: {report_type}"}

    try:
        data = build_report_data(uploaded_data)
        csv_buffer = generate_csv_report(report_type, data)
        filename = f"{REPORT_TYPES[report_type]['title'].replace(' ', '_')}.csv"

        return StreamingResponse(
            csv_buffer,
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        return {"error": f"Failed to generate CSV report: {str(e)}"}


@app.get("/reports/export-all")
def export_all_reports():
    global uploaded_data

    if uploaded_data is None:
        return {"error": "Please upload a CSV first."}

    try:
        zip_buffer = generate_all_reports_zip(uploaded_data)

        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": 'attachment; filename="SME_Reports.zip"'}
        )
    except Exception as e:
        return {"error": f"Failed to export reports: {str(e)}"}