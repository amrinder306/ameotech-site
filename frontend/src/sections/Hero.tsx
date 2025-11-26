import React from 'react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export const Hero: React.FC = () => {
  return (
    <header className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 py-24">


      <Container className="max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Applied AI Engineering for Enterprise Scale
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          We build production-grade AI systems. Pricing optimization. Forecasting. Intelligent automation.
          Architecture-first, founder-led, deployed at scale.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="primary">
          Book a Discovery Sprint
        </Button>
        <Button variant="secondary">
          View Our Work
        </Button>
      </div>
      </Container>
    </header>
  );
};
