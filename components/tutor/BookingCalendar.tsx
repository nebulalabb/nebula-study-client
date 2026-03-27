'use client';

import React, { useState } from 'react';
import { format, addDays, startOfDay, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Clock, CheckCircle2, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

interface Availability {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface BookingCalendarProps {
  availabilities: Availability[];
  hourlyRateVnd: number;
  onConfirm: (date: string, startTime: string, durationMinutes: number) => void;
  isSubmitting: boolean;
}

export function BookingCalendar({ availabilities, hourlyRateVnd, onConfirm, isSubmitting }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate next 14 days
  const today = startOfDay(new Date());
  const days = Array.from({ length: 14 }).map((_, i) => addDays(today, i));

  // Determine available slots for the selected date
  const getSlotsForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    const dayAvailabilities = availabilities.filter(a => a.day_of_week === dayOfWeek);
    
    if (dayAvailabilities.length === 0) return [];

    let slots: string[] = [];
    dayAvailabilities.forEach(a => {
       const start = parse(a.start_time, 'HH:mm:ss', date);
       const end = parse(a.end_time, 'HH:mm:ss', date);
       
       let current = start;
       while (current < end) {
         // Generate 60 min slots
         if (current.getTime() > Date.now() + 3600000) { // Require at least 1 hr advance booking
           slots.push(format(current, 'HH:mm'));
         }
         current = new Date(current.getTime() + 60 * 60000); // Add 60 mins
       }
    });

    return [...new Set(slots)].sort();
  };

  const availableSlots = selectedDate ? getSlotsForDate(selectedDate) : [];

  return (
    <div className="bg-white border-2 border-orange-50 rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-orange-500/5 relative overflow-hidden group/cal transition-all hover:border-orange-100">
       {/* Decoration */}
       <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[4rem] opacity-50 -mr-10 -mt-10 group-hover/cal:scale-110 transition-transform duration-700 pointer-events-none" />

       <h3 className="text-2xl font-black text-gray-950 mb-10 flex items-center gap-4 relative z-10 tracking-tight">
         <div className="p-2.5 bg-orange-500 text-white rounded-2xl shadow-xl shadow-orange-500/20 rotate-3">
            <Calendar size={24} />
         </div>
         Đặt lịch học ngay
       </h3>

       <div className="space-y-10 relative z-10">
         {/* Date selection carousel */}
         <div className="space-y-4">
            <div className="flex items-center justify-between text-[11px] font-black text-orange-400 uppercase tracking-widest pl-1">
               <span className="flex items-center gap-2"><Calendar size={12} /> Chọn ngày học</span>
               <span className="text-gray-300 font-bold">Tháng {format(days[0], 'MM')}</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x pr-2 custom-scrollbar">
               {days.map((day, i) => {
                 const isAvail = availabilities.some(a => a.day_of_week === day.getDay());
                 const isSelected = selectedDate?.getTime() === day.getTime();
                 const isToday = day.getTime() === today.getTime();

                 return (
                   <button
                     key={i}
                     onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                     disabled={!isAvail}
                     className={`snap-start shrink-0 w-24 p-5 rounded-[1.75rem] border-4 transition-all flex flex-col items-center justify-center relative overflow-hidden ${
                       isSelected 
                        ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-xl shadow-orange-500/10 scale-105' 
                        : isAvail 
                          ? 'border-orange-50 bg-white hover:border-orange-200 text-gray-700 shadow-sm hover:shadow-lg' 
                          : 'border-transparent bg-gray-50 text-gray-300 opacity-40 cursor-not-allowed'
                     }`}
                   >
                     {isToday && <span className="absolute top-2 inset-x-0 text-[8px] font-black uppercase text-orange-400">Hôm nay</span>}
                     <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 transition-colors ${isSelected ? 'text-orange-500' : 'text-gray-400'}`}>
                        {format(day, 'EEEE', { locale: vi }).replace('Thứ ', 'T')}
                     </span>
                     <span className={`text-3xl font-black transition-colors ${isSelected ? 'text-orange-950' : 'text-gray-800'}`}>
                        {format(day, 'dd')}
                     </span>
                     {isSelected && <div className="absolute bottom-2 w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                   </button>
                 );
               })}
            </div>
         </div>

         {/* Time slots */}
         {selectedDate && (
           <div className="animate-in slide-in-from-top-4 fade-in duration-500 space-y-6">
              <div className="flex items-center justify-between">
                 <p className="text-[11px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> Chọn khung giờ
                 </p>
                 <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                    60 phút / buổi
                 </span>
              </div>
              
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-3">
                   {availableSlots.map(time => {
                     const isSelected = selectedTime === time;
                     return (
                       <button
                         key={time}
                         onClick={() => setSelectedTime(time)}
                         className={`p-4 rounded-2xl border-2 font-black transition-all text-center flex flex-col items-center justify-center gap-1 relative overflow-hidden ${
                           isSelected 
                            ? 'border-orange-500 bg-orange-500 text-white shadow-xl shadow-orange-500/20 scale-105' 
                            : 'border-orange-50 bg-[#FFF9F5] hover:border-orange-200 hover:bg-orange-50/50 text-gray-700'
                         }`}
                       >
                         {isSelected && <Sparkles size={10} className="absolute top-2 right-2 text-white/50 animate-pulse" />}
                         <span className="text-lg tracking-tight">{time}</span>
                         <span className={`text-[8px] font-black uppercase opacity-60 ${isSelected ? 'text-white' : 'text-gray-400'}`}>Bắt đầu</span>
                       </button>
                     )
                   })}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center gap-3">
                  <AlertCircle size={32} className="text-gray-200" />
                  <p className="font-bold max-w-xs mx-auto text-sm leading-relaxed">Tiếc quá! Ngày này không còn lịch trống. Bạn chọn ngày khác nha ✨</p>
                </div>
              )}
           </div>
         )}
         
         {/* Action Bar */}
         {selectedDate && selectedTime && (
           <div className="pt-10 border-t-4 border-orange-50 flex flex-col sm:flex-row items-center justify-between gap-8 animate-in zoom-in-95 duration-500">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Tổng phí đăng ký học</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-950 tracking-tighter">
                    {new Intl.NumberFormat('vi-VN').format(hourlyRateVnd)}
                  </span>
                  <span className="text-xs font-black text-gray-400 font-serif lowercase">đ</span>
                </div>
              </div>
              <button
                disabled={isSubmitting}
                onClick={() => onConfirm(format(selectedDate, 'yyyy-MM-dd'), selectedTime + ':00', 60)}
                className="w-full sm:w-auto px-12 py-6 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-black rounded-3xl transition-all shadow-2xl shadow-orange-500/30 active:scale-95 flex items-center justify-center gap-3 text-lg group/btn"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Xác nhận Đặt Lịch <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
           </div>
         )}
       </div>
    </div>
  );
}
