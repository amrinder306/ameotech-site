import React from 'react';
import { Container } from '../ui/Container';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-bold mb-4">Ameotech</h4>
            <p className="text-sm">Applied AI Engineering for Enterprise Scale</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="hover:text-white">Discovery Sprint</a></li>
              <li><a href="#services" className="hover:text-white">AI Pod Retainer</a></li>
              <li><a href="#services" className="hover:text-white">Custom Projects</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#cases" className="hover:text-white">Case Studies</a></li>
              <li><span className="hover:text-white cursor-not-allowed opacity-60">Blog (coming soon)</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:hello@ameotech.com" className="hover:text-white">hello@ameotech.com</a></li>
              <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Ameotech. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};
