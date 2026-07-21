def simulate_expansion(cash, expansion_cost, expected_revenue, expected_expenses):
    """
    Branch Expansion Simulator
    """

    remaining_cash = cash - expansion_cost

    projected_profit = expected_revenue - expected_expenses

    projected_cash = remaining_cash + projected_profit

    business_health = round((projected_cash / cash) * 100) if cash else 0

    if business_health >= 100:
        risk = "Low"
    elif business_health >= 70:
        risk = "Medium"
    else:
        risk = "High"

    return {
        "revenue": int(expected_revenue),
        "expansionCost": int(expansion_cost),
        "expectedRevenue": int(expected_revenue),
        "expectedExpenses": int(expected_expenses),
        "projectedProfit": int(projected_profit),
        "remainingCash": int(remaining_cash),
        "projectedCash": int(projected_cash),
        "businessHealth": business_health,
        "risk": risk
    }