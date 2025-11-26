// src/components/layout/PageShell.tsx
import React, { ReactNode } from 'react';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

type Props = {
  children: ReactNode;
};

export const PageShell: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};
