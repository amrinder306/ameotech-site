import React from 'react';
import { Container } from '../components/ui/Container';
import { SectionHeader } from '../components/ui/SectionHeader';

const cases = [
  {
    tag: 'Retail',
    title: 'Dynamic Pricing at Enterprise Scale',
    body: 'Built and deployed large-scale pricing optimization system used at Walmart through our enterprise technology partner. Real-time price adjustment across 5,000+ SKUs, integrated with demand forecasting and competitive intelligence.',
    bullets: [
      ['Challenge:', 'Manual pricing process causing 2–3% margin loss monthly'],
      ['Solution:', 'ML-driven pricing engine with margin floor constraints'],
      ['Result:', '5–7% margin improvement, deployed across all categories'],
    ],
  },
  {
    tag: 'Entertainment',
    title: 'Demand Forecasting & Inventory Optimization',
    body: 'Deployed forecast-driven inventory system for WWE. Multi-horizon demand predictions feeding supply chain planning, reducing overstock by 18% while improving fill rates.',
    bullets: [
      ['Challenge:', '25% overstock on seasonal inventory, inconsistent demand prediction'],
      ['Solution:', 'Hierarchical forecasting with supply chain integration'],
      ['Result:', '18% reduction in overstock, improved cash flow'],
    ],
  },
  {
    tag: 'SaaS',
    title: 'Churn Prediction & Retention Automation',
    body: 'Built ML-powered churn model triggering automated retention workflows. Segmented intervention strategies based on churn risk and customer value.',
    bullets: [
      ['Challenge:', '12% monthly churn, manual retention process'],
      ['Solution:', 'Predictive model + rule-based workflow automation'],
      ['Result:', '3% churn reduction, 40% automation of retention outreach'],
    ],
  },
  {
    tag: 'FinTech',
    title: 'ML-Powered Risk Scoring & Underwriting',
    body: 'Architected and deployed gradient boosting model for real-time credit risk scoring. Reduced false positives by 22% while maintaining fraud detection rates.',
    bullets: [
      ['Challenge:', 'High false positive rate, manual review bottleneck'],
      ['Solution:', 'Ensemble ML model with human-in-loop validation'],
      ['Result:', '22% reduction in false positives, 35% faster underwriting'],
    ],
  },
];

export const CaseStudies: React.FC = () => {
  return (
    <section id="cases" className="py-24 bg-gray-50">
      <Container>
        <SectionHeader title="Case Studies" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {cases.map((item) => (
            <article key={item.title} className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-6">{item.body}</p>
              <div className="space-y-2 text-sm">
                {item.bullets.map(([label, text]) => (
                  <p key={label}>
                    <strong>{label}</strong> {text}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
