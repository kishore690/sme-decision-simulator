def simulate_price_change(revenue, expenses, percentage):
    # Calculate new revenue
    new_revenue = revenue * (1 + percentage / 100)

    # Keep expense ratio the same
    expense_ratio = (expenses / revenue) if revenue else 0
    new_expenses = new_revenue * expense_ratio

    # Calculate new profit
    new_profit = new_revenue - new_expenses

    # Estimate available cash
    new_cash = new_profit * 0.80

    # Business health
    business_health = round((new_profit / new_revenue) * 100) if new_revenue else 0

    if business_health >= 50:
        risk = "Low"
    elif business_health >= 30:
        risk = "Medium"
    else:
        risk = "High"

    return {
        "newRevenue": int(new_revenue),
        "newExpenses": int(new_expenses),
        "newProfit": int(new_profit),
        "newCash": int(new_cash),
        "businessHealth": business_health,
        "risk": risk
    }