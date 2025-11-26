import React from "react";
import { Container } from "../components/ui/Container";
import { AiReadinessWizard } from "../labs/AiReadinessWizard";

export const AiReadinessPage: React.FC = () => {
  return (
    <section className="py-20">
      <Container className="max-w-4xl">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">
            Labs / Tool 04
          </p>
          <h1 className="text-3xl font-bold mb-3">
            AI Readiness Scan
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
            A practical, engineering-driven assessment to understand whether your
            organisation is ready for real AI adoption — and what steps will drive
            impact fastest.
          </p>
        </div>

        <AiReadinessWizard />
      </Container>
    </section>
  );
};
