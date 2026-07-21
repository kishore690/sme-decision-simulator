"""
Report generation for the SME Decision Simulator.

Generates real PDF and CSV files (and a ZIP bundle of all reports) using
the same business metrics shown on the dashboard: Revenue, Expenses,
Profit, Cash, Business Health, Risk, Best Selling Product, Orders and
the date the report was generated.
"""

import csv
import io
import zipfile
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from business import get_business_metrics

# Report types shown in the Reports page. Keys are the URL-safe slugs
# used by the /reports endpoints; titles/descriptions match the
# frontend's Reports.jsx cards.
REPORT_TYPES = {
    "monthly": {
        "title": "Monthly Report",
        "description": "Full breakdown of this month's performance across all key metrics.",
    },
    "quarterly": {
        "title": "Quarterly Report",
        "description": "Trends and quarter-over-quarter comparisons with variance analysis.",
    },
    "risk": {
        "title": "Risk Report",
        "description": "Concentration risk, cash flow gaps, and operational red flags.",
    },
    "revenue": {
        "title": "Revenue Analysis",
        "description": "Revenue sources, customer concentration, and growth drivers.",
    },
    "expense": {
        "title": "Expense Breakdown",
        "description": "Category-level spend analysis with month-on-month change.",
    },
}


def build_report_data(uploaded_data) -> dict:
    """Build the shared metrics payload used across all report types."""

    if uploaded_data is None:
        raise ValueError("No CSV uploaded. Please upload a CSV first.")

    metrics = get_business_metrics(uploaded_data)

    total_orders = len(uploaded_data)
    best_selling_product = (
        uploaded_data.groupby("Product")["Quantity"].sum().idxmax()
    )

    return {
        "revenue": int(metrics["revenue"]),
        "expenses": int(metrics["expenses"]),
        "profit": int(metrics["profit"]),
        "cash": int(metrics["cash"]),
        "businessHealth": metrics["businessHealth"],
        "risk": metrics["risk"],
        "bestSellingProduct": str(best_selling_product),
        "totalOrders": total_orders,
        "dateGenerated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }


def _meta_and_rows(report_type: str, data: dict):
    meta = REPORT_TYPES.get(report_type, REPORT_TYPES["monthly"])
    rows = [
        ("Revenue", f"Rs. {data['revenue']:,}"),
        ("Expenses", f"Rs. {data['expenses']:,}"),
        ("Profit", f"Rs. {data['profit']:,}"),
        ("Cash", f"Rs. {data['cash']:,}"),
        ("Business Health", f"{data['businessHealth']}%"),
        ("Risk Level", data["risk"]),
        ("Best Selling Product", data["bestSellingProduct"]),
        ("Orders", str(data["totalOrders"])),
        ("Date Generated", data["dateGenerated"]),
    ]
    return meta, rows


def generate_pdf_report(report_type: str, data: dict) -> io.BytesIO:
    """Build a real PDF file (in memory) for the given report type."""

    meta, rows = _meta_and_rows(report_type, data)

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    eyebrow_style = ParagraphStyle(
        "Eyebrow",
        parent=styles["Normal"],
        textColor=colors.HexColor("#64748b"),
        fontSize=10,
        spaceAfter=4,
    )
    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        alignment=TA_LEFT,
        fontSize=20,
        spaceAfter=6,
    )
    desc_style = ParagraphStyle(
        "ReportDesc",
        parent=styles["Normal"],
        textColor=colors.HexColor("#334155"),
        fontSize=10,
        spaceAfter=14,
    )
    footer_style = ParagraphStyle(
        "Footer",
        parent=styles["Normal"],
        textColor=colors.HexColor("#94a3b8"),
        fontSize=8,
    )

    elements = [
        Paragraph("SME DECISION SIMULATOR", eyebrow_style),
        Paragraph(meta["title"], title_style),
        Paragraph(meta["description"], desc_style),
    ]

    table = Table(rows, colWidths=[7 * cm, 8 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.6, colors.HexColor("#e2e8f0")),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                (
                    "ROWBACKGROUNDS",
                    (0, 0),
                    (-1, -1),
                    [colors.white, colors.HexColor("#f8fafc")],
                ),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )

    elements.append(table)
    elements.append(Spacer(1, 1 * cm))
    elements.append(
        Paragraph(
            "Generated automatically by SME Decision Simulator.",
            footer_style,
        )
    )

    doc.build(elements)
    buffer.seek(0)
    return buffer


def generate_csv_report(report_type: str, data: dict) -> io.BytesIO:
    """Build a real CSV file (in memory) for the given report type."""

    meta, rows = _meta_and_rows(report_type, data)

    text_buffer = io.StringIO()
    writer = csv.writer(text_buffer)
    writer.writerow([meta["title"]])
    writer.writerow([meta["description"]])
    writer.writerow([])
    writer.writerow(["Metric", "Value"])
    for label, value in rows:
        writer.writerow([label, value])

    # utf-8-sig so the ₹/Rs. symbols and the file open cleanly in Excel.
    byte_buffer = io.BytesIO(text_buffer.getvalue().encode("utf-8-sig"))
    byte_buffer.seek(0)
    return byte_buffer


def generate_all_reports_zip(uploaded_data) -> io.BytesIO:
    """Bundle every report (PDF + CSV) into a single downloadable ZIP,
    used by the "Export All" button.
    """

    data = build_report_data(uploaded_data)

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for report_type, meta in REPORT_TYPES.items():
            safe_name = meta["title"].replace(" ", "_")
            pdf_bytes = generate_pdf_report(report_type, data).getvalue()
            csv_bytes = generate_csv_report(report_type, data).getvalue()
            zf.writestr(f"{safe_name}.pdf", pdf_bytes)
            zf.writestr(f"{safe_name}.csv", csv_bytes)

    zip_buffer.seek(0)
    return zip_buffer