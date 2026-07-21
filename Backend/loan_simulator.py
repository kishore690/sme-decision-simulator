def simulate_loan(cash, loan_amount, interest_rate, years, revenue=0, profit=0):
    """
    Simple Loan Simulator
    """

    # Simple Interest Calculation
    total_interest = (loan_amount * interest_rate * years) / 100
    total_payment = loan_amount + total_interest

    # Monthly EMI
    monthly_emi = total_payment / (years * 12)

    # Cash after taking the loan
    new_cash = cash + loan_amount

    # Estimated cash after paying one month's EMI
    cash_after_first_emi = new_cash - monthly_emi

    # Business Health
    if cash_after_first_emi > cash:
        health = 50
    elif cash_after_first_emi > cash * 0.75:
        health = 40
    elif cash_after_first_emi > cash * 0.50:
        health = 30
    else:
        health = 20

    if health >= 50:
        risk = "Low"
    elif health >= 30:
        risk = "Medium"
    else:
        risk = "High"

    return {
        "revenue": int(revenue),
        "profit": int(profit),
        "loanAmount": int(loan_amount),
        "interestRate": interest_rate,
        "loanPeriod": years,
        "totalInterest": int(total_interest),
        "totalRepayment": int(total_payment),
        "monthlyEMI": round(monthly_emi, 2),
        "newCash": int(new_cash),
        "cashAfterFirstEMI": int(cash_after_first_emi),
        "businessHealth": health,
        "risk": risk
    }