// src/pages/CareersPage.tsx
import React from 'react';
import { Container } from '../components/ui/Container';

type Job = {
  id: string;
  title: string;
  location: string;
  type: string;
  summary: string;
};

const JOBS: Job[] = [
  {
    id: 'senior-fullstack',
    title: 'Senior Full-Stack Engineer (React / .NET)',
    location: 'Mohali · Hybrid / Remote (India)',
    type: 'Full-time',
    summary:
      'Own complex client builds end-to-end — from architecture and APIs to polished frontends. Strong on fundamentals, comfortable in ambiguity.',
  },
  {
    id: 'ai-engineer',
    title: 'Applied AI Engineer',
    location: 'Remote (India)',
    type: 'Full-time',
    summary:
      'Build real-world AI systems: retrieval pipelines, pricing engines, forecasting workflows and developer tools. Less research, more shipping.',
  },
  {
    id: 'product-analyst',
    title: 'Product / Solutions Analyst',
    location: 'Mohali · Hybrid',
    type: 'Full-time',
    summary:
      'Bridge between client context and engineering. Turn fuzzy requirements into clear problem statements, flows and testable outcomes.',
  },
];

export const CareersPage: React.FC = () => {
  return (
    <section className="py-20">
      <Container className="max-w-5xl">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">
            Careers
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Build systems that actually get used.
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
            Ameotech is a small, senior-heavy team focused on applied engineering and AI. We don’t
            optimise for buzzwords; we optimise for outcomes — pricing engines, forecasting systems,
            workflow automation and platforms that survive production.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
            If you don&apos;t see a perfect fit below but feel strongly about working together, reach
            out anyway.
          </p>
        </div>

        <div className="space-y-4">
          {JOBS.map((job) => (
            <article
              key={job.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h2 className="text-lg font-semibold mb-1">{job.title}</h2>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
                  {job.location} · {job.type}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                  {job.summary}
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <a
                  href={`mailto:hello@ameotech.com?subject=${encodeURIComponent(
                    `Application: ${job.title}`,
                  )}`}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                >
                  Apply via email
                </a>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Attach your CV + 2–3 projects you&apos;re proud of.
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
