def simulate_marketing(revenue, expenses, budget):
    """
    Assumption:
    Every ₹1 spent on marketing generates ₹3 in additional revenue.
    """

    estimated_revenue_increase = budget * 3

    new_revenue = revenue + estimated_revenue_increase
    new_expenses = expenses + budget

    new_profit = new_revenue - new_expenses
    new_cash = new_profit * 0.80

    business_health = round((new_profit / new_revenue) * 100) if new_revenue else 0

    if business_health >= 50:
        risk = "Low"
    elif business_health >= 30:
        risk = "Medium"
    else:
        risk = "High"

    return {
        "marketingBudget": int(budget),
        "estimatedRevenueIncrease": int(estimated_revenue_increase),
        "newRevenue": int(new_revenue),
        "newExpenses": int(new_expenses),
        "newProfit": int(new_profit),
        "newCash": int(new_cash),
        "businessHealth": business_health,
        "risk": risk
    }