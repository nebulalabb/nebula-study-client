'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit, CheckCircle2, FileText } from 'lucide-react';

const steps = [
  { icon: FileText, label: 'Đang phân tích dữ liệu nguồn...' },
  { icon: BrainCircuit, label: 'NebulaAI đang cấu trúc thông tin...' },
  { icon: Sparkles, label: 'Đang tạo nội dung thẻ chất lượng cao...' },
  { icon: CheckCircle2, label: 'Sắp hoàn tất, vui lòng chờ trong giây lát...' }
];

export function FlashcardGenerating() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Advance steps slowly to simulate AI thought process
    const interval = setInterval(() => {
      setCurrentStep(s => Math.min(s + 1, steps.length - 1));
    }, 4000); // 4 seconds per step
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-[2.5rem] border-2 border-orange-100/50 dark:border-orange-900/30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-2xl min-h-[450px]">
      
      {/* Animated Hero Icon */}
      <div className="relative w-28 h-28 mb-10">
        <div className="absolute inset-0 bg-orange-400 rounded-full blur-2xl opacity-20 animate-pulse border-none"></div>
        <div className="relative w-full h-full bg-gradient-to-br from-orange-400 to-rose-500 rounded-3xl rotate-12 flex items-center justify-center shadow-xl transform transition-transform hover:scale-110 duration-500">
          <BrainCircuit size={48} className="text-white -rotate-12 animate-pulse" />
        </div>
      </div>

      <h3 className="text-2xl font-black text-gray-900 dark:text-zinc-100 mb-3 tracking-tight">NebulaAI đang soạn bài...</h3>
      <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 max-w-xs mx-auto mb-10 leading-relaxed">
        Chúng mình đang chắt lọc kiến thức quan trọng nhất để tạo ra những tấm thẻ nhớ xịn sò cho bạn.
      </p>

      {/* Progress Steps */}
      <div className="w-full max-w-sm mx-auto space-y-5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;
          
          return (
            <div key={idx} className={`flex items-center gap-4 text-left transition-all duration-700 ${
              isActive ? 'opacity-100 translate-x-0 scale-100' :
              isDone ? 'opacity-50 translate-x-0 scale-95' : 'opacity-0 translate-x-8 scale-90'
            }`}>
              <div className={`w-10 h-10 rounded-2xl flex flex-shrink-0 items-center justify-center shadow-sm transition-colors duration-500 ${
                isActive ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400' :
                isDone ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                'bg-gray-100 text-gray-400 dark:bg-zinc-800'
              }`}>
                {isDone ? <CheckCircle2 size={18} /> : isActive ? <Icon size={18} className="animate-spin-slow" /> : <Icon size={18} />}
              </div>
              <span className={`text-sm font-bold tracking-tight transition-colors duration-500 ${
                isActive ? 'text-orange-600 dark:text-orange-300' :
                isDone ? 'text-emerald-600 dark:text-emerald-500 line-through decoration-emerald-200' :
                'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
