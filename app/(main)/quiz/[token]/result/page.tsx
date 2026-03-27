'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { CheckCircle2, XCircle, RotateCcw, Home, Trophy, Star, Target, Zap, Clock, ChevronRight, Award, Sparkles, BookOpen } from 'lucide-react';
import { MarkdownContent } from '@/components/shared/MarkdownContent';

interface ResultData {
  attempt: {
    id: string;
    score: string;
    max_score: string;
    percentage: string;
    passed: boolean;
    time_spent_sec: number;
    submitted_at: string;
  };
  quiz: {
    id: string;
    title: string;
  };
  details: Array<{
    question_id: string;
    question_text: string;
    is_correct: boolean;
    user_answer: string[];
    correct_answer: string[];
    explanation?: string;
  }>;
}

export default function QuizResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = params.token as string;
  const attemptId = searchParams.get('attempt_id');

  const [data, setData] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) return;
    const fetchResult = async () => {
      try {
        const res = await apiClient.get(`/quiz/share/${token}/result/${attemptId}`);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [token, attemptId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
         <div className="text-center space-y-6 animate-pulse">
            <div className="w-24 h-24 bg-orange-100 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-lg">
               <Trophy size={48} className="text-orange-300" />
            </div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Đang chấm điểm bài làm...</p>
         </div>
      </div>
    );
  }

  if (!data) return <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center font-black text-gray-400">Không tìm thấy kết quả.</div>;

  const score = parseFloat(data.attempt.score);
  const maxScore = parseFloat(data.attempt.max_score);
  const isGreat = score / maxScore >= 0.8;

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      
      {/* Hero Result Banner */}
      <div className="relative bg-gradient-to-b from-orange-500 to-rose-500 pt-20 pb-40 px-6 overflow-hidden">
         {/* Particles */}
         <div className="absolute top-10 left-10 text-white/20 animate-bounce delay-100"><Star size={40} fill="currentColor" /></div>
         <div className="absolute top-40 right-20 text-white/10 animate-pulse"><Sparkles size={80} fill="currentColor" /></div>
         <div className="absolute bottom-10 left-1/4 text-white/20 animate-bounce delay-700"><Award size={32} /></div>

         <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 animate-in zoom-in duration-700">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] border border-white/30">
               <Trophy size={16} /> Kết quả làm bài
            </div>
            
            <div className="space-y-4">
               <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight drop-shadow-xl">
                 {isGreat ? 'Tuyệt vời!' : 'Cố gắng lên!'} ✨
               </h1>
               <p className="text-xl text-orange-50 font-bold max-w-lg mx-auto leading-relaxed opacity-90">
                 Bạn đã hoàn thành bộ đề <span className="underline decoration-white/30 underline-offset-4">{data.quiz.title}</span>.
               </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border-4 border-white/20 rounded-[3.5rem] p-10 md:p-14 shadow-2xl inline-block group hover:scale-105 transition-transform">
               <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-100 mb-2">Điểm số của bạn</span>
                  <div className="flex items-baseline gap-2">
                     <span className="text-8xl md:text-9xl font-black text-white drop-shadow-2xl">{score}</span>
                     <span className="text-3xl md:text-4xl font-black text-white/50">/ {maxScore}</span>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FFF9F5] to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-24 relative z-20 space-y-12">
         
         {/* Stats Row */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
               { label: 'Tỷ lệ', val: `${data.attempt.percentage}%`, icon: <Target className="text-orange-500" />, bg: 'bg-orange-50' },
               { label: 'Thời gian', val: `${data.attempt.time_spent_sec}s`, icon: <Clock className="text-rose-500" />, bg: 'bg-rose-50' },
               { label: 'Kết quả', val: data.attempt.passed ? 'ĐẠT' : 'CHƯA ĐẠT', icon: <Zap className="text-sky-500" />, bg: 'bg-sky-50' },
               { label: 'Ngày làm', val: new Date(data.attempt.submitted_at).toLocaleDateString('vi-VN'), icon: <Star className="text-amber-500" />, bg: 'bg-amber-50' },
            ].map((s, i) => (
               <div key={i} className="bg-white border-4 border-orange-50 rounded-[2.5rem] p-6 shadow-xl shadow-orange-500/5 flex flex-col items-center text-center gap-3 transition-transform hover:scale-105">
                  <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center shadow-inner`}>
                     {s.icon}
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">{s.label}</p>
                     <p className="text-lg font-black text-gray-900 tracking-tight">{s.val}</p>
                  </div>
               </div>
            ))}
         </div>

         {/* Review Section */}
         <div className="bg-white border-4 border-orange-50/50 rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-orange-500/5 space-y-12 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[4rem] opacity-50 -mr-10 -mt-10" />
            
            <div className="flex items-center gap-4 relative z-10">
               <div className="p-4 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-500/20 rotate-3">
                  <BookOpen size={24} strokeWidth={3} />
               </div>
               <h2 className="text-3xl font-black text-gray-950 tracking-tight">Review bài làm</h2>
            </div>

            <div className="space-y-8 relative z-10">
               {data.details.map((item, i) => (
                 <div key={i} className={`p-8 rounded-[2.5rem] border-4 transition-all ${
                   item.is_correct ? 'bg-emerald-50/30 border-emerald-50' : 'bg-rose-50/30 border-rose-50'
                 }`}>
                    <div className="flex items-start gap-6">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 font-black ${
                         item.is_correct ? 'bg-emerald-500 text-white border-emerald-100' : 'bg-rose-500 text-white border-rose-100'
                       }`}>
                          {item.is_correct ? <CheckCircle2 size={24} strokeWidth={3} /> : <XCircle size={24} strokeWidth={3} />}
                       </div>
                       
                       <div className="flex-1 space-y-6">
                          <div className="text-lg font-black text-gray-950 leading-tight">
                             <MarkdownContent>{item.question_text}</MarkdownContent>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bạn chọn:</label>
                                <div className={`px-4 py-3 rounded-xl border-2 font-bold text-sm ${
                                  item.is_correct ? 'bg-white border-emerald-100 text-emerald-600' : 'bg-white border-rose-100 text-rose-600'
                                }`}>
                                   {item.user_answer.join(', ') || '(Trống)'}
                                </div>
                             </div>
                             {!item.is_correct && (
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Đáp án đúng:</label>
                                  <div className="px-4 py-3 bg-white border-2 border-emerald-100 rounded-xl font-bold text-sm text-emerald-600">
                                     {item.correct_answer.join(', ')}
                                  </div>
                               </div>
                             )}
                          </div>

                          {item.explanation && (
                             <div className="p-6 bg-white border-2 border-dashed border-gray-100 rounded-2xl space-y-2">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                   <Zap size={12} /> Lời giải:
                                </p>
                                <div className="text-gray-600 font-bold text-sm leading-relaxed">
                                   <MarkdownContent>{item.explanation}</MarkdownContent>
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Final Actions */}
         <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <Link 
               href={`/quiz/${token}`}
               className="w-full sm:w-auto px-12 py-5 bg-white border-4 border-orange-50 text-orange-600 rounded-2xl font-black transition-all shadow-xl hover:border-orange-100 active:scale-95 text-xl flex items-center justify-center gap-3 group"
            >
               <RotateCcw size={24} className="group-hover:rotate-180 transition-transform duration-500" strokeWidth={3} />
               Làm lại bộ đề
            </Link>
            <Link 
               href="/learn/quiz"
               className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-black transition-all shadow-2xl shadow-orange-500/30 active:scale-95 text-xl flex items-center justify-center gap-3 group"
            >
               <Home size={24} strokeWidth={3} />
               Về Thư viện
            </Link>
         </div>

      </div>
    </div>
  );
}
