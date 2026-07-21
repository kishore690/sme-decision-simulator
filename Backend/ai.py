from google import genai
from dotenv import load_dotenv
import os
import re
import traceback

# Load .env from this file's own directory, regardless of where the
# server process's working directory happens to be.
_ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(dotenv_path=_ENV_PATH)

_api_key = os.getenv("GEMINI_API_KEY")
if not _api_key:
    print(f"WARNING: GEMINI_API_KEY not found. Looked for .env at: {_ENV_PATH}")

# If there's no key at all, don't even try to build a client - go
# straight to the local fallback engine instead of crashing.
try:
    client = genai.Client(api_key=_api_key) if _api_key else None
except Exception as e:
    print("Gemini client init error:", repr(e))
    client = None


# ---------------------------------------------------------------------
# Local rule-based fallback "AI" engine.
#
# Gemini's free tier frequently returns 429 RESOURCE_EXHAUSTED or
# 503 UNAVAILABLE. When that happens we must NOT show the user an
# "AI unavailable" message and we must NOT crash the backend. Instead
# we generate a smart, business-metric-driven recommendation locally,
# in the exact same Decision / Reason / Recommendations format the
# frontend already knows how to render. The user never sees a
# difference between a Gemini answer and a local one.
# ---------------------------------------------------------------------

def _num(pattern: str, text: str):
    """Extract the first numeric match for a regex pattern, or None."""
    match = re.search(pattern, text)
    if not match:
        return None
    raw = match.group(1).replace(",", "")
    try:
        return float(raw)
    except ValueError:
        return None


def _extract_metrics(prompt: str) -> dict:
    """Pull the key business figures back out of the prompt that was
    going to be sent to Gemini, so the local fallback engine can reason
    about the same numbers even though it never talks to an LLM.
    """

    risk_match = re.search(r"Risk Level:\s*(Low|Medium|High)", prompt, re.IGNORECASE)

    # Prefer post-decision ("projected"/"new") figures when present,
    # otherwise fall back to the plain current-business figure.
    profit = (
        _num(r"Projected Profit:\s*₹?(-?[\d,]+(?:\.\d+)?)", prompt)
        or _num(r"New Profit:\s*₹?(-?[\d,]+(?:\.\d+)?)", prompt)
        or _num(r"(?<!Projected )(?<!New )Profit:\s*₹?(-?[\d,]+(?:\.\d+)?)", prompt)
    )
    cash = (
        _num(r"Projected Cash:\s*₹?(-?[\d,]+(?:\.\d+)?)", prompt)
        or _num(r"Cash After First EMI:\s*₹?(-?[\d,]+(?:\.\d+)?)", prompt)
        or _num(r"New Cash:\s*₹?(-?[\d,]+(?:\.\d+)?)", prompt)
        or _num(r"Remaining Cash:\s*₹?(-?[\d,]+(?:\.\d+)?)", prompt)
        or _num(r"Cash(?: Available| After Loan)?:\s*₹?(-?[\d,]+(?:\.\d+)?)", prompt)
    )
    health = _num(r"Business Health:\s*(-?[\d,]+(?:\.\d+)?)%", prompt)

    return {
        "risk": risk_match.group(1).title() if risk_match else None,
        "profit": profit,
        "cash": cash,
        "businessHealth": health,
    }


def _topic_from_prompt(prompt: str) -> str:
    lowered = prompt.lower()
    if "hiring simulation" in lowered:
        return "hiring these employees"
    if "price change simulation" in lowered:
        return "this price change"
    if "marketing simulation" in lowered:
        return "this marketing investment"
    if "loan simulation" in lowered:
        return "this loan"
    if "inventory simulation" in lowered:
        return "this inventory purchase"
    if "expansion simulation" in lowered:
        return "this expansion"
    return "this decision"


def _local_recommendation(prompt: str) -> str:
    """Rule-based fallback advisor. Mirrors the Decision / Reason /
    Recommendations format the frontend parses, so the UI can't tell
    the difference between this and a real Gemini answer.
    """

    metrics = _extract_metrics(prompt)
    risk = metrics["risk"]
    profit = metrics["profit"]
    cash = metrics["cash"]
    topic = _topic_from_prompt(prompt)

    # If no explicit risk level was found in the prompt, derive one
    # from whatever numbers we could find.
    if risk is None:
        if profit is not None and profit > 0 and (cash is None or cash >= 0):
            risk = "Low"
        elif profit is not None and profit <= 0:
            risk = "High"
        else:
            risk = "Medium"

    cash_ok = cash is None or cash >= 0
    profit_ok = profit is None or profit > 0

    if risk == "Low" and profit_ok and cash_ok:
        decision = "✅ Approve"
        reason = (
            f"Business maintains healthy cash reserves and profitability, "
            f"so it can comfortably absorb {topic}."
        )
        recommendations = [
            "Proceed and monitor performance monthly.",
            "Reinvest a portion of the upside into growth.",
            "Keep at least 3 months of expenses in reserve.",
        ]
    elif risk == "High" or not profit_ok or not cash_ok:
        decision = "❌ Reject"
        reason = (
            f"{topic.capitalize()} would push cash flow and profitability into "
            f"risky territory given current business performance."
        )
        recommendations = [
            "Delay this decision until cash flow improves.",
            "Cut non-essential expenses before committing further capital.",
            "Revisit the numbers once revenue trends upward.",
        ]
    else:
        decision = "⚠ Proceed with Caution"
        reason = (
            f"Cash flow needs monitoring, so {topic} is workable only with "
            f"a conservative, gradual approach."
        )
        recommendations = [
            "Start with a smaller commitment and scale gradually.",
            "Track cash flow weekly for the next few months.",
            "Have a contingency plan if revenue underperforms.",
        ]

    return f"""Decision:
{decision}

Reason:
{reason}

Recommendations:
- {recommendations[0]}
- {recommendations[1]}
- {recommendations[2]}"""


def _safe_fallback() -> str:
    """Absolute last resort if even the local engine somehow throws.
    Still valid Decision/Reason/Recommendations format, still no crash.
    """
    return """Decision:
⚠ Proceed with Caution

Reason:
Unable to fully analyze the data right now. Review the simulation results manually before deciding.

Recommendations:
- Review the simulation results shown above.
- Consult your financial statements before deciding.
- Try again shortly for a fresh recommendation."""


def ask_ai(prompt: str) -> str:
    """Ask Gemini for a recommendation. If Gemini is unavailable
    (rate limited, down, misconfigured, or errors for any reason),
    silently fall back to a local rule-based recommendation so the
    API never surfaces an error to the user and the backend never
    crashes.
    """

    if client is not None:
        try:
            response = client.models.generate_content(
                model="gemini-flash-latest",
                contents=prompt,
            )
            text = getattr(response, "text", None)
            if text and text.strip():
                return text
            print("Gemini returned an empty response, using local fallback.")
        except Exception as e:
            print("Gemini Error (falling back to local AI):", repr(e))
            traceback.print_exc()

    # Gemini failed, quota exceeded, timed out, or no API key configured.
    # Use the local rule-based engine instead of showing an error.
    try:
        return _local_recommendation(prompt)
    except Exception as e:
        print("Local AI fallback error:", repr(e))
        traceback.print_exc()
        return _safe_fallback()