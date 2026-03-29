'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { CheckCircle, Plus, Copy, Trash2, Users, Target, Play, Share2, Sparkles, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import { QuotaBadge } from '@/components/QuotaBadge';
import CuteModal from '@/components/ui/CuteModal';
import { toast } from '@/lib/toast-util';

interface QuizSet {
  id: string;
  title: string;
  question_count: number;
  difficulty: string;
  play_count: number;
  share_token: string;
  created_at: string;
}

export default function QuizHub() {
  const { isAuthenticated } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    try {
      const res = await apiClient.get('/quiz');
      setQuizzes(res.data.data.items);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchQuizzes();
  }, [isAuthenticated]);

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/quiz/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Đã copy link bài tập!');
  };

  const deleteQuiz = (id: string) => {
    setQuizToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteQuiz = async () => {
    if (!quizToDelete) return;
    try {
      await apiClient.delete(`/quiz/${quizToDelete}`);
      fetchQuizzes();
      toast.success('Đã xóa đề thi');
    } catch {
      toast.error('Xóa thất bại');
    } finally {
      setIsDeleteModalOpen(false);
      setQuizToDelete(null);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="min-h-screen bg-[#FFF9F5] pb-24">
        <div className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
          
          {/* Header Hero */}
          <div className="relative group bg-white border-2 border-orange-50 rounded-[3.5rem] p-12 md:p-16 shadow-2xl shadow-orange-500/5 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 transition-all hover:border-orange-100">
             {/* Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-bl-[8rem] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
             
             <div className="relative z-10 max-w-2xl text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-500 rounded-2xl border border-orange-100 text-[10px] font-black uppercase tracking-[0.3em]">
                   <Target size={14} className="animate-pulse" /> Quiz Generator
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter leading-[0.9]">
                  Tự động <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">soạn đề</span> thông minh
                </h1>
                <p className="text-xl text-gray-400 font-bold leading-relaxed max-w-xl">
                  Chuyển đổi tài liệu dài thành bộ câu hỏi trắc nghiệm chuẩn kiến thức trong tích tắc. ✨
                </p>
                <div className="pt-4">
                   <Link
                     href="/learn/quiz/create"
                     className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-2xl font-black transition-all shadow-2xl shadow-orange-500/30 active:scale-95 text-xl group/btn"
                   >
                     <Plus size={24} strokeWidth={3} className="group-hover/btn:rotate-90 transition-transform" /> 
                     Tạo đề thi mới
                   </Link>
                </div>
             </div>

             <div className="relative z-10 hidden lg:block">
                <div className="w-64 h-64 bg-orange-50 rounded-[3rem] shadow-inner rotate-3 flex items-center justify-center relative">
                   <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-[3rem] -rotate-6 border-4 border-orange-100" />
                   <Sparkles size={100} className="text-orange-200 relative z-10 animate-bounce" />
                </div>
             </div>
          </div>

          <section className="space-y-10">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-2xl font-black text-gray-950 flex items-center gap-3 tracking-tight">
                  <div className="p-2 bg-orange-100 text-orange-500 rounded-xl">
                     <BookOpen size={20} />
                  </div>
                  Đề thi đã lưu của bạn
               </h2>
               <QuotaBadge module="quiz" label="Hôm nay:" compact />
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-64 bg-white border-2 border-orange-50 rounded-[2.5rem] animate-pulse relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-50/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                ))}
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-center py-24 bg-white border-4 border-dashed border-orange-100 rounded-[3.5rem] shadow-sm">
                <div className="w-24 h-24 bg-orange-50 text-orange-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                  <Target size={48} />
                </div>
                <h3 className="text-3xl font-black text-gray-300 mb-4 tracking-tight">Chưa có đề thi nào</h3>
                <p className="text-gray-400 font-bold max-w-sm mx-auto mb-10">Hãy cung cấp tài liệu để AI tự động soạn đề trắc nghiệm chuẩn xác cho bạn nhé. ✨</p>
                <Link href="/learn/quiz/create" className="px-10 py-4 bg-orange-50 text-orange-600 font-black rounded-2xl hover:bg-orange-100 transition-all border-2 border-orange-100 shadow-sm active:scale-95">
                  Thử ngay bây giờ
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quizzes.map(quiz => (
                  <div key={quiz.id} className="relative flex flex-col p-8 bg-white border-2 border-orange-50 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all group overflow-hidden">
                    
                    {/* Card Decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[2.5rem] -mr-12 -mt-12 opacity-50 transition-transform group-hover:scale-110" />

                    <h3 className="font-black text-xl mb-4 line-clamp-2 pr-6 text-gray-950 group-hover:text-orange-600 transition-colors tracking-tight">
                      <Link href={`/learn/quiz/preview/${quiz.id}`}>
                        {quiz.title}
                      </Link>
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-orange-50 text-orange-600 rounded-lg border border-orange-100">
                        {quiz.question_count} câu hỏi
                      </span>
                      <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
                        {quiz.difficulty}
                      </span>
                      <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white rounded-lg flex items-center gap-1.5 shadow-lg shadow-orange-500/20">
                        <Users size={12} strokeWidth={3} /> {quiz.play_count} lượt làm
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest mb-10">
                       <Clock size={12} strokeWidth={3} className="text-gray-200" />
                       {formatDistanceToNow(new Date(quiz.created_at), { addSuffix: true, locale: vi })}
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3 pt-6 border-t border-orange-50">
                      <Link 
                        href={`/learn/quiz/preview/${quiz.id}`} 
                        className="flex justify-center items-center gap-2 py-3.5 bg-[#FFF9F5] hover:bg-orange-100 text-orange-600 border-2 border-orange-50 rounded-2xl font-black text-xs transition-all active:scale-95"
                      >
                        Đáp án
                      </Link>
                      <div className="flex gap-2">
                         <Link href={`/quiz/${quiz.share_token}`} target="_blank" className="flex-1 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 group/play">
                           <Play size={18} className="fill-current group-hover:scale-110 transition-transform" />
                         </Link>
                         <button onClick={() => copyLink(quiz.share_token)} className="p-3 bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-orange-500 rounded-2xl transition-all active:scale-95" title="Copy link chia sẻ">
                           <Share2 size={18} />
                         </button>
                         <button onClick={() => deleteQuiz(quiz.id)} className="p-3 text-gray-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-95">
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <CuteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteQuiz}
        title="Xóa đề thi"
        description="Bạn có chắc chắn muốn xóa vĩnh viễn đề kiểm tra này không? Hành động này không thể hoàn tác."
        type="confirm"
      />
    </>
  );
}
