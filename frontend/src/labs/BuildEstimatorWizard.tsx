const API_BASE =
  import.meta.env.VITE_API_BASE ??
  (import.meta.env.DEV ? 'http://localhost:8000' : '');

import React, { useState } from 'react';

type Step = 0 | 1 | 2 | 3 | 4;

type FormState = {
  project_types: string[];
  urgency: string;
  company_stage: string;
  team: string;
  budget: string;
};

type Scores = {
  complexity: number;
  urgency: number;
  team: number;
  budget: number;
};

type EstimatorResult = {
  model: string;
  budget: string;
  timeline: string;
  scores: Scores;
  plan: string[];
  recommendations: { area: string; title: string; detail: string }[];
};

type NextAction = {
  label: string;
  type: string;
  target?: string;
  payload: Record<string, any>;
};

const initialForm: FormState = {
  project_types: [],
  urgency: '',
  company_stage: '',
  team: '',
  budget: '',
};

export const BuildEstimatorWizard: React.FC = () => {
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimatorResult | null>(null);
  const [nextAction, setNextAction] = useState<NextAction | null>(null);

  const next = () => setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  const back = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));

  const toggleProjectType = (val: string) => {
    setForm((prev) => {
      const exists = prev.project_types.includes(val);
      return {
        ...prev,
        project_types: exists
          ? prev.project_types.filter((p) => p !== val)
          : [...prev.project_types, val],
      };
    });
  };

  const runEstimator = async () => {
    setLoading(true);
    setError(null);
    setNextAction(null);
    try {
      const resp = await fetch(`${API_BASE}/labs/build-estimator/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!resp.ok) throw new Error('Failed to run estimator');

      const data = (await resp.json()) as EstimatorResult;
      setResult(data);
      setStep(4);

      try {
        const reasonResp = await fetch(`${API_BASE}/reason/lab-next`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: null,
            lab_tool: 'build_estimator',
            lab_result: data,
            context: {},
          }),
        });
        if (reasonResp.ok) {
          const reasonData = await reasonResp.json();
          const actions = (reasonData && reasonData.next_actions) || [];
          if (Array.isArray(actions) && actions.length > 0) {
            const a = actions[0];
            setNextAction({
              label: a.label ?? 'Next step',
              type: a.type ?? 'escalate_human',
              target: a.target,
              payload: a.payload ?? {},
            });
          }
        }
      } catch (e) {
        console.warn('Failed to fetch next-step suggestion for estimator result', e);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESULT VIEW – clean card, same feel as Architecture Blueprint
  if (step === 4 && result) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-lg p-6 md:p-8 space-y-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Suggested engagement model
        </p>

        {nextAction && (
          <div className="mb-4 rounded-xl border border-blue-500/40 bg-blue-500/10 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-blue-400 mb-1">
              Suggested next step
            </p>
            <p className="text-sm font-semibold text-blue-50 mb-1">
              {nextAction.label}
            </p>
            {nextAction.payload && nextAction.payload.description && (
              <p className="text-xs text-blue-100 mb-2">
                {nextAction.payload.description}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                try {
                  fetch(`${API_BASE}/reason/feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      session_id: null,
                      event: 'lab_next_action_clicked',
                      action: nextAction.type,
                      payload: {
                        ...nextAction.payload,
                        source: 'labs_build_estimator',
                      },
                    }),
                  }).catch(() => {});
                } catch (e) {
                  console.warn(
                    'Failed to send feedback for estimator next action',
                    e,
                  );
                }

                if (nextAction.type === 'open_lab_tool') {
                  const lab =
                    (nextAction.payload &&
                      (nextAction.payload.lab_tool ||
                        nextAction.payload.lab)) ||
                    nextAction.target ||
                    'audit';
                  if (lab === 'audit') {
                    window.location.href = '/labs/audit';
                  } else if (lab === 'build_estimator') {
                    window.location.href = '/labs/build-estimator';
                  } else {
                    window.location.href = '/labs';
                  }
                } else if (nextAction.type === 'escalate_human') {
                  const href =
                    (nextAction.payload && nextAction.payload.link) ||
                    'mailto:hello@ameotech.com';
                  window.location.href = href;
                }
              }}
              className="inline-flex items-center rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-blue-400"
            >
              {nextAction.payload?.ctaLabel ?? 'Continue'}
            </button>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-2">{result.model}</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
              Budget band
            </p>
            <p className="font-medium text-slate-800 dark:text-slate-100">
              {result.budget}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
              Initial timeline
            </p>
            <p className="font-medium text-slate-800 dark:text-slate-100">
              {result.timeline}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
              Signals
            </p>
            <p className="font-medium text-slate-800 dark:text-slate-100">
              Complexity {result.scores.complexity}/100 · Urgency{' '}
              {result.scores.urgency}/100
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
            Suggested 8–12 week shape
          </p>
          <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-200 space-y-1">
            {result.plan.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {result.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
                {rec.area}
              </p>
              <p className="font-semibold mb-1">{rec.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {rec.detail}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setForm(initialForm);
            setResult(null);
            setStep(0);
          }}
          className="mt-6 inline-flex items-center rounded-lg border border-slate-400 px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          Start again
        </button>
      </div>
    );
  }

  // ✅ WIZARD VIEW – card, not grey overlay
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-lg p-6 md:p-8">
      {error && (
        <div className="mb-4 rounded border border-red-500 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
        Step {step + 1} of 4
      </p>

      {step === 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            What are you trying to do?
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">
            Pick the work that best describes what you want Ameotech to help
            with. You can select more than one.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {[
              'Build a new product',
              'Add AI to existing system',
              'Modernize legacy platform',
              'Data engineering / warehouse',
              'Pricing / Forecasting / Optimization',
              'Workflow automation',
              'Something else',
            ].map((label) => (
              <button
                key={label}
                onClick={() => toggleProjectType(label)}
                className={`rounded-lg border px-3 py-2 text-left ${
                  form.project_types.includes(label)
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            How quickly do you need impact?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            {[
              ['4-6', 'Live in 4–6 weeks'],
              ['8-12', 'Live in 8–12 weeks'],
              ['future', 'Exploring / flexible'],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setForm((f) => ({ ...f, urgency: val }))}
                className={`rounded-lg border px-3 py-2 text-left ${
                  form.urgency === val
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Where is your organisation today?
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
                Company stage
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['startup', 'Early-stage startup'],
                  ['growth', 'Growth-stage SaaS / Retail / FinTech'],
                  ['mid', 'Mid-market enterprise'],
                  ['enterprise', 'Large enterprise'],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() =>
                      setForm((f) => ({ ...f, company_stage: val }))
                    }
                    className={`rounded-lg border px-3 py-2 text-left ${
                      form.company_stage === val
                        ? 'border-emerald-400 bg-emerald-500/10'
                        : 'border-slate-300 dark:border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
                Internal team today
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['none', 'No technical team'],
                  ['small', 'Small team, need AI/architecture'],
                  ['strong', 'Strong team, need specialist pod'],
                  ['mature', 'Mature team, advisory only'],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setForm((f) => ({ ...f, team: val }))}
                    className={`rounded-lg border px-3 py-2 text-left ${
                      form.team === val
                        ? 'border-emerald-400 bg-emerald-500/10'
                        : 'border-slate-300 dark:border-slate-700 hover:border-slate-500'
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

      {step === 3 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Budget comfort
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">
            We&apos;re not asking for a committed budget &mdash; just where you&apos;re most
            comfortable today.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            {[
              ['exploring', 'Exploring / not sure'],
              ['5-10', '$5K–$10K'],
              ['10-20', '$10K–$20K'],
              ['20-40', '$20K–$40K'],
              ['40+', '$40K+'],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setForm((f) => ({ ...f, budget: val }))}
                className={`rounded-lg border px-3 py-2 text-left ${
                  form.budget === val
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={back}
          disabled={step === 0}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-40"
        >
          Back
        </button>
        {step < 3 && (
          <button
            onClick={next}
            className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400"
          >
            Next
          </button>
        )}
        {step === 3 && (
          <button
            onClick={runEstimator}
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? 'Calculating…' : 'Get my plan'}
          </button>
        )}
      </div>
    </div>
  );
};
