'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { Clock, FileText, Share2, Wand2, Search, Sparkles, Trophy, Brain } from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration_minutes: number;
  total_questions: number;
  total_points: number;
  is_ai_generated: boolean;
}

const SUBJECT_LABELS: Record<string, string> = {
  math: 'Toán học',
  english: 'Tiếng Anh',
  physics: 'Vật lý',
  chemistry: 'Hóa học',
  biology: 'Sinh học',
  literature: 'Ngữ văn',
};

export default function ExamCatalogPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState('');

  useEffect(() => {
    fetchExams(subjectFilter);
  }, [subjectFilter]);

  const fetchExams = async (subj: string) => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/exam', { params: { subject: subj } });
      setExams(data.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        
        {/* Header & Generate Button */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between px-2">
          <div className="space-y-4">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-orange-500 text-white rounded-[1.25rem] shadow-lg shadow-orange-500/20 rotate-6">
                 <Trophy size={32} />
               </div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-gray-900">
                 Luyện Đề <span className="text-orange-500">Nebula</span>
               </h1>
             </div>
             <p className="text-gray-400 font-bold text-lg leading-relaxed max-w-xl">
               Chinh phục mọi kỳ thi với kho đề bám sát cấu trúc cực chuẩn, chấm điểm tự động tích tắc! 🚀
             </p>
          </div>
          <button 
            onClick={() => alert('Tính năng tự tạo đề đang phát triển')}
            className="group flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-black rounded-[1.5rem] transition-all shadow-xl shadow-orange-500/20 active:scale-95 whitespace-nowrap"
          >
            <Wand2 size={24} className="group-hover:rotate-12 transition-transform" /> Nhờ AI sinh đề ngay
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border-2 border-orange-50/50 shadow-sm w-fit max-w-full overflow-hidden overflow-x-auto no-scrollbar">
          {['', 'math', 'english', 'physics', 'chemistry'].map(subj => {
            const isSelected = subjectFilter === subj;
            return (
               <button
                 key={subj}
                 onClick={() => setSubjectFilter(subj)}
                 className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                   isSelected 
                    ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' 
                    : 'bg-white text-gray-400 hover:text-orange-500 hover:bg-orange-50/50'
                 }`}
               >
                 {subj === '' ? 'Tất cả' : SUBJECT_LABELS[subj] ?? subj}
               </button>
            )
          })}
        </div>

        {/* Grid or Empty */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="h-64 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm" />
             ))}
          </div>
        ) : exams.length === 0 ? (
          <div className="py-32 text-center bg-white/50 rounded-[3rem] border-4 border-dashed border-gray-100 max-w-3xl mx-auto">
             <Search size={64} className="mx-auto text-gray-200 mb-6" />
             <p className="text-gray-400 font-black text-xl italic tracking-tight">Hic, không tìm thấy đề nào phù hợp rùi...</p>
             <button onClick={() => setSubjectFilter('')} className="mt-6 font-bold text-orange-500 hover:underline">Xem lại tất cả đề thi</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams.map(exam => (
              <Link 
                href={'/learn/exam/' + exam.id} 
                key={exam.id} 
                className="group relative flex flex-col p-8 bg-white border-2 border-orange-50/50 rounded-[2.5rem] transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-200 overflow-hidden"
              >
                 {/* Decorative top strip */}
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 {exam.is_ai_generated && (
                   <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-bl-[1.5rem] text-[10px] font-black flex items-center gap-1.5 uppercase tracking-widest">
                     <Sparkles size={12} /> AI Cực phẩm
                   </div>
                 )}

                 <div className="flex-1 mb-8">
                   <div className="flex items-center gap-3 mb-4">
                     <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
                       {SUBJECT_LABELS[exam.subject] ?? exam.subject}
                     </span>
                     <span className="text-gray-200">·</span>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã đề: #{exam.id.slice(0,4)}</span>
                   </div>
                   
                   <h3 className="text-xl font-black text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2 tracking-tight leading-tight">
                     {exam.title}
                   </h3>
                   {exam.description && (
                     <p className="text-sm font-bold text-gray-400 mt-3 line-clamp-2 leading-relaxed opacity-70">
                       {exam.description}
                     </p>
                   )}
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-gray-50 group-hover:border-orange-50 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5 text-gray-400 text-xs font-black">
                        <Clock size={16} className="text-orange-300" /> {exam.duration_minutes}m
                     </div>
                     <div className="flex items-center gap-1.5 text-gray-400 text-xs font-black">
                        <FileText size={16} className="text-orange-300" /> {exam.total_questions}c
                     </div>
                   </div>
                   <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all shadow-sm">
                      <Brain size={20} />
                   </div>
                 </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
