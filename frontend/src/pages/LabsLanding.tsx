
import React from 'react';
import { Container } from '../components/ui/Container';

export const LabsLanding: React.FC = () => {
  return (
    <section className="py-20 bg-slate-950 text-slate-50 min-h-[70vh]">
      <Container className="max-w-5xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-3">Ameotech Labs</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Applied AI, demonstrated &mdash; not promised.
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Labs is where we open up parts of our delivery playbook. No-fluff tools that reflect how we
            think about product, engineering and AI in real engagements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <a
            href="/labs/audit"
            className="block rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 hover:border-blue-500 transition"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-blue-400 mb-2">Tool 01</p>
            <h2 className="text-xl font-semibold mb-2">Product &amp; Engineering Maturity Audit</h2>
            <p className="text-sm text-slate-300 mb-4">
              8–10 questions to benchmark your product, engineering and data/AI readiness.
              Fast diagnostic. No email required to see your score.
            </p>
            <p className="text-xs text-slate-400">Runs on a local rules engine. No LLM tokens.</p>
          </a>

          <a
            href="/labs/build-estimator"
            className="block rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 hover:border-blue-500 transition"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2">Tool 02</p>
            <h2 className="text-xl font-semibold mb-2">Build Cost &amp; Delivery Model Estimator</h2>
            <p className="text-sm text-slate-300 mb-4">
              Answer a few questions about scope, urgency and budget. Get a recommended engagement
              model, rough budget band and 8–12 week delivery outline.
            </p>
            <p className="text-xs text-slate-400">Deterministic, explainable logic. No black boxes.</p>
          </a>
          <a
            href="/labs/blue-print"
            className="block rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 hover:border-blue-500 transition"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2">Tool 03</p>
            <h2 className="text-xl font-semibold mb-2">Build Cost &amp; Delivery Model Estimator</h2>
            <p className="text-sm text-slate-300 mb-4">
              Answer a few questions about scope, urgency and budget. Get a recommended engagement
              model, rough budget band and 8–12 week delivery outline.
            </p>
            <p className="text-xs text-slate-400">Deterministic, explainable logic. No black boxes.</p>
          </a>
        </div>
      </Container>
    </section>
  );
};
