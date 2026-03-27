'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronRight, Hash, Play, HelpCircle, Eye, Sparkles, BookOpen, Target } from 'lucide-react';
import { MarkdownContent } from '@/components/shared/MarkdownContent';

interface QuizPreviewData {
  quiz: {
    id: string; title: string; share_token: string; question_count: number;
    description: string | null; difficulty: string;
  };
  questions: Array<{
    id: string; question_text: string; question_type: string;
    options: Array<{id: string; text: string}>;
    points: number; correct_answers?: string[]; explanation?: string;
  }>;
}

export default function QuizPreviewPage() {
  const params = useParams();
  const quizId = params.id as string;
  
  const [data, setData] = useState<QuizPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIt = async () => {
      try {
        const listRes = await apiClient.get('/quiz');
        const qz = listRes.data.data.items.find((q: any) => q.id === quizId);
        if (qz && qz.share_token) {
          const detailRes = await apiClient.get(`/quiz/share/${qz.share_token}`);
          setData(detailRes.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIt();
  }, [quizId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
         <div className="space-y-6 text-center animate-pulse">
            <div className="w-20 h-20 bg-orange-100 rounded-3xl mx-auto" />
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Đang tải bản nháp...</p>
         </div>
      </div>
    );
  }
  
  if (!data) return <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center font-black text-gray-500">Bộ đề không tồn tại.</div>;

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      <div className="max-w-5xl mx-auto px-6 pt-16 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 group">
          <div className="flex items-center gap-6">
            <Link href="/learn/quiz" className="p-4 bg-white border-2 border-orange-50 text-orange-400 hover:text-orange-600 hover:border-orange-100 rounded-2xl transition-all shadow-sm active:scale-95">
              <ArrowLeft size={24} strokeWidth={3} />
            </Link>
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tighter text-gray-950 group-hover:text-orange-600 transition-colors uppercase leading-tight">
                {data.quiz.title}
              </h1>
              <div className="flex flex-wrap gap-3">
                 <span className="px-3 py-1 bg-white border-2 border-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                    {data.quiz.question_count} câu hỏi
                 </span>
                 <span className="px-3 py-1 bg-white border-2 border-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                    {data.quiz.difficulty}
                 </span>
              </div>
            </div>
          </div>
          <Link 
            href={`/quiz/${data.quiz.share_token}`} 
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-2xl font-black transition-all shadow-2xl shadow-orange-500/30 active:scale-95 text-xl group/btn"
          >
            <Play size={24} className="group-hover/btn:scale-110 transition-transform fill-current" /> 
            Làm thử ngay
          </Link>
        </div>

        <div className="bg-white border-4 border-orange-50/50 rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-orange-500/5 relative overflow-hidden">
           {/* Section Header */}
           <div className="flex items-center gap-4 mb-12">
              <div className="p-4 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-500/20 -rotate-3">
                 <Eye size={24} strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-black text-gray-950 tracking-tight">Chi tiết câu hỏi</h2>
           </div>
           
           <div className="space-y-10">
             {data.questions.map((q, i) => (
               <div key={q.id} className="p-10 bg-[#FFF9F5] border-2 border-orange-50 rounded-[2.5rem] relative overflow-hidden group/q transition-all hover:bg-orange-50/20">
                 
                 {/* Question Index Badge */}
                 <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[2.5rem] -mr-12 -mt-12 group-hover/q:scale-110 transition-transform flex items-end justify-start p-6">
                    <span className="text-2xl font-black text-orange-200">#{(i + 1).toString().padStart(2, '0')}</span>
                 </div>

                 <div className="flex flex-col gap-8">
                   <div className="max-w-[90%] font-black text-gray-950">
                     <MarkdownContent>{q.question_text}</MarkdownContent>
                   </div>

                    {q.question_type === 'true_false' ? (
                      <div className="grid grid-cols-2 gap-4">
                        {['True', 'False'].map(val => {
                          const isCorrect = q.correct_answers?.includes(val);
                          return (
                            <div key={val} className={`px-6 py-4 rounded-2xl border-2 flex items-center justify-between font-black ${
                              isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-orange-50 text-gray-300'
                            }`}>
                              <span>{val === 'True' ? 'Đúng (True)' : 'Sai (False)'}</span>
                              {isCorrect && <CheckCircle2 size={20} />}
                            </div>
                          );
                        })}
                      </div>
                    ) : q.question_type === 'fill_blank' ? (
                      <div className="p-6 bg-white border-2 border-emerald-100 rounded-2xl flex items-center gap-4">
                         <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Đáp án đúng:</span>
                         <span className="text-xl font-black text-emerald-600">{q.correct_answers?.[0]}</span>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {q.options?.map((opt) => {
                          const isCorrect = q.correct_answers?.includes(opt.id);
                          return (
                            <div 
                              key={opt.id} 
                              className={`px-6 py-4 bg-white rounded-2xl border-2 text-sm font-black flex items-center gap-4 transition-all ${
                                isCorrect 
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/10' 
                                  : 'border-orange-50 text-gray-500'
                              }`}
                            >
                               <span className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border-2 ${
                                 isCorrect 
                                   ? 'bg-emerald-500 text-white border-emerald-100' 
                                   : 'bg-gray-50 text-gray-300 border-gray-100'
                               }`}>
                                 {opt.id}
                               </span>
                               <span>{opt.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                   
                   {q.explanation && (
                     <div className="p-6 bg-white border-2 border-dashed border-orange-100 rounded-2xl space-y-2">
                        <p className="text-[10px] font-black text-orange-300 uppercase tracking-widest flex items-center gap-2">
                           <Sparkles size={12} /> Lời giải thích:
                        </p>
                     <div className="text-gray-600 font-bold text-sm leading-relaxed">
                        <MarkdownContent>{q.explanation}</MarkdownContent>
                     </div>
                     </div>
                   )}
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="text-center">
            <Link href="/learn/quiz" className="text-sm font-black text-gray-300 hover:text-orange-400 transition-all uppercase tracking-[0.2em]">
               Quay lại thư viện chung
            </Link>
        </div>
      </div>
    </div>
  );
}
