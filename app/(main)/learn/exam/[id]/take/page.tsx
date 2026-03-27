'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { ExamTimer } from '@/components/shared/ExamTimer';
import { MarkdownContent } from '@/components/shared/MarkdownContent';
import { Check, Send, Sparkles, BookOpen, AlertCircle, ChevronRight, LayoutGrid } from 'lucide-react';

export default function ExamTakePage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attempt_id');
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [duration, setDuration] = useState(45);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!attemptId) {
      router.replace('/learn/exam/' + id);
      return;
    }
    
    // Only init if we haven't loaded questions yet (prevents loop when updating URL)
    if (questions.length > 0) return;

    const init = async () => {
      try {
        const { data } = await apiClient.post('/exam/' + id + '/attempt/start');
        setQuestions(data.data.questions);
        setDuration(data.data.duration_minutes);
        if (data.data.attempt_id !== attemptId) {
          router.replace('/learn/exam/' + id + '/take?attempt_id=' + data.data.attempt_id);
        }
      } catch (err) {
        alert('Lỗi khởi tạo bài làm');
        router.push('/learn/exam/' + id);
      }
    };
    init();
  }, [id, attemptId, router, questions.length]);

  const toggleAnswer = (qId: string, optionId: string, type: string) => {
    setAnswers(prev => {
      const current = prev[qId] || [];
      if (type === 'single_choice' || type === 'true_false') {
        return { ...prev, [qId]: [optionId] };
      }
      if (current.includes(optionId)) return { ...prev, [qId]: current.filter(x => x !== optionId) };
      return { ...prev, [qId]: [...current, optionId] };
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!confirm('Bạn có chắc chắn muốn nộp bài bây giờ không?')) return;
    
    setIsSubmitting(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      await apiClient.post('/exam/attempt/' + attemptId + '/submit', {
        answers,
        time_spent_sec: timeSpent
      });
      router.push('/learn/exam/result/' + attemptId);
    } catch (err: any) {
      alert('Lỗi khi nộp bài: ' + (err.response?.data?.message || err.message));
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="font-black text-orange-500 uppercase tracking-widest text-[10px]">Đang tải dữ liệu câu hỏi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start relative">
          
          {/* Left Questions Area */}
          <div className="flex-1 space-y-10 w-full mb-12">
            {questions.map((q, idx) => (
              <div 
                key={q.id} 
                id={'q-' + idx} 
                className="group bg-white border-2 border-orange-50/50 p-8 md:p-12 rounded-[3.5rem] shadow-xl shadow-orange-500/5 scroll-mt-24 transition-all hover:border-orange-100"
              >
                <div className="flex flex-col md:flex-row gap-6 mb-10">
                  <div className="shrink-0 w-14 h-14 bg-orange-500 text-white font-black rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-orange-500/20 rotate-3 group-hover:rotate-0 transition-transform">
                    {idx + 1}
                  </div>
                  <div className="flex-1 prose prose-lg max-w-none text-gray-800 font-bold leading-relaxed">
                    <MarkdownContent className="text-gray-800 font-bold leading-relaxed">
                      {q.question_text}
                    </MarkdownContent>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:pl-20">
                  {q.options?.map((opt: any) => {
                    const isSelected = (answers[q.id] || []).includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleAnswer(q.id, opt.id, q.question_type)}
                        className={`group/opt w-full flex items-center gap-6 p-6 rounded-[1.5rem] border-2 transition-all text-left relative overflow-hidden ${
                          isSelected 
                            ? 'border-orange-500 bg-orange-50/50 shadow-inner' 
                            : 'border-gray-50 bg-white hover:border-orange-200 hover:bg-orange-50/20'
                        }`}
                      >
                        <div className={`shrink-0 w-8 h-8 rounded-xl border-4 flex items-center justify-center transition-all ${
                          isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-orange-100 bg-white group-hover/opt:border-orange-300'
                        }`}>
                          {isSelected && <Check size={18} strokeWidth={4} />}
                        </div>
                        <div className={`flex-1 font-black text-base tracking-tight transition-colors ${
                          isSelected ? 'text-orange-900' : 'text-gray-500 group-hover/opt:text-gray-700'
                        }`}>
                          <MarkdownContent>{opt.text}</MarkdownContent>
                        </div>
                        {isSelected && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-200 opacity-20 group-hover/opt:opacity-40 transition-opacity">
                             <Sparkles size={32} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 space-y-8">
            
            {/* Timer Box */}
            <div className="bg-white border-2 border-orange-50 p-8 rounded-[3rem] shadow-2xl shadow-orange-500/5 flex flex-col items-center justify-center overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-orange-100" />
               <p className="text-[10px] text-gray-400 font-black uppercase text-center tracking-[0.2em] mb-4 flex items-center gap-2">
                 <Sparkles size={12} className="text-orange-300" /> Thời gian còn lại
               </p>
               <ExamTimer durationMinutes={duration} onTimeUp={handleSubmit} />
            </div>

            {/* Navigator */}
            <div className="bg-white border-2 border-orange-50 p-8 rounded-[3rem] shadow-2xl shadow-orange-500/5 relative">
               <div className="flex items-center gap-2 mb-6">
                 <LayoutGrid size={18} className="text-orange-500" />
                 <h3 className="font-black text-gray-800 tracking-tight">Câu hỏi</h3>
               </div>
               
               <div className="grid grid-cols-5 gap-3">
                 {questions.map((q, idx) => {
                   const hasAnswered = (answers[q.id] || []).length > 0;
                   return (
                     <a 
                       href={'#q-' + idx}
                       key={q.id}
                       className={`w-11 h-11 rounded-[1rem] flex items-center justify-center text-sm font-black transition-all border-2 active:scale-90 ${
                         hasAnswered 
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
                          : 'bg-white border-gray-100 text-gray-300 hover:border-orange-200 hover:text-orange-500'
                       }`}
                     >
                       {idx + 1}
                     </a>
                   );
                 })}
               </div>

               <div className="mt-10 pt-8 border-t border-orange-50/50">
                 <button
                   onClick={handleSubmit}
                   disabled={isSubmitting}
                   className="w-full py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:from-orange-600 hover:to-rose-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 disabled:opacity-50 group"
                 >
                   {isSubmitting ? (
                     <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <>
                       Nộp bài ngay <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                     </>
                   )}
                 </button>
                 <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-4">Hãy kiểm tra kỹ bài làm nha!</p>
               </div>
            </div>

            <div className="px-6 flex items-center gap-3 text-gray-400 text-[11px] italic font-bold opacity-60">
              <BookOpen size={14} className="text-orange-300" /> Đã trả lời {(Object.keys(answers).length)} / {questions.length} câu
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
