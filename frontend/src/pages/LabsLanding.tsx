// src/pages/LabsLanding.tsx
import React from 'react';
import { Container } from '../components/ui/Container';

export const LabsLanding: React.FC = () => {
  return (
    <section className="py-20">
      <Container className="max-w-5xl">
        {/* Intro */}
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">
            Ameotech Labs
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Tools from the way we actually work.
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
            Labs is where we expose parts of our internal playbook: diagnostics, estimators and
            blueprints that we normally run with clients before and during real projects.
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">
            All tools are in invite-only beta. You can jump straight into a tool, or reach out and
            we&apos;ll walk you through it live.
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Tool 01 */}
          <a
            href="/labs/product-audit"
            className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 p-6 hover:border-emerald-400 hover:bg-white dark:hover:bg-slate-900 transition-colors flex flex-col justify-between shadow-sm"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 mb-2">Tool 01</p>
              <h2 className="text-xl font-semibold mb-2">
                Product &amp; Engineering Maturity Audit
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                A structured diagnostic across product, engineering and data/AI readiness — the same
                lens we use before committing to serious work.
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-emerald-400">
              Open the audit &mdash; runs as an interactive flow.
            </p>
          </a>

          {/* Tool 02 */}
          <a
            href="/labs/build-estimator"
            className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 p-6 hover:border-emerald-400 hover:bg-white dark:hover:bg-slate-900 transition-colors flex flex-col justify-between shadow-sm"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 mb-2">Tool 02</p>
              <h2 className="text-xl font-semibold mb-2">
                Build Cost &amp; Delivery Model Estimator
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Feed scope, urgency and constraints. Get a pragmatic engagement model, a realistic
                budget band and a first 8–12 week outline.
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-emerald-400">
              Open the estimator &mdash; deterministic, transparent logic.
            </p>
          </a>

          {/* Tool 03 */}
          <a
            href="/labs/architecture-blueprint"
            className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 p-6 hover:border-emerald-400 hover:bg-white dark:hover:bg-slate-900 transition-colors flex flex-col justify-between shadow-sm"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 mb-2">Tool 03</p>
              <h2 className="text-xl font-semibold mb-2">Architecture &amp; Risk Blueprint</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Map your current system, surface risk hot-spots and design a stepwise modernization
                plan instead of a risky big bang rewrite.
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-emerald-400">
              Open the blueprint tool &mdash; best used with your tech and business leads together.
            </p>
          </a>

          {/* Tool 04 */}
          <a
            href="/labs/ai-readiness"
            className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 p-6 hover:border-emerald-400 hover:bg-white dark:hover:bg-slate-900 transition-colors flex flex-col justify-between shadow-sm"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 mb-2">
                Tool 04
              </p>
              <h2 className="text-xl font-semibold mb-2">AI Readiness Scan</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Understand whether your data, workflows, team and constraints are ready for AI —
                and whether you should start with a PoC, modernization or a full platform.
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-emerald-400">
              Open the readiness scan — 5 steps, no email required.
            </p>
          </a>

        </div>

        {/* Footer note */}
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-6 text-sm text-slate-500 dark:text-slate-400">
          Prefer to skip the tools and just talk? Drop a line via the contact section and we&apos;ll
          jump straight into your context.
        </div>
      </Container>
    </section>
  );
};
