import React from 'react';
import { Container } from '../ui/Container';
import { useTheme } from '../../theme/ThemeProvider';

export const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  };

  const themeLabel =
    theme === "system"
      ? "System"
      : theme === "light"
      ? "Light"
      : "Dark";

  const themeIcon =
    theme === "system" ? "🌗" : theme === "light" ? "☀️" : "🌙";
  
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 dark:bg-slate-950/80 dark:border-slate-800">
      <Container className="py-4 flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-600 dark:bg-blue-500" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-wide uppercase">
              Ameotech
            </span>
            <span className="text-[0.65rem] text-gray-500 dark:text-slate-400">
              Applied Engineering &amp; AI
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          {/* These go to HOME + section, from any page */}
          <li>
            <a href="/#services" className="hover:text-blue-600 dark:hover:text-blue-400">
              Services
            </a>
          </li>
          <li>
            <a href="/#ai" className="hover:text-blue-600 dark:hover:text-blue-400">
              AI &amp; Automation
            </a>
          </li>
          <li>
            <a href="/#process" className="hover:text-blue-600 dark:hover:text-blue-400">
              Process
            </a>
          </li>
          <li>
            <a href="/#cases" className="hover:text-blue-600 dark:hover:text-blue-400">
              Case Studies
            </a>
          </li>
          <li>
            <a href="/labs" className="hover:text-blue-600 dark:hover:text-blue-400">
              Labs
            </a>
          </li>
          <li>
            <a href="/#about" className="hover:text-blue-600 dark:hover:text-blue-400">
              About
            </a>
          </li>
          <li>
            <a href="/careers" className="hover:text-blue-600 dark:hover:text-blue-400">
              Careers
            </a>
          </li>
          <li>
            <a href="/#contact" className="hover:text-blue-600 dark:hover:text-blue-400">
              Contact
            </a>
          </li>
        </ul>
        <button
            type="button"
            onClick={cycleTheme}
            title={`Theme: ${themeLabel}`}
            className="hidden md:inline-flex items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 h-8 w-8 text-xs"
          >
            <span aria-hidden="true">{themeIcon}</span>
          </button>
        {/* Mobile placeholder (we can make this real later) */}
        <button
          type="button"
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-800 dark:border-slate-700 dark:text-slate-100 text-xs"
        >
          ☰
        </button>
      </Container>
    </nav>
  );
};
