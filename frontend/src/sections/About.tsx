import React from 'react';
import { Container } from '../components/ui/Container';
import { SectionHeader } from '../components/ui/SectionHeader';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white dark:bg-slate-900">

      <Container className="max-w-4xl">
        <SectionHeader
          title="About Ameotech"
        />
        <div className="prose prose-lg text-slate-700 dark:text-slate-200 space-y-6">
          <p>
            Ameotech was founded by engineers who got tired of watching companies spend millions on AI initiatives
            that never went to production. We started because we believed there was a better way.
          </p>
          <p>
            We&apos;re not a staffing agency. We&apos;re not a low-cost outsourcer. We&apos;re a team of senior engineers and
            architects who lead the design and delivery of high-stakes AI systems. We work upstream—in architecture,
            in strategy, in technical leadership—not downstream in ticket execution.
          </p>
          <p>
            Our clients are serious founders, CTOs, and product leaders at growth-stage SaaS, retail, fintech,
            and enterprise software companies. They come to us when the stakes are high, when the technical complexity
            is real, and when failure isn&apos;t an option.
          </p>
          <p>
            We&apos;ve built and deployed large-scale pricing and data engineering systems used at Walmart and WWE
            through our enterprise technology partnership. We&apos;ve architected demand forecasting systems,
            ML-powered automation platforms, and real-time analytics infrastructure for companies processing billions
            of events annually.
          </p>
          <p className="font-semibold text-lg">
            We call it &quot;Applied AI, not experiments.&quot; Our work ships. It scales. It delivers ROI.
          </p>
        </div>
        <div className="mt-12 p-8 bg-blue-50 rounded-xl border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60">
          <h3 className="text-xl font-bold mb-4">Our Engineering Philosophy</h3>
          <ul className="space-y-3 text-slate-700 dark:text-slate-200">
            <li><strong>Architecture First.</strong> Design before code. Always.</li>
            <li><strong>Production-Ready.</strong> Type-safe, tested, documented systems from day one.</li>
            <li><strong>Transparency.</strong> Weekly updates, open code review, shared ownership.</li>
            <li><strong>Mentorship.</strong> We teach your team. Knowledge transfer is built into every engagement.</li>
            <li><strong>Pragmatism.</strong> No theoretical frameworks. Only solutions that work in production.</li>
          </ul>
        </div>
      </Container>
    </section>
  );
};
