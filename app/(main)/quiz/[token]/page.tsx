'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { CheckCircle2, ChevronRight, Hash, Play, HelpCircle, Clock, Timer, Sparkles, Rocket, ArrowLeft, Trophy, X, User } from 'lucide-react';
import { MarkdownContent } from '@/components/shared/MarkdownContent';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: Option[];
  points: number;
}

interface QuizData {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    question_count: number;
  };
  questions: Question[];
}

export default function TakeQuizPage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();

  const [data, setData] = useState<QuizData | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Timer
  const [timeLeft, setTimeLeft] = useState(0); 

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await apiClient.get(`/quiz/share/${token}`);
        setData(res.data.data);
        // Default time: 2 mins per question
        setTimeLeft(res.data.data.questions.length * 120);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [token]);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitting) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting]);

  const submitQuiz = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Format answers for API: Array of {question_id, selected_options, answer_text}
      const formattedAnswers = data?.questions.map(q => ({
        question_id: q.id,
        selected_options: Array.isArray(answers[q.id]) ? answers[q.id] : (answers[q.id] ? [answers[q.id]] : []),
        answer_text: typeof answers[q.id] === 'string' ? answers[q.id] : ''
      }));

      const res = await apiClient.post(`/quiz/${data?.quiz.id}/attempt`, {
        answers: formattedAnswers,
        guest_name: guestName || undefined
      });
      
      const attemptId = res.data.data.attempt_id;
      router.push(`/quiz/${token}/result?attempt_id=${attemptId}`);
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi nộp bài. Vui lòng thử lại!');
      setIsSubmitting(false);
    }
  };

  const selectOption = (qId: string, optId: string) => {
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    // Auto next after selection if not last
    if (currentIdx < (data?.questions.length || 0) - 1) {
       setTimeout(() => setCurrentIdx(prev => prev + 1), 300);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
         <div className="text-center space-y-6 animate-pulse">
            <div className="w-24 h-24 bg-orange-100 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-lg">
               <Sparkles size={48} className="text-orange-300" />
            </div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Đang chuẩn bị đề thi...</p>
         </div>
      </div>
    );
  }
  
  if (!data) return <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center font-black text-gray-400">Không tìm thấy bài tập.</div>;

  const currentQuestion = data.questions[currentIdx];
  const progress = ((currentIdx + 1) / data.questions.length) * 100;
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white border-4 border-orange-50 rounded-[3.5rem] p-12 shadow-2xl text-center space-y-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[4rem] opacity-50 -mr-10 -mt-10" />
           <div className="w-24 h-24 bg-orange-100 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-lg relative z-10">
              <Trophy size={48} className="text-orange-500" strokeWidth={2.5} />
           </div>
           <div className="space-y-4 relative z-10">
              <h2 className="text-4xl font-black text-gray-950 tracking-tighter uppercase">{data.quiz.title}</h2>
              <p className="text-gray-400 font-bold">Bộ đề gồm {data.quiz.question_count} câu hỏi. Bạn đã sẵn sàng chinh phục thử thách này chưa? ✨</p>
           </div>
           
           <div className="space-y-6 relative z-10">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center justify-center gap-2">
                    <User size={12} /> Tên của bạn (Tùy chọn)
                 </label>
                 <input 
                   type="text"
                   className="w-full px-8 py-4 bg-[#FFF9F5] border-2 border-orange-50 rounded-2xl font-black text-center text-orange-600 outline-none focus:border-orange-200 transition-all placeholder:text-gray-200"
                   placeholder="Nhập biệt danh để lưu kết quả..."
                   value={guestName}
                   onChange={e => setGuestName(e.target.value)}
                 />
              </div>

              <button 
                onClick={() => setHasStarted(true)}
                className="w-full py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-[2rem] font-black shadow-2xl shadow-orange-500/30 active:scale-95 transition-all text-xl flex items-center justify-center gap-3 group"
              >
                Bắt đầu làm bài <Play size={24} fill="white" className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col items-center justify-center py-12 px-6">
      
      {/* Quiz Progress Header */}
      <div className="max-w-4xl w-full mb-12 space-y-10 group">
         <div className="flex items-center justify-between gap-8">
            <div className="space-y-2">
               <h1 className="text-4xl font-black tracking-tighter text-gray-950 group-hover:text-orange-600 transition-colors uppercase leading-tight line-clamp-1">
                  {data.quiz.title}
               </h1>
               <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-white border-2 border-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                     Câu hỏi {currentIdx + 1} / {data.quiz.question_count}
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 border-2 border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                     <Clock size={12} strokeWidth={3} /> {formatTime(timeLeft)}
                  </div>
               </div>
            </div>
            
            <button 
               onClick={submitQuiz}
               disabled={isSubmitting}
               className="hidden md:flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-2xl font-black transition-all shadow-xl shadow-orange-500/20 active:scale-95 text-sm group/btn"
            >
               {isSubmitting ? (
                 <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 <>Nộp bài <Rocket size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" strokeWidth={3} /></>
               )}
            </button>
         </div>

         <div className="relative w-full h-8 bg-white border-4 border-orange-50 rounded-full overflow-hidden shadow-inner p-1">
            <div 
               className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500 rounded-full transition-all duration-700 relative"
               style={{ width: `${progress}%` }}
            >
               <div className="absolute top-0 right-0 w-8 h-full bg-white/20 blur-sm -skew-x-12" />
            </div>
         </div>
      </div>

      {/* Main Question Card */}
      <div className="max-w-4xl w-full bg-white border-4 border-orange-50/50 rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-orange-500/5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[4rem] opacity-50 -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-1000" />
         
         <div className="relative z-10 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="text-2xl md:text-3xl font-black text-gray-950 leading-tight">
               <MarkdownContent>{currentQuestion.question_text}</MarkdownContent>
            </div>

            <div className="space-y-8">
               {currentQuestion.question_type === 'true_false' ? (
                 <div className="grid grid-cols-2 gap-8">
                    {['True', 'False'].map((val) => {
                      const isSelected = answers[currentQuestion.id] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => selectOption(currentQuestion.id, val)}
                          className={`px-8 py-10 rounded-[2.5rem] border-4 flex flex-col items-center justify-center gap-4 transition-all active:scale-95 ${
                            isSelected
                              ? (val === 'True' ? 'bg-emerald-500 border-emerald-100 text-white shadow-2xl shadow-emerald-500/20' : 'bg-rose-500 border-rose-100 text-white shadow-2xl shadow-rose-500/20')
                              : 'bg-white border-orange-50 text-gray-400 hover:border-orange-200'
                          }`}
                        >
                           <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
                             isSelected ? 'bg-white/20 border-white/40' : (val === 'True' ? 'bg-emerald-50 text-emerald-300' : 'bg-rose-50 text-rose-300')
                           }`}>
                              {val === 'True' ? <CheckCircle2 size={40} strokeWidth={3} /> : <X size={40} strokeWidth={3} />}
                           </div>
                           <span className="text-2xl font-black uppercase tracking-widest">{val === 'True' ? 'Đúng' : 'Sai'}</span>
                        </button>
                      );
                    })}
                 </div>
               ) : currentQuestion.question_type === 'fill_blank' ? (
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-2">Nhập câu trả lời của bạn:</label>
                    <input 
                      type="text"
                      autoFocus
                      className="w-full px-10 py-8 bg-[#FFF9F5] border-4 border-orange-50 rounded-[2.5rem] focus:border-orange-200 focus:ring-8 focus:ring-orange-50 outline-none font-black text-2xl text-orange-600 transition-all placeholder:text-gray-200 text-center"
                      placeholder="..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={e => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                    />
                 </div>
               ) : (
                 <div className="grid md:grid-cols-2 gap-6">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = answers[currentQuestion.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => selectOption(currentQuestion.id, opt.id)}
                          className={`group/opt relative px-8 py-6 rounded-[2rem] border-4 text-left transition-all active:scale-[0.98] ${
                            isSelected
                              ? 'bg-orange-500 border-orange-100 text-white shadow-2xl shadow-orange-500/30'
                              : 'bg-white border-orange-50 text-gray-500 hover:border-orange-200 hover:bg-orange-50/20'
                          }`}
                        >
                          <div className="flex items-center gap-6">
                             <span className={`w-12 h-12 rounded-2xl text-lg font-black flex items-center justify-center shrink-0 border-4 transition-all ${
                               isSelected ? 'bg-white text-orange-600 border-orange-100' : 'bg-orange-50 text-orange-200 border-orange-100 group-hover/opt:bg-orange-100 group-hover/opt:text-orange-500'
                             }`}>
                               {opt.id}
                             </span>
                             <span className={`text-lg font-black tracking-tight ${isSelected ? 'text-white' : 'text-gray-700 group-hover/opt:text-orange-600'}`}>
                               {opt.text}
                             </span>
                          </div>
                        </button>
                      );
                    })}
                 </div>
               )}
            </div>

            <div className="pt-10 border-t-2 border-orange-50 flex items-center justify-between gap-6">
               <button 
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className={`px-8 py-4 font-black transition-all flex items-center gap-3 rounded-2xl border-2 ${
                    currentIdx === 0 ? 'opacity-0' : 'bg-white border-orange-50 text-gray-400 hover:text-orange-500 hover:border-orange-100 active:scale-95 text-sm'
                  }`}
               >
                  <ChevronRight size={20} className="rotate-180" strokeWidth={3} /> Câu trước
               </button>

               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-100" />
                  <div className="w-3 h-3 rounded-full bg-orange-100" />
                  <div className="w-3 h-3 rounded-full bg-orange-100" />
               </div>

               {currentIdx < data.questions.length - 1 ? (
                 <button 
                    onClick={() => setCurrentIdx(prev => Math.min(data.questions.length - 1, prev + 1))}
                    className="px-8 py-4 bg-orange-50 text-orange-600 border-2 border-orange-100 font-black rounded-2xl flex items-center gap-3 hover:bg-orange-100 active:scale-95 transition-all text-sm group"
                 >
                    Tiếp theo <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                 </button>
               ) : (
                 <button 
                    onClick={submitQuiz}
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black rounded-2xl flex items-center gap-3 hover:from-orange-600 hover:to-rose-600 shadow-xl shadow-orange-500/20 active:scale-95 transition-all text-sm group"
                 >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Hoàn thành <CheckCircle2 size={20} strokeWidth={3} /></>
                    )}
                 </button>
               )}
            </div>
         </div>
      </div>
      
      <div className="mt-12 text-center text-xs font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
         <Trophy size={16} className="text-orange-100" />
         Hoàn thành bộ đề để nhận điểm Nebula Star ✨
      </div>
    </div>
  );
}
