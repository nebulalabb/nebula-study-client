import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-zinc-950 dark:focus:ring-indigo-500/10',
            error && 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-rose-500 ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
