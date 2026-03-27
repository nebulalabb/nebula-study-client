'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface ExamTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

export function ExamTimer({ durationMinutes, onTimeUp }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const isLow = timeLeft < 300; // Less than 5 mins
  const isCritical = timeLeft < 60; // Less than 1 min

  return (
    <div className={`flex flex-col items-center gap-1 transition-all duration-500 ${
      isCritical ? 'scale-110' : ''
    }`}>
      <div className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] border-4 transition-all duration-500 shadow-xl ${
        isCritical 
          ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-rose-500/20 animate-pulse' 
          : isLow 
          ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-amber-500/20' 
          : 'bg-white border-orange-50 text-orange-500 shadow-orange-500/10'
      }`}>
        {isCritical ? <AlertCircle size={28} className="animate-bounce" /> : <Clock size={28} className={isLow ? 'animate-spin-slow' : ''} />}
        <span className="text-4xl font-black tracking-tighter tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      
      {isLow && (
        <p className={`text-[10px] font-black uppercase tracking-widest mt-2 animate-in fade-in slide-in-from-top-1 ${
          isCritical ? 'text-rose-500' : 'text-amber-500'
        }`}>
          {isCritical ? 'Sắp hết giờ rồi! Nộp ngay nào!' : 'Cố lên, còn chưa đầy 5 phút!'}
        </p>
      )}
    </div>
  );
}
