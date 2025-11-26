import React from 'react';
import { Container } from '../components/ui/Container';
import { SectionHeader } from '../components/ui/SectionHeader';

const steps = [
  {
    title: 'Understand',
    desc: 'We start with your business problem, not technology. Deep conversation with founders, CTOs, and product leaders to define scope, success metrics, and constraints.',
  },
  {
    title: 'Design Architecture',
    desc: 'We design the system first. Data flows, ML pipelines, API contracts, infrastructure assumptions—all documented and validated with your team before code.',
  },
  {
    title: 'Build with Velocity',
    desc: 'Bi-weekly sprints with working software. Type-safe, tested, documented code. Your team reviews and integrates in parallel.',
  },
  {
    title: 'Deploy & Iterate',
    desc: 'Production deployment with your ops team. Post-launch iteration, monitoring, and optimization based on real-world performance.',
  },
];

export const Process: React.FC = () => {
  return (
    <section id="process" className="py-24 bg-white dark:bg-slate-900">

      <Container>
        <SectionHeader title="How We Work" />
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <article key={step.title} className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {idx + 1}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{step.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
