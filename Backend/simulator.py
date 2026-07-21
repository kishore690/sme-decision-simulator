def simulate_hiring(
    revenue: float,
    expenses: float,
    cash: float,
    employees: int,
    monthly_salary: int = 30000
):
    """
    Simulate hiring employees and calculate
    the projected business metrics.
    """

    annual_salary_cost = employees * monthly_salary * 12

    new_expenses = expenses + annual_salary_cost
    new_profit = revenue - new_expenses
    new_cash = cash - annual_salary_cost

    if revenue > 0:
        business_health = round((new_profit / revenue) * 100)
    else:
        business_health = 0

    if business_health >= 50:
        risk = "Low"
    elif business_health >= 30:
        risk = "Medium"
    else:
        risk = "High"

    return {
        "revenue": int(revenue),
        "annualSalaryCost": annual_salary_cost,
        "projectedExpenses": int(new_expenses),
        "projectedProfit": int(new_profit),
        "projectedCash": int(new_cash),
        "businessHealth": business_health,
        "risk": risk
    }