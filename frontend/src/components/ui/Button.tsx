import React from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const base =
  "inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition";

const variants: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary:
    "border border-slate-300 text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-900",
  ghost:
    "border-2 border-white text-white hover:bg-blue-800 dark:hover:bg-blue-900",
};

export const Button: React.FC<Props> = ({
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
};
