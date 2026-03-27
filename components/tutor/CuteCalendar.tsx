'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Star,
  X
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isToday 
} from 'date-fns';
import { vi } from 'date-fns/locale';

interface CuteCalendarProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

export function CuteCalendar({ selectedDate, onSelect, onClose }: CuteCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-4 bg-orange-50/50 rounded-t-[2rem]">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-white rounded-full transition-all text-orange-400 hover:text-orange-600 active:scale-90"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xl font-black text-gray-800 tracking-tight lowercase">
            {format(currentMonth, 'MMMM yyyy', { locale: vi })}
          </span>
        </div>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-white rounded-full transition-all text-orange-400 hover:text-orange-600 active:scale-90"
        >
          <ChevronRight size={24} strokeWidth={3} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    return (
      <div className="grid grid-cols-7 mb-2 px-2">
        {days.map((day, i) => (
          <div key={i} className="text-center text-[10px] font-black text-orange-200 uppercase tracking-widest py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const dateStr = format(day, "yyyy-MM-dd");
        const isSelected = selectedDate === dateStr;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

        days.push(
          <div
            key={day.toString()}
            className={`relative p-1 flex items-center justify-center`}
          >
            <button
              disabled={isPast}
              onClick={() => onSelect(dateStr)}
              className={`
                w-10 h-10 rounded-2xl font-black transition-all relative group
                ${!isCurrentMonth ? 'text-gray-200' : isPast ? 'text-gray-300' : 'text-gray-700'}
                ${isSelected 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110 z-10' 
                  : isPast 
                    ? 'cursor-not-allowed' 
                    : 'hover:bg-orange-50 hover:text-orange-600 hover:scale-105 active:scale-95'}
              `}
            >
              <span className="relative z-10">{formattedDate}</span>
              {isToday(day) && !isSelected && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-400 rounded-full" />
              )}
              {isSelected && (
                <Sparkles size={10} className="absolute -top-1 -right-1 text-white animate-pulse" />
              )}
            </button>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="px-2 pb-4">{rows}</div>;
  };

  return (
    <div className="bg-white rounded-[2.5rem] border-4 border-orange-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="p-4 bg-orange-50/30 border-t-2 border-dashed border-orange-100 flex items-center justify-between">
         <button 
           onClick={() => onSelect('')}
           className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-orange-500 transition-colors flex items-center gap-1"
         >
            <Star size={12} /> Bất kỳ ngày nào
         </button>
         <button 
           onClick={onClose}
           className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-500 hover:shadow-lg transition-all border-2 border-orange-50 active:scale-90"
         >
            <X size={20} strokeWidth={3} />
         </button>
      </div>
    </div>
  );
}
