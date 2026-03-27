'use client';

import React, { useEffect, useState } from 'react';
import { TutorCard } from '@/components/tutor/TutorCard';
import { apiClient } from '@/lib/api-client';
import { Search, Filter, Briefcase, Star, Sparkles, GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';

export default function TutorCatalogPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const subjects = ['Toán học', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Lập trình', 'Ngữ văn'];

  const fetchTutors = async () => {
    setIsLoading(true);
    try {
       const { data } = await apiClient.get('/tutor', { params: { subject: subjectFilter || undefined } });
       setTutors(data.data.items || []);
    } catch (err) {
       console.error(err);
    } finally {
       setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectFilter]);

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
               <div className="flex items-center gap-3 px-6 py-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                  <Users size={20} className="text-orange-400" />
                  <span className="text-sm font-black text-orange-900 tracking-tight">1,200+ Mentors</span>
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

        {/* Filters */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 text-[11px] font-black text-orange-400 uppercase tracking-[0.3em] overflow-x-auto pb-2 custom-scrollbar">
             <Filter size={16} /> Lọc theo môn học
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setSubjectFilter('')}
              className={`px-8 py-4 rounded-2xl font-black transition-all border-4 shadow-sm flex items-center gap-2 ${
                !subjectFilter 
                  ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-500/20 scale-105' 
                  : 'bg-white border-orange-50 text-gray-400 hover:border-orange-200 hover:shadow-lg'
              }`}
            >
              🚀 Tất cả
            </button>
            
            {subjects.map(s => (
              <button 
                key={s}
                onClick={() => setSubjectFilter(s)}
                className={`px-8 py-4 rounded-2xl font-black transition-all border-4 shadow-sm ${
                  subjectFilter === s 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-500/20 scale-105' 
                    : 'bg-white border-orange-50 text-gray-400 hover:border-orange-200 hover:shadow-lg'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

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
