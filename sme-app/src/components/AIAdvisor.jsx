import React, { useState, useRef } from "react";
import { Sparkles, Send, CheckCircle2, XCircle, Lightbulb, RotateCcw } from "lucide-react";
import { cn } from "../utils/helpers";
import { CHAT_SUGGESTIONS } from "../utils/constants";
import { askAI } from "../services/api";

function AnswerCard({ T, answer }) {
  // Try to parse structured response: Decision / Reason / Recommendations
  const decisionMatch = answer.match(/Decision[:\s]*([\s\S]*?)(?=Reason:|$)/i);
  const reasonMatch = answer.match(/Reason[:\s]*([\s\S]*?)(?=Recommendations:|$)/i);
  const recsMatch = answer.match(/Recommendations[:\s]*([\s\S]*?)$/i);

  const hasStructure = decisionMatch && reasonMatch;

  if (!hasStructure) {
    return (
      <div className={cn("rounded-2xl p-5", T.dark ? "bg-slate-800" : "bg-gray-50")}>
        <p className={cn("text-sm leading-relaxed", T.text)}>{answer}</p>
      </div>
    );
  }

  const decision = decisionMatch[1].trim();
  const reason = reasonMatch[1].trim();
  const recsRaw = recsMatch ? recsMatch[1].trim() : "";
  const recs = recsRaw.split(/[\n•\-]/).map(r => r.trim()).filter(Boolean);

  const isApprove = /approve|✅|yes|proceed/i.test(decision);
  const isReject = /reject|❌|no|don.t/i.test(decision);

  return (
    <div className={cn("rounded-2xl overflow-hidden border", T.dark ? "border-slate-700" : "border-gray-200")}>
      {/* Decision banner */}
      <div className={cn(
        "flex items-center gap-3 px-5 py-4",
        isApprove
          ? (T.dark ? "bg-emerald-500/10" : "bg-emerald-50")
          : isReject
          ? (T.dark ? "bg-rose-500/10" : "bg-rose-50")
          : (T.dark ? "bg-blue-500/10" : "bg-blue-50")
      )}>
        {isApprove
          ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
          : isReject
          ? <XCircle size={18} className="text-rose-500 shrink-0" />
          : <Sparkles size={18} className="text-blue-500 shrink-0" />
        }
        <div>
          <p className={cn("text-xs font-semibold uppercase tracking-wide", T.textMuted)}>Decision</p>
          <p className={cn(
            "text-sm font-semibold",
            isApprove ? "text-emerald-600" : isReject ? "text-rose-600" : T.text
          )}>{decision}</p>
        </div>
      </div>

      {/* Reason */}
      <div className={cn("px-5 py-4 border-t", T.dark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-100")}>
        <p className={cn("text-xs font-semibold uppercase tracking-wide mb-1.5", T.textMuted)}>Reason</p>
        <p className={cn("text-sm leading-relaxed", T.text)}>{reason}</p>
      </div>

      {/* Recommendations */}
      {recs.length > 0 && (
        <div className={cn("px-5 py-4 border-t", T.dark ? "bg-slate-800/30 border-slate-700" : "bg-gray-50 border-gray-100")}>
          <p className={cn("text-xs font-semibold uppercase tracking-wide mb-3", T.textMuted)}>Recommendations</p>
          <ul className="space-y-2">
            {recs.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <Lightbulb size={13} className="text-amber-500 shrink-0 mt-0.5" />
                <span className={cn("text-sm leading-relaxed", T.text)}>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function AIAdvisor({ T }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [asked, setAsked] = useState("");
  const textareaRef = useRef(null);

  const [error, setError] = useState(null);

  const send = async (text) => {
    const q = (text || question).trim();
    if (!q) return;
    setAsked(q);
    setLoading(true);
    setAnswer(null);
    setError(null);

    const response = await askAI(q);

    if (!response || response.error) {
      setError(response?.error || "Unable to reach the AI advisor.");
      setLoading(false);
      return;
    }

    setAnswer(response.answer);
    setLoading(false);
  };

  const reset = () => {
    setQuestion("");
    setAnswer(null);
    setError(null);
    setAsked("");
    setLoading(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", T.dark ? "bg-blue-500/10" : "bg-blue-50")}>
            <Sparkles size={18} className="text-blue-500" />
          </div>
          <h1 className={cn("text-2xl font-semibold tracking-tight", T.text)}>AI Advisor</h1>
        </div>
        <p className={cn("text-sm mt-1 ml-12", T.textMuted)}>Plain-language guidance grounded in your business data.</p>
      </div>

      {/* Input area */}
      {!answer && !loading && (
        <div className="space-y-4">
          <div className={cn("rounded-2xl border p-4", T.dark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200")}>
            <textarea
              ref={textareaRef}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything about your business — hiring, pricing, loans, risk, expansion..."
              rows={4}
              className={cn(
                "w-full bg-transparent outline-none text-sm resize-none leading-relaxed",
                T.text, T.dark ? "placeholder-slate-600" : "placeholder-slate-400"
              )}
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: T.dark ? "#1e293b" : "#f1f5f9" }}>
              <p className={cn("text-xs", T.textFaint)}>Press Enter to ask, Shift+Enter for new line</p>
              <button
                onClick={() => send()}
                disabled={!question.trim()}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity",
                  question.trim() ? "bg-gradient-to-r from-blue-600 to-emerald-500 hover:opacity-90" : "bg-slate-400 cursor-not-allowed opacity-60"
                )}
              >
                <Send size={14} /> Ask AI
              </button>
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <p className={cn("text-xs mb-2", T.textFaint)}>Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {CHAT_SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setQuestion(s); send(s); }}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full border transition-colors",
                    T.dark ? "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300" : "border-gray-200 text-slate-500 hover:border-gray-300 hover:text-slate-700"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          <div className={cn("rounded-2xl p-5 border", T.dark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200")}>
            <p className={cn("text-sm italic", T.textMuted)}>"{asked}"</p>
          </div>
          <div className={cn("rounded-2xl p-6 flex items-center gap-4", T.dark ? "bg-slate-800" : "bg-gray-50")}>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span key={i} className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <p className={cn("text-sm", T.textMuted)}>Analysing your business data...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="space-y-4">
          <div className={cn("rounded-2xl p-4 border", T.dark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-gray-200")}>
            <p className={cn("text-xs font-medium mb-0.5", T.textMuted)}>Your question</p>
            <p className={cn("text-sm", T.text)}>{asked}</p>
          </div>
          <div className={cn("rounded-2xl p-5 border text-sm", T.dark ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-600")}>
            {error}
          </div>
          <button
            onClick={reset}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-colors",
              T.dark ? "border-slate-700 text-slate-400 hover:bg-slate-800" : "border-gray-200 text-slate-500 hover:bg-gray-50"
            )}
          >
            <RotateCcw size={14} /> Try again
          </button>
        </div>
      )}

      {/* Answer */}
      {answer && !loading && (
        <div className="space-y-4">
          <div className={cn("rounded-2xl p-4 border", T.dark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-gray-200")}>
            <p className={cn("text-xs font-medium mb-0.5", T.textMuted)}>Your question</p>
            <p className={cn("text-sm", T.text)}>{asked}</p>
          </div>

          <AnswerCard T={T} answer={answer} />

          <button
            onClick={reset}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-colors",
              T.dark ? "border-slate-700 text-slate-400 hover:bg-slate-800" : "border-gray-200 text-slate-500 hover:bg-gray-50"
            )}
          >
            <RotateCcw size={14} /> Ask another question
          </button>
        </div>
      )}
    </div>
  );
}
