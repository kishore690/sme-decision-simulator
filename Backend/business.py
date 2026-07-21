def get_business_metrics(df):
    revenue = df["Revenue"].sum()

    expenses = revenue * 0.60
    profit = revenue - expenses
    cash = profit * 0.80

    business_health = round((profit / revenue) * 100) if revenue else 0

    if business_health >= 50:
        risk = "Low"
    elif business_health >= 30:
        risk = "Medium"
    else:
        risk = "High"

    return {
        "revenue": revenue,
        "expenses": expenses,
        "profit": profit,
        "cash": cash,
        "businessHealth": business_health,
        "risk": risk
    }