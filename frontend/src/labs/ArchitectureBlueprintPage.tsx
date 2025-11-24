// src/pages/labs/ArchitectureBlueprintPage.tsx
import React, { useState } from 'react';
import {
  ArchitectureBlueprintRequest,
  ArchitectureBlueprintResponse,
  runArchitectureBlueprint,
} from '../api/architectureBlueprint';

const defaultForm: ArchitectureBlueprintRequest = {
  product_type: 'saas',
  expected_users: '1k-10k',
  traffic_pattern: 'steady',
  data_size: '5-50GB',
  data_type: 'transactional',
  concurrency: '10-100',
  realtime: 'none',
  multi_tenancy: 'no',
  integrations: 'few',
  compliance: 'none',
  deployment: 'cloud',
  uptime: '99.5%',
  description: '',
  seo_needed: false,
};

const steps = ['Product', 'Data & Load', 'Features', 'Constraints'];

const ArchitectureBlueprintPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ArchitectureBlueprintRequest>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchitectureBlueprintResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof ArchitectureBlueprintRequest>(
    key: K,
    value: ArchitectureBlueprintRequest[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    setError(null);

    if (step < steps.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    // Last step → run engine
    setLoading(true);
    try {
      const res = await runArchitectureBlueprint(form);
      setResult(res);
    } catch (e) {
      console.error(e);
      setError('Something went wrong running the architecture blueprint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (loading) return;
    if (step === 0) return;
    setStep((s) => s - 1);
  };

  const handleReset = () => {
    setForm(defaultForm);
    setResult(null);
    setStep(0);
    setError(null);
  };

  const renderStep = () => {
    if (result) return null;

    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Product basics</h2>
              <p className="text-sm text-gray-600">
                A high-level sense of the product helps us choose a sensible architecture tier.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product type
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.product_type}
                  onChange={(e) => updateField('product_type', e.target.value)}
                >
                  <option value="saas">SaaS / B2B product</option>
                  <option value="ecommerce">E-commerce / storefront</option>
                  <option value="internal_tool">Internal tool / back-office</option>
                  <option value="marketplace">Marketplace / multi-sided</option>
                  <option value="mobile_app">Mobile-first app</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected active users (12–18 months)
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.expected_users}
                  onChange={(e) => updateField('expected_users', e.target.value)}
                >
                  <option value="<1k">&lt; 1,000 users</option>
                  <option value="1k-10k">1,000 – 10,000</option>
                  <option value="10k-100k">10,000 – 100,000</option>
                  <option value="100k-1M">100,000 – 1M</option>
                  <option value="1M+">&gt; 1M+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Traffic pattern
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.traffic_pattern}
                  onChange={(e) => updateField('traffic_pattern', e.target.value)}
                >
                  <option value="steady">Mostly steady</option>
                  <option value="seasonal">Seasonal peaks</option>
                  <option value="bursty">Bursty / event-driven</option>
                  <option value="unpredictable">Unpredictable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  One-line description (optional)
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g. B2B SaaS for workflow automation"
                  value={form.description ?? ''}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Data & load</h2>
              <p className="text-sm text-gray-600">
                Rough orders of magnitude are enough — this just guides sensible defaults.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data volume (12–18 months)
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.data_size}
                  onChange={(e) => updateField('data_size', e.target.value)}
                >
                  <option value="<5GB">&lt; 5 GB</option>
                  <option value="5-50GB">5 – 50 GB</option>
                  <option value="50-500GB">50 – 500 GB</option>
                  <option value="500GB-5TB">500 GB – 5 TB</option>
                  <option value="5TB+">&gt; 5 TB</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary data type
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.data_type}
                  onChange={(e) => updateField('data_type', e.target.value)}
                >
                  <option value="transactional">Transactional (orders, events)</option>
                  <option value="analytics-heavy">Analytics-heavy / reporting</option>
                  <option value="logs & telemetry">Logs & telemetry</option>
                  <option value="media files">Media (images, video, audio)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Typical concurrent users
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.concurrency}
                  onChange={(e) => updateField('concurrency', e.target.value)}
                >
                  <option value="<10">&lt; 10</option>
                  <option value="10-100">10 – 100</option>
                  <option value="100-500">100 – 500</option>
                  <option value="500-2000">500 – 2,000</option>
                  <option value="2000+">&gt; 2,000</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Features & usage patterns</h2>
              <p className="text-sm text-gray-600">
                Things like realtime behaviour and multi-tenancy change the shape of the architecture.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Realtime behaviour
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.realtime}
                  onChange={(e) => updateField('realtime', e.target.value)}
                >
                  <option value="none">No realtime needs</option>
                  <option value="basic_realtime">Basic realtime (notifications, small updates)</option>
                  <option value="heavy_realtime">Heavy realtime (trading, live dashboards)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Multi-tenancy
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.multi_tenancy}
                  onChange={(e) => updateField('multi_tenancy', e.target.value)}
                >
                  <option value="no">Single-tenant</option>
                  <option value="soft_multi_tenant">Soft multi-tenant (logical separation)</option>
                  <option value="hard_multi_tenant">Hard multi-tenant (per-tenant DB/infra)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Integrations
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.integrations}
                  onChange={(e) => updateField('integrations', e.target.value)}
                >
                  <option value="few">Few / simple integrations</option>
                  <option value="many">Many / moderate complexity</option>
                  <option value="mission_critical">Mission-critical integrations</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Constraints & expectations</h2>
              <p className="text-sm text-gray-600">
                Compliance, deployment and uptime often decide whether you&apos;re Tier B, C or D.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compliance
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.compliance}
                  onChange={(e) => updateField('compliance', e.target.value)}
                >
                  <option value="none">None / general</option>
                  <option value="gdpr">GDPR / data residency</option>
                  <option value="hipaa">HIPAA / health</option>
                  <option value="soc2">SOC 2</option>
                  <option value="fintech">Fintech / financial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deployment model
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.deployment}
                  onChange={(e) => updateField('deployment', e.target.value)}
                >
                  <option value="cloud">Cloud (AWS / Azure / GCP)</option>
                  <option value="on_prem">On-prem</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target uptime (prod)
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.uptime}
                  onChange={(e) => updateField('uptime', e.target.value)}
                >
                  <option value="99%">~99%</option>
                  <option value="99.5%">~99.5%</option>
                  <option value="99.9%">~99.9%</option>
                  <option value="99.99%">~99.99%</option>
                </select>
              </div>

              <div className="md:col-span-3 flex items-center gap-2 mt-2">
                <input
                  id="seo_needed"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={form.seo_needed ?? false}
                  onChange={(e) => updateField('seo_needed', e.target.checked)}
                />
                <label htmlFor="seo_needed" className="text-sm text-gray-700">
                  SEO / content-heavy product (marketing site, content, landing pages)
                </label>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderScores = (scores: ArchitectureBlueprintResponse['scores']) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
      {(['load', 'data', 'features', 'risk'] as const).map((key) => (
        <div
          key={key}
          className="rounded-xl border border-gray-200 bg-white px-3 py-3"
        >
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {key === 'load'
              ? 'Load'
              : key === 'data'
              ? 'Data'
              : key === 'features'
              ? 'Features'
              : 'Risk'}
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-semibold text-gray-900">
              {scores[key]}
            </span>
            <span className="text-xs text-gray-500">/100</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderResult = () => {
    if (!result) return null;

    const { overview, scores, backend_stack, frontend_stack, infra, risks, roadmap, cost_band } =
      result;

    return (
      <div className="space-y-8">
        {/* Tier overview */}
        <section className="rounded-2xl border border-gray-200 bg-white px-4 py-4 md:px-6 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1">
                <span className="text-xs font-semibold text-blue-700">
                  Architecture Tier {overview.tier}
                </span>
                <span className="text-[11px] text-blue-600">{overview.label}</span>
              </div>
              <h1 className="mt-3 text-xl md:text-2xl font-semibold text-gray-900">
                {overview.description}
              </h1>
            </div>
            <div className="shrink-0 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-right">
              <div className="text-xs text-gray-500">Overall architecture score</div>
              <div className="text-2xl font-semibold text-gray-900">
                {overview.overall_score}
                <span className="text-sm text-gray-500"> / 100</span>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Higher scores imply more complex / demanding systems.
              </div>
            </div>
          </div>

          {renderScores(scores)}
        </section>

        {/* Stack recommendation */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 md:px-5 md:py-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Backend & platform
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
              {backend_stack.map((item, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 md:px-5 md:py-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Frontend & client experience
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
              {frontend_stack.map((item, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Infra & cost band */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white px-4 py-4 md:px-5 md:py-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Infrastructure pattern
            </h2>
            <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase">
                  Compute & deployment
                </div>
                <div className="mt-1">{infra.compute}</div>
                {infra.deployment_model && (
                  <div className="mt-1 text-xs text-gray-600">
                    {infra.deployment_model}
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase">
                  Data & runtime
                </div>
                <div className="mt-1">{infra.database}</div>
                {infra.caching && (
                  <div className="mt-1">{infra.caching}</div>
                )}
                {infra.queueing && (
                  <div className="mt-1">{infra.queueing}</div>
                )}
                {infra.observability && (
                  <div className="mt-1 text-xs text-gray-600">
                    {infra.observability}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 md:px-5 md:py-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Infra cost band
            </h2>
            <p className="text-xl font-semibold text-gray-900">{result.cost_band}</p>
            <p className="mt-2 text-xs text-gray-600">
              This is a directional estimate for infrastructure only (compute, storage,
              networking). Engineering time and third-party SaaS tools are not included.
            </p>
          </div>
        </section>

        {/* Risks & roadmap */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 md:px-5 md:py-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Key risks & considerations
            </h2>
            {risks.length === 0 ? (
              <p className="text-sm text-gray-600">
                No major red flags detected from the inputs you provided. Most complexity
                will come from real-world usage and organisational constraints.
              </p>
            ) : (
              <ul className="mt-2 space-y-3 text-sm text-gray-700">
                {risks.map((r, idx) => (
                  <li key={idx}>
                    <div className="text-xs font-semibold text-blue-600 uppercase">
                      {r.area}
                    </div>
                    <div className="font-medium text-gray-900">{r.title}</div>
                    <div className="text-sm text-gray-700 mt-0.5">{r.detail}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 md:px-5 md:py-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Suggested roadmap
            </h2>
            <ol className="mt-2 list-decimal list-inside space-y-1.5 text-sm text-gray-700">
              {roadmap.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Run again with different assumptions
          </button>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Share this blueprint with Ameotech
          </a>
        </section>
      </div>
    );
  };

  const isLastStep = step === steps.length - 1;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          Ameotech Labs
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-gray-900">
          Architecture Blueprint Tool
        </h1>
        <p className="mt-2 text-sm text-gray-600 md:text-base">
          A short, structured assessment that turns your product assumptions into a concrete
          architecture tier, stack and infrastructure plan — without asking for an email.
        </p>
      </header>

      {!result && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {steps.map((label, idx) => (
              <div key={label} className="flex items-center">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    idx === step
                      ? 'bg-blue-600 text-white'
                      : idx < step
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`ml-2 text-xs md:text-sm ${
                    idx === step
                      ? 'font-semibold text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  {label}
                </span>
                {idx < steps.length - 1 && (
                  <div className="mx-3 h-px w-6 bg-gray-200 md:w-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 md:px-6 md:py-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {!result ? renderStep() : renderResult()}

        {!result && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0 || loading}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Running...' : isLastStep ? 'Generate blueprint' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchitectureBlueprintPage;
