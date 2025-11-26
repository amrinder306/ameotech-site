// src/sections/CaseStudiesSection.tsx
import React from 'react';
import { Container } from '../components/ui/Container';

type CaseStudy = {
  id: string;
  label: string;
  title: string;
  industry: string;
  summary: string;
  highlights: string[];
};

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'global-retail',
    label: 'Case Study 01',
    title: 'Global Retailer — Merchandising & Pricing Intelligence',
    industry: 'Retail · Pricing · Data Platforms',
    summary:
      'Modernized merchandising and category management for a large, multi-region retailer operating across thousands of SKUs and dozens of categories.',
    highlights: [
      'Azure-based ingestion using queues, document stores and container workloads.',
      'Unified vendor, stock and pricing signals into one decision layer.',
      'Enabled category teams to simulate price and margin changes before committing.',
    ],
  },
  {
    id: 'media-network',
    label: 'Case Study 02',
    title: 'Media & Entertainment Network — High-Volume Data Acceleration',
    industry: 'Media · Analytics · Distributed Processing',
    summary:
      'Re-engineered a critical analytics pipeline processing billions of event and audience records for a global sports & entertainment network.',
    highlights: [
      'Redesigned high-cardinality data flows for parallel, fault-tolerant processing.',
      'Optimized ETL and aggregations to match real-world usage and SLAs.',
      'Brought a key job down from weeks to under an hour, unblocking business decisions.',
    ],
  },
  {
    id: 'specialty-retail',
    label: 'Case Study 03',
    title: 'Specialty Retailer — Promotion & Discount Strategy Workbench',
    industry: 'Retail · Promotions · Decision Support',
    summary:
      'Built internal tools that help commercial teams plan and evaluate promotions, discounts and offers with clear visibility into impact.',
    highlights: [
      'Designed dashboards for revenue, margin and promo performance.',
      'Integrated data from POS, ecommerce and marketing sources.',
      'Enabled scenario planning before running campaigns in-market.',
    ],
  },
  {
    id: 'wealth-platform',
    label: 'Case Study 04',
    title: 'Wealth Management Firm — Advisor & Client Operations Platform',
    industry: 'Financial Services · Workflow · Platforms',
    summary:
      'Supported a US-based wealth management organization in streamlining advisor onboarding, client operations and compliance workflows.',
    highlights: [
      'Advisor and client onboarding flows with role-aware access.',
      'Workflow engine for review, approvals and exception handling.',
      'Multi-role dashboards exposing the same truth from different angles.',
    ],
  },
  {
    id: 'health-bariatric',
    label: 'Case Study 05',
    title: 'Healthcare Provider — Bariatric Surgery Management Platform',
    industry: 'Healthcare · Clinical Workflows · Patient Journeys',
    summary:
      'Delivered a full digital platform to manage the bariatric surgery journey across patients, clinicians and operations.',
    highlights: [
      'Patient onboarding, assessment and preparation flows.',
      'Clinic & surgeon dashboards for scheduling and follow-up.',
      'Post-operative tracking and structured data capture for better outcomes.',
    ],
  },
  {
    id: 'ai-pricing',
    label: 'Case Study 06',
    title: 'Enterprise AI Pricing Engine — Margin & Scenario Optimization',
    industry: 'B2B · Pricing · AI Decision Support',
    summary:
      'Built an AI-assisted pricing and scenario engine for an enterprise client, focused on margin protection and better commercial decisions.',
    highlights: [
      'Elasticity-aware simulation of price, demand and margin changes.',
      'Heatmaps and curves to compare scenarios across contracts, seasons and products.',
      'Deterministic guardrails around floor/ceiling prices and business constraints.',
    ],
  },
];

export const CaseStudiesSection: React.FC = () => {
  return (
    <section id="case-studies" className="py-20 bg-slate-100 dark:bg-slate-900">
      <Container className="max-w-6xl">
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400 mb-2">
            Case Studies
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Systems that sit where decisions actually happen.
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            We do most of our work under NDA. Below are anonymized but representative snapshots of
            the kind of problems we solve and the environments we build for.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {CASE_STUDIES.map((cs) => (
            <article
              key={cs.id}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 p-6 flex flex-col justify-between shadow-sm"
            >
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.25em] text-slate-400 mb-2">
                  {cs.label}
                </p>
                <h3 className="text-lg font-semibold mb-1">{cs.title}</h3>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-3">
                  {cs.industry}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  {cs.summary}
                </p>
                <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  {cs.highlights.map((h, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-[0.3rem] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-xs md:text-sm text-slate-500 dark:text-slate-400">
          Want a deeper walkthrough? We&apos;re happy to go into detail under NDA and in the context of
          your specific environment.
        </p>
      </Container>
    </section>
  );
};
