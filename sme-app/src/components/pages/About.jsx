import React from "react";
import { Check, Github, Mail } from "lucide-react";
import { cn } from "../../utils/helpers";

const FEATURES = [
  "Business health scoring",
  "What-if decision simulation",
  "AI-powered advisor chat",
  "Scenario comparison",
  "Exportable reports",
];

export default function About({ T }) {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
      <h1 className={cn("text-3xl font-semibold tracking-tight mb-3", T.text)}>
        About SME Decision Simulator
      </h1>

      <p className={cn("text-base leading-relaxed mb-10", T.textMuted)}>
        A tool that lets small and medium business owners rehearse financial
        decisions safely, before real money is on the line.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className={cn("rounded-2xl p-6", T.card)}>
          <h2 className={cn("text-sm font-semibold mb-2", T.text)}>
            Mission
          </h2>
          <p className={cn("text-sm leading-relaxed", T.textMuted)}>
            Give every SME owner the same decision confidence that a finance
            team gives a large enterprise.
          </p>
        </div>

        <div className={cn("rounded-2xl p-6", T.card)}>
          <h2 className={cn("text-sm font-semibold mb-2", T.text)}>
            The Problem
          </h2>
          <p className={cn("text-sm leading-relaxed", T.textMuted)}>
            Most SMEs make big calls — hiring, loans, expansion — on gut feel,
            with no way to see the downside first.
          </p>
        </div>

        <div className={cn("rounded-2xl p-6", T.card)}>
          <h2 className={cn("text-sm font-semibold mb-2", T.text)}>
            How AI Helps
          </h2>
          <p className={cn("text-sm leading-relaxed", T.textMuted)}>
            It reads your data, models outcomes across dozens of variables, and
            explains the result in plain language.
          </p>
        </div>

        <div className={cn("rounded-2xl p-6", T.card)}>
          <h2 className={cn("text-sm font-semibold mb-2", T.text)}>
            Features
          </h2>

          <ul className="space-y-1.5">
            {FEATURES.map((feature, index) => (
              <li
                key={index}
                className={cn(
                  "text-sm flex items-center gap-2",
                  T.textMuted
                )}
              >
                <Check size={13} className={T.accentEmerald} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center justify-between rounded-2xl p-5 border-t",
          T.border
        )}
      >
        <span className={cn("text-xs", T.textFaint)}>
          © 2026 SME Decision Simulator
        </span>

        <div className="flex items-center gap-3">
          <Github size={16} className={T.textMuted} />
          <Mail size={16} className={T.textMuted} />
        </div>
      </div>
    </div>
  );
}