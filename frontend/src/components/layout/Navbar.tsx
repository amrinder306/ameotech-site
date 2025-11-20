import React from 'react';
import { Container } from '../ui/Container';

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <Container className="py-4 flex items-center justify-between">
        <div className="text-xl font-bold">Ameotech</div>
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          <li><a href="#services" className="hover:text-blue-600">Services</a></li>
          <li><a href="#ai" className="hover:text-blue-600">AI &amp; Automation</a></li>
          <li><a href="#process" className="hover:text-blue-600">Process</a></li>
          <li><a href="#cases" className="hover:text-blue-600">Case Studies</a></li>
          <li><a href="/labs" className="hover:text-blue-600">Labs</a></li>
          <li><a href="#about" className="hover:text-blue-600">About</a></li>
          <li><a href="#contact" className="text-blue-600 font-bold">Book a Call</a></li>
        </ul>
      </Container>
    </nav>
  );
};
