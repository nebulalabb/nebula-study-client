'use client';

import React from 'react';
import { Flame, Trophy, Calendar } from 'lucide-react';

interface StreakProps {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  lastActivityDate: string | null;
  history: any[];
}

export function StreakDisplay({ currentStreak, longestStreak, totalDays, lastActivityDate, history }: StreakProps) {
  const isHot = currentStreak > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden relative group ${
        isHot 
          ? 'bg-white border-orange-100 shadow-2xl shadow-orange-500/10' 
          : 'bg-white border-gray-100 shadow-xl shadow-gray-200/5 opacity-80'
      }`}>
        {/* Background Decorative Sparkle */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
          isHot ? 'bg-orange-500/10 group-hover:bg-orange-500/20' : 'bg-gray-100'
        }`} />

        <div className="flex items-center gap-6 relative z-10">
          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${
            isHot 
              ? 'bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-xl shadow-orange-500/30 scale-110 rotate-3' 
              : 'bg-gray-100 text-gray-300'
          }`}>
            <Flame size={32} className={isHot ? 'animate-pulse' : ''} />
          </div>
          
          <div className="flex-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Chuỗi học tập</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black tabular-nums tracking-tighter ${
                isHot ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {currentStreak}
              </span>
              <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Ngày liên tiếp</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-orange-300" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kỷ lục: <span className="text-gray-600">{longestStreak}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-orange-300" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng: <span className="text-gray-600">{totalDays}</span></p>
          </div>
        </div>

        {isHot && (
          <div className="mt-4 px-4 py-2 bg-orange-50 rounded-xl border border-orange-100/50">
             <p className="text-[10px] text-orange-600 font-bold italic leading-none">
                🔥 Bạn đang hừng hực khí thế! Tiếp tục nhé!
             </p>
          </div>
        )}
      </div>

      {/* GitHub-style Contribution Graph */}
      <div className="bg-white border-2 border-orange-50 p-6 rounded-[2rem] shadow-lg shadow-orange-500/5">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Lịch sử 12 tuần gần nhất</p>
         
         <div className="grid grid-cols-12 gap-2">
            {Array.from({ length: 12 }).map((_, weekIndex) => (
               <div key={weekIndex} className="grid grid-rows-7 gap-1.5">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                     // Calculate date for this cell
                     const date = new Date();
                     const daysToSubtract = (11 - weekIndex) * 7 + (6 - dayIndex);
                     date.setDate(date.getDate() - daysToSubtract);
                     const dateStr = date.toISOString().split('T')[0];
                     
                     const activity = history.find(h => h.date.split('T')[0] === dateStr);
                     const count = activity ? parseInt(activity.count) : 0;
                     
                     let bgColor = 'bg-gray-100';
                     if (count > 0) bgColor = 'bg-orange-400';
                     if (count > 1) bgColor = 'bg-orange-600';

                     return (
                        <div 
                           key={dayIndex} 
                           title={`${dateStr}: ${count} bài học`}
                           className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 hover:shadow-sm ${bgColor}`} 
                        />
                     );
                  })}
               </div>
            ))}
         </div>
         
         <div className="mt-4 flex items-center justify-end gap-2 text-[8px] font-bold text-gray-300 uppercase tracking-widest">
            <span>Ít</span>
            <div className="flex gap-1">
               <div className="w-2.5 h-2.5 bg-gray-100 rounded-px" />
               <div className="w-2.5 h-2.5 bg-orange-400 rounded-px" />
               <div className="w-2.5 h-2.5 bg-orange-600 rounded-px" />
            </div>
            <span>Nhiều</span>
         </div>
      </div>
    </div>
  );
}
