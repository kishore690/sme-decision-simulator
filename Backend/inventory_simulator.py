def simulate_inventory(cash, quantity, cost_per_unit, expected_profit_per_unit, revenue=0):
    """
    Inventory Purchase Simulator
    """

    inventory_cost = quantity * cost_per_unit
    expected_profit = quantity * expected_profit_per_unit

    remaining_cash = cash - inventory_cost

    projected_cash = remaining_cash + expected_profit

    business_health = round((projected_cash / cash) * 100) if cash else 0

    if business_health >= 100:
        risk = "Low"
    elif business_health >= 70:
        risk = "Medium"
    else:
        risk = "High"

    return {
        "revenue": int(revenue),
        "profit": int(expected_profit),
        "quantity": quantity,
        "costPerUnit": cost_per_unit,
        "inventoryCost": int(inventory_cost),
        "expectedProfit": int(expected_profit),
        "remainingCash": int(remaining_cash),
        "projectedCash": int(projected_cash),
        "businessHealth": business_health,
        "risk": risk
    }