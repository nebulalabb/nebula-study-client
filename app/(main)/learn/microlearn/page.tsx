'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { StreakDisplay } from '@/components/microlearn/StreakDisplay';
import { LessonCard } from '@/components/microlearn/LessonCard';
import { CheckCircle2, GraduationCap, ArrowRight, Sparkles, BookOpen, Target, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function MicrolearnDailyPage() {
  const router = useRouter();
  const [streak, setStreak] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    let redirecting = false;
    try {
       const [sRes, lRes] = await Promise.all([
         apiClient.get('/microlearn/streak'),
         apiClient.get('/microlearn/today')
       ]);
       
       const items = lRes.data.data.items;
       if (items.length === 0 && lRes.data.data.message?.includes('chưa đăng ký')) {
         redirecting = true;
         router.replace('/learn/microlearn/onboarding');
         return;
       }

       setStreak(sRes.data.data);
       setLessons(items);
    } catch (err) {
       console.error(err);
    } finally {
       if (!redirecting) {
         setIsLoading(false);
       }
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLessonCompleted = (isCorrect: boolean | null, gainedStreak: boolean) => {
    // Re-fetch to update streak visually and mark lesson as completed
    fetchData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-20">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-orange-100 rounded-[2rem] flex items-center justify-center animate-bounce shadow-xl shadow-orange-500/10">
            <BookOpen size={40} className="text-orange-500" />
          </div>
          <p className="text-lg font-black text-orange-400 animate-pulse tracking-widest uppercase">Chuẩn bị bài học...</p>
        </div>
      </div>
    );
  }

  const completedCount = lessons.filter(x => x.progress_status === 'completed').length;
  const totalCount = lessons.length;
  const progressPercent = totalCount ? (completedCount / totalCount) * 100 : 0;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      <div className="max-w-6xl mx-auto px-6 pt-12 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Left Area - Streak and Progress */}
        <div className="w-full lg:w-80 shrink-0 space-y-8 sticky top-24">
           {streak && (
             <StreakDisplay 
               currentStreak={streak.current_streak}
               longestStreak={streak.longest_streak}
               totalDays={streak.total_days}
               lastActivityDate={streak.last_activity_date}
             />
           )}

           <div className="bg-white border-2 border-orange-50 p-8 rounded-[2.5rem] shadow-xl shadow-orange-500/5 relative overflow-hidden group">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-orange-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <h3 className="font-black text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20">
                  <Target size={20} />
                </div>
                Mục tiêu hôm nay
              </h3>
              
              <p className="text-sm text-gray-500 font-bold leading-relaxed mb-8 relative z-10">
                Hoàn thành ít nhất <span className="text-orange-600 font-black">1 bài học</span> mỗi ngày để duy trì chuỗi học tập Nebula! ✨
              </p>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <span>Tiến độ bài học</span>
                  <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg">{completedCount} / {totalCount}</span>
                </div>
                <div className="h-4 bg-orange-50 rounded-full overflow-hidden p-1 border border-orange-100/50">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full transition-all duration-1000 shadow-sm" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>
              </div>
           </div>

           <div className="text-center">
              <Link href="/learn/microlearn/onboarding" className="group text-sm font-black text-gray-400 hover:text-orange-500 transition-all inline-flex items-center gap-2 uppercase tracking-widest px-6 py-3 bg-white border-2 border-transparent hover:border-orange-100 hover:shadow-lg rounded-2xl">
                Khám phá chủ đề mới <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
        </div>

        {/* Right Area - Lessons of the Day */}
        <div className="flex-1 w-full space-y-10">
           
           <div className="flex items-center justify-between gap-6 pb-6 border-b-4 border-orange-50">
             <div>
               <div className="flex items-center gap-2 mb-2">
                 <Sparkles className="text-orange-400 animate-pulse" size={20} />
                 <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">Daily Digest</span>
               </div>
               <h1 className="text-4xl font-black text-gray-900 tracking-tight">Bài học hôm nay</h1>
               <p className="text-gray-400 font-bold mt-1">Nâng cấp bản thân chỉ với 5 phút mỗi ngày 🚀</p>
             </div>
             <div className="hidden md:block w-20 h-20 bg-white border-2 border-orange-100 rounded-[2.5rem] flex items-center justify-center rotate-6 shadow-lg shadow-orange-500/5 hover:rotate-0 transition-transform cursor-pointer">
               <Rocket size={32} className="text-orange-500" />
             </div>
           </div>

           {allCompleted && (
             <div className="bg-white border-4 border-emerald-100 p-10 rounded-[3.5rem] text-center shadow-2xl shadow-emerald-500/10 animate-in zoom-in-95 duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50" />
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30 rotate-12">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-emerald-700 mb-3 tracking-tight">Bạn quá xuất sắc! 🎉</h2>
                <p className="text-emerald-600 font-bold max-w-md mx-auto leading-relaxed">
                  Ngọn lửa học tập đã được thắp sáng rực rỡ hôm nay. Hẹn gặp lại bạn vào ngày mai với những bài học thú vị tiếp theo nhé!
                </p>
             </div>
           )}

           <div className="grid grid-cols-1 gap-8">
             {lessons.map(lesson => (
               <LessonCard 
                  key={lesson.id} 
                  lesson={lesson} 
                  onCompleted={handleLessonCompleted} 
               />
             ))}
             {lessons.length === 0 && !allCompleted && (
               <div className="p-20 text-center bg-white border-4 border-dashed border-orange-100 rounded-[3.5rem] shadow-sm">
                 <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen size={32} className="text-orange-200" />
                 </div>
                 <p className="text-xl font-black text-gray-300 tracking-tight mb-6">Lộ trình học tập đang chờ bạn!</p>
                 <Link href="/learn/microlearn/onboarding" className="px-8 py-4 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 shadow-xl shadow-orange-500/20 active:scale-95 transition-all inline-flex items-center gap-2">
                   Đăng ký chủ đề ngay <ArrowRight size={20} />
                 </Link>
               </div>
             )}
           </div>

        </div>

      </div>

    </div>
  );
}
