'use client';

import React from 'react';
import { X, AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';

interface CuteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  type?: 'info' | 'confirm' | 'error' | 'success';
}

export default function CuteModal({ isOpen, onClose, onConfirm, title, description, type = 'info' }: CuteModalProps) {
  if (!isOpen) return null;

  const config = {
    info: {
      icon: <HelpCircle className="text-sky-500" size={32} />,
      btnColor: 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20',
      bgLight: 'bg-sky-50'
    },
    confirm: {
      icon: <HelpCircle className="text-orange-500" size={32} />,
      btnColor: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20',
      bgLight: 'bg-orange-50'
    },
    error: {
      icon: <AlertCircle className="text-rose-500" size={32} />,
      btnColor: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20',
      bgLight: 'bg-rose-50'
    },
    success: {
      icon: <CheckCircle2 className="text-emerald-500" size={32} />,
      btnColor: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20',
      bgLight: 'bg-emerald-50'
    }
  }[type];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 fade-in slide-in-from-bottom-8 duration-500 border-4 border-white dark:border-zinc-800">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className={`w-20 h-20 ${config.bgLight} dark:bg-zinc-800 rounded-3xl flex items-center justify-center shadow-inner`}>
            {config.icon}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight leading-tight">
              {title}
            </h3>
            <p className="text-gray-500 dark:text-zinc-400 font-bold leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex gap-4 w-full pt-4">
            {type === 'confirm' ? (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 py-4 bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 font-black rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all border border-gray-100 dark:border-zinc-800"
                >
                  Bỏ qua
                </button>
                <button
                  onClick={() => { onConfirm?.(); onClose(); }}
                  className={`flex-1 py-4 text-white font-black rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 ${config.btnColor}`}
                >
                  Tiếp tục
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className={`w-full py-4 text-white font-black rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 ${config.btnColor}`}
              >
                Đã hiểu ✨
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
