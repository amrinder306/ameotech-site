import React from 'react';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
};

export const SectionHeader: React.FC<Props> = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
}) => {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col gap-2 mb-8 ${alignment}`}>
      {eyebrow && <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">{eyebrow}</p>}
      <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      {subtitle && <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">{subtitle}</p>}
    </div>
  );
};
