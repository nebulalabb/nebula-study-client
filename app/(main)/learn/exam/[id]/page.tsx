'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { ArrowLeft, Play, Clock, FileText, CheckCircle2, Share2, Award, BookOpen, Sparkles, ChevronLeft } from 'lucide-react';

const SUBJECT_LABELS: Record<string, string> = {
  math: 'Toán học',
  english: 'Tiếng Anh',
  physics: 'Vật lý',
  chemistry: 'Hóa học',
  biology: 'Sinh học',
  literature: 'Ngữ văn',
};

export default function ExamOverviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    apiClient.get('/exam/' + id).then(res => {
      setExam(res.data.data);
      setIsLoading(false);
    }).catch(() => {
      setExam(null);
      setIsLoading(false);
    });
  }, [id]);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const { data } = await apiClient.post('/exam/' + id + '/attempt/start');
      router.push('/learn/exam/' + id + '/take?attempt_id=' + data.data.attempt_id);
    } catch (err: any) {
      if (err.response?.status === 402) alert('Hết lượt thi rồi nè! Nâng cấp Premium để tiếp tục nha.');
      else alert('Có lỗi nhỏ: ' + (err.response?.data?.message || err.message));
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="font-black text-orange-500 uppercase tracking-widest text-xs">Đang chuẩn bị đề thi...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-xl border-2 border-orange-50">
          <h1 className="text-2xl font-black mb-4">Hông tìm thấy đề thi!</h1>
          <Link href="/learn/exam" className="text-orange-500 font-bold hover:underline flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Quay lại kho đề
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      <div className="max-w-5xl mx-auto px-6 pt-12 space-y-8">
        
        <Link 
          href="/learn/exam" 
          className="group inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-orange-500 transition-all uppercase tracking-widest"
        >
          <div className="p-2 bg-white rounded-xl border border-gray-100 group-hover:border-orange-200 group-hover:bg-orange-50 transition-all">
            <ChevronLeft size={18} />
          </div>
          Quay lại kho đề
        </Link>

        <div className="bg-white border-2 border-orange-50 p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-orange-500/5 relative overflow-hidden">
          
          {/* Decorative Blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-100/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-start justify-between">
            <div className="space-y-8 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                 <span className="px-4 py-1.5 bg-orange-500 text-white font-black tracking-widest text-[10px] rounded-xl uppercase shadow-lg shadow-orange-500/20">
                   {SUBJECT_LABELS[exam.subject] ?? exam.subject}
                 </span>
                 <span className="px-4 py-1.5 bg-rose-50 text-rose-500 font-black tracking-widest text-[10px] rounded-xl border border-rose-100 uppercase">
                   {exam.grade_level ? 'Lớp ' + exam.grade_level : 'Dành cho mọi khối lớp'}
                 </span>
                 {exam.is_ai_generated && (
                   <span className="px-4 py-1.5 bg-amber-50 text-amber-600 font-black tracking-widest text-[10px] rounded-xl border border-amber-100 uppercase flex items-center gap-1.5">
                     <Sparkles size={12} /> AI Generated
                   </span>
                 )}
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
                {exam.title}
              </h1>

              <p className="text-gray-400 font-bold text-lg leading-relaxed max-w-2xl opacity-80">
                {exam.description || 'Sẵn sàng chinh phục bài thi này với sự giúp sức từ NebulaAI chưa? Hãy tập trung cao độ nhé!'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-orange-50/50">
                <div className="flex items-center gap-4 group">
                   <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 transition-transform group-hover:scale-110 group-hover:rotate-6">
                     <Clock size={28} />
                   </div>
                   <div>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Thời gian</p>
                     <p className="font-black text-2xl text-gray-800 tracking-tight">{exam.duration_minutes}m</p>
                   </div>
                </div>

                <div className="flex items-center gap-4 group">
                   <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 transition-transform group-hover:scale-110 group-hover:rotate-6">
                     <FileText size={28} />
                   </div>
                   <div>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Số câu hỏi</p>
                     <p className="font-black text-2xl text-gray-800 tracking-tight">{exam.total_questions}c</p>
                   </div>
                </div>

                <div className="flex items-center gap-4 group">
                   <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 transition-transform group-hover:scale-110 group-hover:rotate-6">
                     <Award size={28} />
                   </div>
                   <div>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Điểm đậu</p>
                     <p className="font-black text-2xl text-gray-800 tracking-tight">{exam.pass_score}%</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0 pt-4">
               <button 
                 onClick={handleStart}
                 disabled={isStarting}
                 className="w-full py-7 bg-gradient-to-br from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 disabled:opacity-50 text-white font-black rounded-[2rem] transition-all shadow-2xl shadow-orange-500/25 flex flex-col items-center justify-center gap-1 group active:scale-95"
               >
                 {isStarting ? (
                   <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                   <>
                     <span className="flex items-center gap-3 text-2xl tracking-tight">
                       Bắt đầu thi <Play size={24} fill="currentColor" className="group-hover:scale-110 transition-transform"/>
                     </span>
                     <span className="text-[11px] font-black uppercase tracking-widest opacity-70">Sử dụng 1 lượt luyện đề</span>
                   </>
                 )}
               </button>

               <button className="w-full py-5 bg-white hover:bg-orange-50 text-gray-400 hover:text-orange-500 font-black rounded-[1.5rem] border-2 border-orange-50/50 transition-all flex items-center justify-center gap-3 active:scale-95 text-xs uppercase tracking-widest">
                 <Share2 size={18} /> Chia sẻ với bạn bè
               </button>
            </div>
          </div>
        </div>

        {/* Footer info/tips */}
        <div className="px-6 flex items-center gap-4 text-gray-400 text-sm italic font-bold opacity-60">
           <BookOpen size={18} className="text-orange-300" />
           Lưu ý: Bạn không thể tạm dừng sau khi đã bắt đầu làm bài. Hãy đảm bảo đường truyền ổn định nhé!
        </div>

      </div>
    </div>
  );
}
