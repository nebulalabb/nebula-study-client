'use client';

import React, { useState } from 'react';
import { CheckCircle2, Play, Check, Sparkles, BookOpen, ChevronRight, HelpCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { MarkdownContent } from '@/components/shared/MarkdownContent';

interface LessonCardProps {
  lesson: any;
  onCompleted: (isCorrect: boolean | null, gainedStreak: boolean) => void;
}

export function LessonCard({ lesson, onCompleted }: LessonCardProps) {
  const [selectedOpt, setSelectedOpt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ type: 'success'|'error', text: string } | null>(null);

  const isCompleted = lesson.progress_status === 'completed';

  const submitLesson = async (answerId?: string) => {
    setIsSubmitting(true);
    try {
      const { data } = await apiClient.post('/microlearn/lesson/' + lesson.id + '/complete', {
         answer_id: answerId || null
      });
      setResultMsg({
        type: data.data.is_correct === false ? 'error' : 'success',
        text: data.data.is_correct === false ? 'Sai rồi, cơ mà hông sao bạn vẫn được điểm chuyên cần nha!' : 'Hoàn thành xuất sắc luôn! 10 điểm 💯'
      });
      setTimeout(() => onCompleted(data.data.is_correct, true), 2000);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (lesson.quiz_question && !showQuiz) {
      setShowQuiz(true);
    } else {
      submitLesson(selectedOpt);
    }
  };

  if (isCompleted) {
    return (
      <div className="flex bg-white border-2 border-orange-50/50 p-8 rounded-[2.5rem] opacity-60 transition-all hover:opacity-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-6 w-full relative z-10">
           <div className="w-14 h-14 bg-emerald-500 text-white rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20 rotate-3 transition-transform group-hover:rotate-0">
             <CheckCircle2 size={28} />
           </div>
           <div>
             <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Đã học xong ✨</span>
             </div>
             <h3 className="text-xl font-black text-gray-800 tracking-tight">{lesson.title}</h3>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-orange-50/50 rounded-[3rem] shadow-2xl shadow-orange-500/5 overflow-hidden relative transition-all hover:border-orange-100 hover:shadow-orange-500/10">
       
       {/* Decorative Background Blob */}
       <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-orange-50/50 to-transparent pointer-events-none" />
       <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-50 rounded-full blur-3xl pointer-events-none opacity-50" />

       <div className="p-10 md:p-12 relative z-10">
         <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 p-1.5 border border-orange-50">
              {lesson.topic_icon_url ? <img src={lesson.topic_icon_url} alt="icon" className="w-full h-full object-contain" /> : <BookOpen size={20} className="text-orange-500" />}
            </div>
            <span className="px-4 py-1.5 bg-orange-500 text-white text-[10px] font-black tracking-widest uppercase rounded-xl shadow-lg shadow-orange-500/20">
              {lesson.topic_name}
            </span>
            <span className="text-gray-200">·</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nebula Flash Lesson</span>
         </div>

         <h2 className="text-3xl font-black text-gray-900 mb-8 leading-tight tracking-tight">{lesson.title}</h2>

         {!showQuiz && (
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-bold animate-in fade-in slide-in-from-bottom-2 duration-500">
              <MarkdownContent className="text-gray-700">{lesson.content}</MarkdownContent>
            </div>
         )}

         {showQuiz && lesson.quiz_question && (
            <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-3 mb-8 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                <div className="p-2 bg-orange-500 text-white rounded-lg shadow-sm">
                  <HelpCircle size={18} />
                </div>
                <h3 className="text-lg font-black text-orange-950 tracking-tight">{lesson.quiz_question.question}</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {lesson.quiz_question.options.map((opt: any) => {
                  const isSelected = selectedOpt === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedOpt(opt.id)}
                      className={`group/opt w-full flex items-center gap-5 p-6 rounded-[1.75rem] border-2 transition-all text-left relative overflow-hidden ${
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
                      <div className={`flex-1 font-black text-lg tracking-tight transition-colors ${
                        isSelected ? 'text-orange-950' : 'text-gray-500 group-hover/opt:text-gray-700'
                      }`}>
                        {opt.text}
                      </div>
                      {isSelected && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-200/40">
                          <Sparkles size={24} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
         )}

         {resultMsg && (
            <div className={`mt-10 p-6 rounded-[2rem] font-black flex items-center gap-4 animate-in zoom-in-95 duration-500 shadow-xl ${
              resultMsg.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-100 shadow-emerald-500/10' 
                : 'bg-rose-50 text-rose-700 border-2 border-rose-100 shadow-rose-500/10'
            }`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                resultMsg.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {resultMsg.type === 'success' ? <CheckCircle2 size={24}/> : <Sparkles size={24} className="animate-spin-slow" />}
              </div>
              <p className="tracking-tight leading-snug">{resultMsg.text}</p>
            </div>
         )}

         {!resultMsg && (
            <div className="mt-12 pt-10 border-t border-orange-50/50 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-[11px] font-black text-gray-400 uppercase tracking-widest opacity-60 italic">
                <BookOpen size={16} className="text-orange-300" /> Dành 3 phút mỗi ngày để nâng cấp bản thân
              </div>
              <button
                onClick={handleNext}
                disabled={isSubmitting || (showQuiz && !selectedOpt)}
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:from-orange-600 hover:to-rose-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 disabled:opacity-50 group group-active:scale-90"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {showQuiz ? 'Trả lời & Hoàn thành' : (lesson.quiz_question ? 'Làm bài tập nhỏ' : 'Đã hiểu, Hoàn thành')}
                    <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
         )}
       </div>
    </div>
  );
}
