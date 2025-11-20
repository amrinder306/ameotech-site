import React from 'react';
import { Container } from '../components/ui/Container';

export const Trust: React.FC = () => {
  return (
    <section className="py-12 bg-white border-b border-gray-200">
      <Container className="text-center">
        <p className="text-sm text-gray-500 mb-4">DEPLOYED AT SCALE</p>
        <p className="text-lg text-gray-700">
          Built and deployed large-scale pricing and data engineering systems
          <span className="font-semibold"> used at Walmart and WWE through our enterprise technology partner.</span>
        </p>
      </Container>
    </section>
  );
};
