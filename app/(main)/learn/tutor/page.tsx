'use client';

import React, { useEffect, useState } from 'react';
import { TutorCard } from '@/components/tutor/TutorCard';
import { apiClient } from '@/lib/api-client';
import { Search, Filter, Briefcase, Star, Sparkles, GraduationCap, Users, Calendar } from 'lucide-react';
import { CuteCalendar } from '@/components/tutor/CuteCalendar';
import { CuteSelect } from '@/components/ui/CuteSelect';
import Link from 'next/link';

export default function TutorCatalogPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000000 });
  const [dateFilter, setDateFilter] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [totalTutors, setTotalTutors] = useState(0);

  const subjects = ['Toán học', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Lập trình', 'Ngữ văn'];

  const fetchTutors = async () => {
    setIsLoading(true);
    try {
       const params: any = { 
         subject: subjectFilter || undefined,
         min_rating: minRating || undefined,
         price_min: priceRange.min || undefined,
         price_max: priceRange.max || undefined,
         date: dateFilter || undefined
       };
       const { data } = await apiClient.get('/tutor', { params });
       setTutors(data.data.items || []);
       setTotalTutors(data.data.total || 0);
    } catch (err) {
       console.error(err);
    } finally {
       setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectFilter, minRating, priceRange, dateFilter]);

  const filteredTutors = tutors.filter(t => 
    t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subjects?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        
        {/* Header & Hero */}
        <div className="relative group bg-white border-2 border-orange-50 rounded-[3.5rem] p-12 md:p-16 shadow-2xl shadow-orange-500/5 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 transition-all hover:border-orange-100">
          
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-bl-[8rem] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-rose-50/50 rounded-tr-[5rem] -ml-10 -mb-10 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none" />

          <div className="relative z-10 max-w-2xl text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-500 rounded-2xl border border-orange-100 text-[10px] font-black uppercase tracking-[0.3em]">
               <Sparkles size={14} className="animate-pulse" /> Find your mentor
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter leading-[0.9] mt-4">
              Tìm người <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">truyền lửa</span> cho bạn
            </h1>
            <p className="text-xl text-gray-400 font-bold leading-relaxed">
              Kết nối trực tiếp 1-1 với những gia sư, chuyên gia giỏi nhất để cùng bạn chinh phục mọi kì thi. ✨
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
               <Link 
                  href="/learn/tutor/register" 
                  className="w-full sm:w-auto px-10 py-5 bg-white border-4 border-orange-50 hover:border-orange-200 rounded-[1.75rem] font-black text-orange-600 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all text-lg flex items-center justify-center gap-2 group/reg"
               >
                  <Briefcase size={22} className="group-hover/reg:rotate-12 transition-transform" />
                  Trở thành Gia Sư
               </Link>
                <div className="flex items-center gap-3 px-6 py-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
                   <Users size={20} className="text-orange-400" />
                   <span className="text-sm font-black text-orange-900 tracking-tight">
                      {totalTutors.toLocaleString()} Gia sư
                   </span>
                </div>
            </div>
          </div>

          {/* Search Big Box */}
          <div className="relative z-10 w-full lg:w-96 shrink-0 space-y-4">
             <div className="relative group/search">
               <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-orange-200 group-focus-within/search:text-orange-500 transition-colors" />
               </div>
               <input
                 type="text"
                 className="block w-full pl-14 pr-8 py-6 bg-white border-4 border-orange-50 focus:border-orange-200 rounded-[2rem] shadow-xl shadow-orange-500/5 transition-all outline-none text-gray-900 font-black placeholder:text-gray-200 text-lg group-hover/search:shadow-orange-500/10"
                 placeholder="Tìm tên gia sư..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest italic pl-2 opacity-60">
                Chinh phục mọi môn học cùng Nebula ✨
             </p>
          </div>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CuteSelect 
              label="Môn học"
              placeholder="Tất cả môn học"
              value={subjectFilter}
              onChange={setSubjectFilter}
              options={subjects}
            />

            <div className="lg:col-span-2 space-y-4">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Đánh giá tối thiểu</label>
               <div className="flex gap-2">
                 {[4,3,2,1].map(r => (
                   <button 
                     key={r}
                     onClick={() => setMinRating(minRating === r ? 0 : r)}
                     className={`flex-1 py-4 rounded-2xl font-black transition-all border-2 flex items-center justify-center gap-1 ${
                       minRating === r ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'bg-white border-orange-50 text-gray-400 hover:border-orange-200'
                     }`}
                   >
                     {r} <Star size={12} className={minRating === r ? 'fill-white' : 'fill-gray-200'} />
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Giá tối đa (VNĐ)</label>
               <input 
                 type="text" 
                 placeholder="VD: 500.000"
                 className="w-full bg-white border-2 border-orange-50 rounded-2xl px-6 py-4 font-black text-gray-700 outline-none focus:border-orange-200 transition-all shadow-sm"
                 value={priceRange.max.toLocaleString('vi-VN')}
                 onChange={(e) => {
                    const val = e.target.value.replace(/\./g, '');
                    if (!isNaN(Number(val))) {
                        setPriceRange({ ...priceRange, max: Number(val) });
                    }
                 }}
               />
            </div>

            <div className="lg:col-span-4 space-y-6 relative">
               <div className="flex items-center justify-between px-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} className="text-orange-400" /> Ngày học lý tưởng
                  </label>
                  {dateFilter && (
                    <button 
                      onClick={() => setDateFilter('')}
                      className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline"
                    >
                      Xoá chọn ngày
                    </button>
                  )}
               </div>

               <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-2 px-2 snap-x snap-mandatory">
                  <button
                    onClick={() => {
                        setDateFilter('');
                        setIsCalendarOpen(!isCalendarOpen);
                    }}
                    className={`shrink-0 w-24 h-24 rounded-[2.5rem] border-4 transition-all flex flex-col items-center justify-center gap-1 group relative snap-start ${
                      isCalendarOpen 
                        ? 'bg-orange-500 border-orange-100 text-white shadow-xl shadow-orange-500/20 scale-105 z-10' 
                        : 'bg-white border-orange-50 text-gray-400 hover:border-orange-200'
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition-colors ${isCalendarOpen ? 'bg-white/20' : 'bg-orange-50 text-orange-500'}`}>
                        <Calendar size={24} strokeWidth={3} />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-tighter">Mở Lịch</div>
                    {isCalendarOpen && <Sparkles size={12} className="absolute top-2 right-2 animate-bounce" />}
                  </button>

                  <div className="w-0.5 h-16 bg-orange-100/50 self-center shrink-0 rounded-full" />

                  {Array.from({ length: 7 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    const isToday = i === 0;
                    const dateStr = d.toISOString().split('T')[0];
                    const dayName = d.toLocaleDateString('vi-VN', { weekday: 'short' }).replace('Th ', 'T');
                    const dayNum = d.getDate();
                    const monthNum = d.getMonth() + 1;
                    const isActive = dateFilter === dateStr && !isCalendarOpen;

                    return (
                      <button
                        key={i}
                        onClick={() => {
                            setDateFilter(isActive ? '' : dateStr);
                            setIsCalendarOpen(false);
                        }}
                        className={`shrink-0 w-20 h-24 rounded-[2.5rem] border-4 transition-all flex flex-col items-center justify-center gap-0 group relative snap-start ${
                          isActive 
                            ? 'bg-orange-500 border-orange-100 text-white shadow-xl shadow-orange-500/20 scale-105 z-10' 
                            : 'bg-white border-orange-50 text-gray-400 hover:border-orange-200 shadow-sm shadow-orange-100/10'
                        }`}
                      >
                        <div className={`text-[9px] font-black uppercase tracking-tighter mb-0.5 ${isActive ? 'opacity-80' : 'text-gray-300'}`}>
                          {isToday ? 'Nay' : dayName}
                        </div>
                        <div className="text-2xl font-black tabular-nums leading-none mb-1">{dayNum}</div>
                        <div className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-300'
                        }`}>
                          T.{monthNum}
                        </div>
                        {isActive && <Sparkles size={10} className="absolute top-2 right-2 animate-pulse" />}
                        {isToday && !isActive && <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-rose-400 rounded-full" />}
                      </button>
                    );
                  })}
               </div>

               {/* Popover Calendar */}
               {isCalendarOpen && (
                 <div className="absolute top-full left-0 mt-4 z-50 w-full max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
                    <CuteCalendar 
                      selectedDate={dateFilter} 
                      onSelect={(date) => {
                        setDateFilter(date);
                        setIsCalendarOpen(false);
                      }}
                      onClose={() => setIsCalendarOpen(false)}
                    />
                 </div>
               )}
            </div>
          </div>

        {/* Tutors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
             {[1,2,3,4,5,6,7,8].map(i => (
               <div key={i} className="h-80 bg-white border-2 border-orange-50 rounded-[2.5rem] animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-50/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
               </div>
             ))}
          </div>
        ) : filteredTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
             {filteredTutors.map(t => (
               <TutorCard key={t.id} tutor={t} />
             ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border-4 border-dashed border-orange-100 rounded-[3.5rem] shadow-sm">
             <div className="w-24 h-24 bg-orange-50 text-orange-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
               <Search size={48} />
             </div>
             <h3 className="text-3xl font-black text-gray-300 mb-4 tracking-tight">Không tìm thấy gia sư</h3>
             <p className="text-gray-400 font-bold max-w-sm mx-auto">Thử đổi từ khoá hoặc môn học khác xem sao, chúng mình sẽ sớm cập nhật thêm nhé. ✨</p>
          </div>
        )}

      </div>
    </div>
  );
}
