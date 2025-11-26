import React from 'react';
import { Container } from '../components/ui/Container';
import { SectionHeader } from '../components/ui/SectionHeader';

const pods = [
  {
    title: 'Discovery Sprint',
    description:
      '2–4 week engagement to validate AI opportunity, scope architecture, and define delivery roadmap.',
    bullets: [
      'Problem scoping & technical audit',
      'Architecture recommendation',
      'Delivery proposal & timeline',
    ],
    price: '$6K–$8K',
  },
  {
    title: 'AI Pod Retainer',
    description:
      'Ongoing engineering leadership. Build, iterate, and scale your AI systems with a senior team.',
    bullets: [
      'Full-stack AI system delivery',
      'Architecture-first approach',
      'Bi-weekly strategy reviews',
    ],
    price: '$10K–$16K/month',
  },
  {
    title: 'Custom Engineering Project',
    description:
      'Fixed-scope delivery of specific systems: pricing engines, demand forecasting, ML infrastructure.',
    bullets: [
      'End-to-end system delivery',
      'Production-ready code',
      'Knowledge transfer & documentation',
    ],
    price: 'Custom pricing',
  },
  {
    title: 'Technical Advisory',
    description:
      'CTO-level guidance on AI strategy, vendor selection, and technical hiring.',
    bullets: [
      'AI strategy & roadmapping',
      'Architecture reviews',
      'Executive workshops',
    ],
    price: '$3K–$5K/session',
  },
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white dark:bg-slate-900">

      <Container>
        <SectionHeader
          title="Services & Engineering Pods"
          subtitle="We don't augment teams. We lead them."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {pods.map((pod) => (
            <article
              key={pod.title}
              className="p-8 bg-gray-50 rounded-xl border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-bold mb-3">{pod.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">{pod.description}</p>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200 mb-6">
                  {pod.bullets.map((item) => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
              </div>
              <p className="text-lg font-semibold text-blue-600">{pod.price}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
