const API_BASE =
  import.meta.env.VITE_API_BASE ??
  (import.meta.env.DEV ? "http://localhost:8000" : "");

import React, { useState } from "react";

type Step = 0 | 1 | 2 | 3 | 4 | 5;

type FormState = {
  data_maturity: string[];
  workflow_maturity: string[];
  ai_opportunities: string[];
  org_stage: string;
  team_strength: string;
  budget: string;
  urgency: string;
};

type Scores = {
  data: number;
  workflows: number;
  opportunities: number;
  org: number;
  constraints: number;
  score: number;
};

type AiResult = {
  scores: Scores;
  quick_wins: string[];
  recommendations: { area: string; detail: string }[];
  next_step: string;
  next_actions: any[];
};

const initialForm: FormState = {
  data_maturity: [],
  workflow_maturity: [],
  ai_opportunities: [],
  org_stage: "",
  team_strength: "",
  budget: "",
  urgency: "",
};

export const AiReadinessWizard: React.FC = () => {
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiResult | null>(null);

  const next = () => setStep((s) => (s < 5 ? ((s + 1) as Step) : s));
  const back = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));

  const toggle = (k: keyof FormState, val: string) => {
    setForm((prev) => {
      const arr = prev[k] as string[];
      const exists = arr.includes(val);
      return {
        ...prev,
        [k]: exists ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });
  };

  const runScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/labs/ai-readiness/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!resp.ok) throw new Error("Failed to run scan");
      const data = (await resp.json()) as AiResult;
      setResult(data);
      setStep(5);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---- RESULT STEP ----
  if (step === 5 && result) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-lg p-6 md:p-8 space-y-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          AI Readiness Summary
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(result.scores).map(([k, v]) => (
            <div key={k}>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
                {k}
              </p>
              <p className="text-2xl font-semibold">{v}/100</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
            Quick Wins
          </p>
          <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {result.quick_wins.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
            Recommendations
          </p>
          <ul className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <li
                key={i}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4"
              >
                <p className="text-sm font-semibold mb-1">{rec.area}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {rec.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* NEXT ACTION */}
        {result.next_actions && result.next_actions.length > 0 && (
          <div className="pt-4">
            {result.next_actions.map((a, i) => (
              <button
                key={i}
                onClick={() => {
                  if (a.type === "open_lab_tool") {
                    window.location.href = `/labs/${a.payload.lab_tool}`;
                  }
                  if (a.type === "escalate_human") {
                    window.location.href =
                      a.payload.link || "mailto:hello@ameotech.com";
                  }
                }}
                className="inline-flex items-center rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-500 mr-3"
              >
                {a.label}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            setStep(0);
            setResult(null);
            setForm(initialForm);
          }}
          className="mt-6 inline-flex items-center rounded-lg border border-slate-400 px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          Run again
        </button>
      </div>
    );
  }

  // ---- MAIN WIZARD ----
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-lg p-6 md:p-8">
      {error && (
        <div className="mb-4 rounded border border-red-500 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Step {step + 1} of 5
      </p>

      {/* STEP 1 — DATA */}
      {step === 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Data foundations</h2>
          <p className="text-sm text-slate-700 dark:text-slate-200 mb-4">
            Select all that apply.
          </p>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            {[
              "Centralized warehouse",
              "Data is scattered",
              "Historical data available",
              "Mostly unstructured data",
              "ETL pipelines in place",
              "Manual data cleaning required",
            ].map((v) => (
              <button
                key={v}
                onClick={() => toggle("data_maturity", v)}
                className={`rounded-lg border px-3 py-2 text-left ${
                  form.data_maturity.includes(v)
                    ? "border-blue-500 bg-blue-600/10"
                    : "border-slate-300 dark:border-slate-700 hover:border-slate-500"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2 — WORKFLOWS */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Workflow maturity</h2>
          <p className="text-sm text-slate-700 dark:text-slate-200 mb-4">
            Select all that apply.
          </p>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            {[
              "Mostly manual",
              "Repeatable process",
              "API-ready",
              "Event-driven",
              "Excel/Email driven",
              "Legacy systems in place",
            ].map((v) => (
              <button
                key={v}
                onClick={() => toggle("workflow_maturity", v)}
                className={`rounded-lg border px-3 py-2 text-left ${
                  form.workflow_maturity.includes(v)
                    ? "border-blue-500 bg-blue-600/10"
                    : "border-slate-300 dark:border-slate-700 hover:border-slate-500"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 — AI OPPORTUNITIES */}
      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">AI opportunity areas</h2>
          <p className="text-sm text-slate-700 dark:text-slate-200 mb-4">
            Pick where AI could help your business.
          </p>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            {[
              "Pricing / forecasting",
              "Demand modeling",
              "Customer intelligence",
              "Workflow automation",
              "Anomaly detection",
              "Decision support",
            ].map((v) => (
              <button
                key={v}
                onClick={() => toggle("ai_opportunities", v)}
                className={`rounded-lg border px-3 py-2 text-left ${
                  form.ai_opportunities.includes(v)
                    ? "border-blue-500 bg-blue-600/10"
                    : "border-slate-300 dark:border-slate-700 hover:border-slate-500"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4 — ORG READINESS */}
      {step === 3 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Organizational readiness</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
                Company stage
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ["startup", "Startup"],
                  ["growth", "Growth"],
                  ["mid", "Mid-market"],
                  ["enterprise", "Enterprise"],
                ].map(([v, label]) => (
                  <button
                    key={v}
                    onClick={() => setForm((f) => ({ ...f, org_stage: v }))}
                    className={`rounded-lg border px-3 py-2 text-left ${
                      form.org_stage === v
                        ? "border-emerald-400 bg-emerald-500/10"
                        : "border-slate-300 dark:border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
                Technical team strength
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ["none", "No technical team"],
                  ["small", "Small team"],
                  ["strong", "Strong team"],
                  ["mature", "Mature engineering org"],
                ].map(([v, label]) => (
                  <button
                    key={v}
                    onClick={() => setForm((f) => ({ ...f, team_strength: v }))}
                    className={`rounded-lg border px-3 py-2 text-left ${
                      form.team_strength === v
                        ? "border-emerald-400 bg-emerald-500/10"
                        : "border-slate-300 dark:border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5 — CONSTRAINTS */}
      {step === 4 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Constraints</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
                Budget comfort
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ["low", "Exploring / low"],
                  ["moderate", "Moderate"],
                  ["good", "Good range ($20–40k)"],
                  ["strong", "Strong budget"],
                ].map(([v, label]) => (
                  <button
                    key={v}
                    onClick={() => setForm((f) => ({ ...f, budget: v }))}
                    className={`rounded-lg border px-3 py-2 text-left ${
                      form.budget === v
                        ? "border-emerald-400 bg-emerald-500/10"
                        : "border-slate-300 dark:border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
                Urgency
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ["fast", "4–6 weeks"],
                  ["medium", "8–12 weeks"],
                  ["slow", "Flexible"],
                ].map(([v, label]) => (
                  <button
                    key={v}
                    onClick={() => setForm((f) => ({ ...f, urgency: v }))}
                    className={`rounded-lg border px-3 py-2 text-left ${
                      form.urgency === v
                        ? "border-emerald-400 bg-emerald-500/10"
                        : "border-slate-300 dark:border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={back}
          disabled={step === 0}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-40"
        >
          Back
        </button>

        {step < 4 && (
          <button
            onClick={next}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Next
          </button>
        )}

        {step === 4 && (
          <button
            onClick={runScan}
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Scanning…" : "Run readiness scan"}
          </button>
        )}
      </div>
    </div>
  );
};
