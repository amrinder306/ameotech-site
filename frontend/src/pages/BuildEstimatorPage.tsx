
import React from 'react';
import { Container } from '../components/ui/Container';
import { BuildEstimatorWizard } from '../labs/BuildEstimatorWizard';

export const BuildEstimatorPage: React.FC = () => {
  return (
    <section className="py-16 bg-slate-950 text-slate-50 min-h-[80vh]">
      <Container className="max-w-4xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Labs / Tool 02</p>
          <h1 className="text-3xl font-bold mb-3">Build Cost &amp; Delivery Model Estimator</h1>
          <p className="text-slate-300 max-w-2xl">
            Share a bit about your context and constraints. We&apos;ll outline the engagement model we&apos;d use,
            a realistic budget band and a pragmatic 8–12 week plan.
          </p>
        </div>
        <BuildEstimatorWizard />
      </Container>
    </section>
  );
};
