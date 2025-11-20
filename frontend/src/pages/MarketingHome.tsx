import React from 'react';
import { Hero } from '../sections/Hero';
import { Trust } from '../sections/Trust';
import { Services } from '../sections/Services';
import { AiSection } from '../sections/AiSection';
import { Process } from '../sections/Process';
import { CaseStudies } from '../sections/CaseStudies';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';
import  ChatWidget  from '../components/ChatWidget';

export const MarketingHome: React.FC = () => {
  return (
    <>
      <Hero />
      <Trust />
      <Services />
      <AiSection />
      <Process />
      <CaseStudies />
      <About />
      <Contact />
      <ChatWidget />
    </>
  );
};
