import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

type Props = {
  children: React.ReactNode;
};

export const PageShell: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
