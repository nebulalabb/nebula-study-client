'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';

interface ToastNebulaProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const ToastNebula = ({ message, type = 'success', action }: ToastNebulaProps) => {
  const styles = {
    success: 'bg-emerald-500 text-white border-emerald-400',
    error: 'bg-rose-500 text-white border-rose-400',
    info: 'bg-indigo-500 text-white border-indigo-400',
    warning: 'bg-amber-500 text-white border-amber-400',
  };

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: Bell,
  }[type];

  return (
    <div className={`flex items-center gap-4 px-6 py-4 rounded-[1.8rem] shadow-2xl text-sm font-black tracking-tight border-2 ${styles[type]} animate-in slide-in-from-right-10 duration-300 pointer-events-auto`}>
      <Icon size={20} strokeWidth={3} className="shrink-0" />
      <div className="flex-1 min-w-0">
         <p className="leading-tight truncate">{message}</p>
         {action && (
            <button 
               onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
               }}
               className="mt-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors block w-fit"
            >
               {action.label}
            </button>
         )}
      </div>
    </div>
  );
};
