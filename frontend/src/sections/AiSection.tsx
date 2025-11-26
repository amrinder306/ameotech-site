import React from 'react';
import { Container } from '../components/ui/Container';
import { SectionHeader } from '../components/ui/SectionHeader';

const capabilities = [
  {
    icon: '📊',
    title: 'Dynamic Pricing Engines',
    desc: 'Real-time price optimization using demand forecasting, competitive intelligence, and margin modeling.',
  },
  {
    icon: '🔮',
    title: 'Demand Forecasting',
    desc: 'Multi-horizon ML forecasts for inventory, staffing, and revenue planning. Integrated into your stack.',
  },
  {
    icon: '⚙️',
    title: 'Workflow Automation',
    desc: 'Intelligent document processing, RPA integration, and decision logic automation at scale.',
  },
  {
    icon: '🗂️',
    title: 'Data Engineering',
    desc: 'Pipeline architecture, ETL optimization, and ML infrastructure for production environments.',
  },
  {
    icon: '📈',
    title: 'Analytics & BI',
    desc: 'Executive dashboards, self-service analytics, and real-time monitoring systems.',
  },
  {
    icon: '🔧',
    title: 'Platform Integration',
    desc: 'Seamless integration with your existing systems: Salesforce, SAP, Shopify, custom APIs.',
  },
];

export const AiSection: React.FC = () => {
  return (
<section
  id="ai"
  className="py-24 bg-gradient-to-br from-blue-50 to-gray-50 dark:from-slate-950 dark:to-slate-900"
>

      <Container>
        <SectionHeader
          title="AI & Automation Capabilities"
          subtitle="What we build. Not what we talk about."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((item) => (
            <article key={item.title} className="p-8 rounded-xl border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60">
              <div className="text-4xl font-bold text-blue-600 mb-3">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">{item.desc}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
