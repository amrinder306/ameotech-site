const API_BASE =
  import.meta.env.VITE_API_BASE ??
  (import.meta.env.DEV ? 'http://localhost:8000' : '');

import React, { useState } from 'react';

type Step = 0 | 1 | 2 | 3 | 4;

type FormState = {
  product_stage: string;
  release_freq: string;
  tech_stack: string;
  ci_cd: boolean;
  testing: string;
  data_centralized: boolean;
  analytics: string;
  pain_points: string[];
};

type Scores = {
  product: number;
  engineering: number;
  data_ai: number;
};

type Recommendation = {
  area: string;
  title: string;
  detail: string;
};

type AuditResult = {
  scores: Scores;
  recommendations: Recommendation[];
};

type NextAction = {
  label: string;
  type: string;
  target?: string;
  payload: Record<string, any>;
};

const initialForm: FormState = {
  product_stage: '',
  release_freq: '',
  tech_stack: '',
  ci_cd: false,
  testing: '',
  data_centralized: false,
  analytics: '',
  pain_points: [],
};

const humanize = (value: string): string =>
  String(value ?? '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const AuditWizard: React.FC = () => {
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [nextAction, setNextAction] = useState<NextAction | null>(null);

  const next = () => setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  const back = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));

  const togglePainPoint = (val: string) => {
    setForm((prev) => {
      const exists = prev.pain_points.includes(val);
      return {
        ...prev,
        pain_points: exists
          ? prev.pain_points.filter((p) => p !== val)
          : [...prev.pain_points, val],
      };
    });
  };

  const runAudit = async () => {
    setLoading(true);
    setError(null);
    setNextAction(null);
    try {
      const resp = await fetch(`${API_BASE}/labs/audit/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!resp.ok) {
        throw new Error('Failed to run audit');
      }

      const data = (await resp.json()) as AuditResult;
      setResult(data);
      setStep(4);

      // ask reasoning engine for “what next”
      try {
        const reasonResp = await fetch(`${API_BASE}/reason/lab-next`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: null,
            lab_tool: 'audit',
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
              type: a.type ?? 'open_lab_tool',
              target: a.target,
              payload: a.payload ?? {},
            });
          }
        }
      } catch (e) {
        console.warn('Failed to fetch next-step suggestion for audit result', e);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESULT VIEW – CARD STYLE, NOT FULL DARK BLOCK
  if (step === 4 && result) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-lg p-6 md:p-8 space-y-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Your diagnostic
        </p>

        {nextAction && (
          <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-500 mb-1">
              Suggested next step
            </p>
            <p className="text-sm font-semibold text-emerald-100 mb-1">
              {nextAction.label}
            </p>
            {nextAction.payload && nextAction.payload.description && (
              <p className="text-xs text-emerald-200 mb-2">
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
                        source: 'labs_audit',
                      },
                    }),
                  }).catch(() => {});
                } catch (e) {
                  console.warn(
                    'Failed to send feedback for audit next action',
                    e,
                  );
                }

                if (nextAction.type === 'open_lab_tool') {
                  const lab =
                    (nextAction.payload &&
                      (nextAction.payload.lab_tool ||
                        nextAction.payload.lab)) ||
                    nextAction.target ||
                    'build_estimator';
                  if (lab === 'build_estimator') {
                    window.location.href = '/labs/build-estimator';
                  } else if (lab === 'audit') {
                    window.location.href = '/labs/audit';
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
              className="inline-flex items-center rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
            >
              {nextAction.payload?.ctaLabel ?? 'Continue'}
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
              Product
            </p>
            <p className="text-2xl font-semibold">
              {result.scores.product}/100
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
              Engineering
            </p>
            <p className="text-2xl font-semibold">
              {result.scores.engineering}/100
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
              Data &amp; AI
            </p>
            <p className="text-2xl font-semibold">
              {result.scores.data_ai}/100
            </p>
          </div>
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
          Run again
        </button>
      </div>
    );
  }

  // ✅ WIZARD VIEW – CARD, NOT GREY OVERLAY
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
            Where is your product today?
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
                Product stage
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['idea', 'Idea / pre-MVP'],
                  ['mvp', 'MVP in market'],
                  ['early_revenue', 'Early revenue'],
                  ['growth', 'Growing / scaling'],
                  ['scaleup', 'Scale-up / enterprise'],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() =>
                      setForm((f) => ({ ...f, product_stage: val }))
                    }
                    className={`rounded-lg border px-3 py-2 text-left ${
                      form.product_stage === val
                        ? 'border-blue-500 bg-blue-600/10'
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
                Release cadence
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['ad_hoc', 'Ad-hoc'],
                  ['monthly', 'Monthly'],
                  ['biweekly', 'Bi-weekly'],
                  ['weekly', 'Weekly'],
                  ['daily', 'Daily / on-demand'],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() =>
                      setForm((f) => ({ ...f, release_freq: val }))
                    }
                    className={`rounded-lg border px-3 py-2 text-left ${
                      form.release_freq === val
                        ? 'border-blue-500 bg-blue-600/10'
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

      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Engineering foundations
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  CI/CD pipeline in place?
                </p>
                <p className="text-xs text-slate-500">
                  E.g. GitHub Actions, GitLab CI, Azure DevOps, etc.
                </p>
              </div>
              <button
                onClick={() =>
                  setForm((f) => ({ ...f, ci_cd: !f.ci_cd }))
                }
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${
                  form.ci_cd
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-slate-400 dark:border-slate-600'
                }`}
              >
                {form.ci_cd ? 'Yes' : 'No'}
              </button>
            </div>

            <div>
              <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
                Automated testing maturity
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['none', 'No tests'],
                  ['low', 'Some smoke tests'],
                  ['medium', 'Good coverage on core flows'],
                  ['high', 'Strong coverage & pipelines'],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() =>
                      setForm((f) => ({ ...f, testing: val }))
                    }
                    className={`rounded-lg border px-3 py-2 text-left ${
                      form.testing === val
                        ? 'border-blue-500 bg-blue-600/10'
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

      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Data &amp; analytics baseline
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Data is centralised?
                </p>
                <p className="text-xs text-slate-500">
                  Warehouse / lake or at least one &quot;source of truth&quot;.
                </p>
              </div>
              <button
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    data_centralized: !f.data_centralized,
                  }))
                }
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${
                  form.data_centralized
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-slate-400 dark:border-slate-600'
                }`}
              >
                {form.data_centralized ? 'Yes' : 'No'}
              </button>
            </div>

            <div>
              <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
                Analytics maturity
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['none', 'Mostly gut feel'],
                  ['basic', 'Some dashboards'],
                  ['intermediate', 'Self-serve BI'],
                  ['advanced', 'Rich analytics & experimentation'],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() =>
                      setForm((f) => ({ ...f, analytics: val }))
                    }
                    className={`rounded-lg border px-3 py-2 text-left ${
                      form.analytics === val
                        ? 'border-blue-500 bg-blue-600/10'
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
            Where does it hurt the most?
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">
            This helps shape the recommendations. Pick all that apply.
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              'slow_releases',
              'no_visibility',
              'data_scattered',
              'manual_processes',
              'high_incident_load',
              'low_confidence_in_metrics',
            ].map((val) => (
              <button
                key={val}
                onClick={() => togglePainPoint(val)}
                className={`rounded-lg border px-3 py-2 text-left ${
                  form.pain_points.includes(val)
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-500'
                }`}
              >
                {humanize(val)}
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
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Next
          </button>
        )}

        {step === 3 && (
          <button
            onClick={runAudit}
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? 'Running…' : 'Run audit'}
          </button>
        )}
      </div>
    </div>
  );
};
