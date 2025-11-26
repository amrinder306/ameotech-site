import React from "react";
import { Container } from "../../components/ui/Container";
import { ArchitectureBlueprintWizard } from "../../labs/ArchitectureBlueprintWizard";

const ArchitectureBlueprintPage: React.FC = () => {
  return (
    <section className="py-16">
      <Container className="max-w-4xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">
            Labs / Tool 03
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Architecture &amp; Risk Blueprint
          </h1>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 max-w-2xl">
            A short, structured assessment that turns your product assumptions into a concrete
            architecture tier, stack and infrastructure plan — without asking for an email.
          </p>
        </div>

        <ArchitectureBlueprintWizard />
      </Container>
    </section>
  );
};

export default ArchitectureBlueprintPage;
