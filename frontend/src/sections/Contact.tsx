import React from 'react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export const Contact: React.FC = () => {
  return (
    <section
    id="contact"
    className="py-24 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 text-white"
  >

      <Container className="max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build?</h2>
        <p className="text-xl mb-8 text-blue-100">
          Let&apos;s talk about your AI opportunity. No fluff, no pitch deck, just technical conversation.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button variant="primary">
            Book a Discovery Sprint
          </Button>
          <Button variant="ghost">
            Schedule a Call
          </Button>
        </div>
        <div className="mt-12 pt-12 border-t border-blue-500">
          <p className="text-sm text-blue-100">
            hello@ameotech.com | +1 (XXX) XXX-XXXX | US / UK / EU
          </p>
        </div>
      </Container>
    </section>
  );
};
