import React from 'react';
import { Container } from '../components/ui/Container';
import { AuditWizard } from '../labs/AuditWizard';

export const AuditPage: React.FC = () => {
  return (
    <section className="py-16">
      <Container className="max-w-4xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">
            Labs / Tool 01
          </p>
          <h1 className="text-3xl font-bold mb-3">
            Product &amp; Engineering Maturity Audit
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
            A short diagnostic that reflects how we look at product, engineering and data/AI readiness
            before taking on serious work. No email required to see your result.
          </p>
        </div>
        <AuditWizard />
      </Container>
    </section>
  );
};
