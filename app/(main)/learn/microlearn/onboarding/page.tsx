'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Plus, Check, Play, Sparkles, Rocket, BookOpen, Star, CheckCircle2 } from 'lucide-react';

export default function MicrolearnOnboardingPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/microlearn/topics')
      .then(res => setTopics(res.data.data.items))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleTopic = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const subscribeAndStart = async () => {
    if (selected.size === 0) return;
    setIsSubmitting(true);
    try {
      const promises = Array.from(selected).map(id => apiClient.post('/microlearn/topics/' + id + '/subscribe'));
      await Promise.all(promises);
      router.push('/learn/microlearn');
    } catch (err: any) {
      alert('Lỗi đăng ký: ' + (err.response?.data?.message || err.message));
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-20">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-orange-100 rounded-[2rem] flex items-center justify-center animate-bounce shadow-xl shadow-orange-500/10">
            <Rocket size={40} className="text-orange-500" />
          </div>
          <p className="text-lg font-black text-orange-400 animate-pulse tracking-widest uppercase">Đang tải chủ đề...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-32">
      <div className="max-w-5xl mx-auto px-6 pt-20 space-y-16">
        
        <div className="text-center space-y-6 relative">
           <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-20">
              <Sparkles size={120} className="text-orange-200" />
           </div>
           <div className="flex items-center justify-center gap-2 mb-4">
             <Star className="text-orange-400" size={24} fill="currentColor" />
             <span className="text-[12px] font-black text-orange-400 uppercase tracking-[0.4em]">Personalize Your Path</span>
             <Star className="text-orange-400" size={24} fill="currentColor" />
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none relative z-10">
             Bạn muốn <span className="text-orange-500 underline decoration-orange-200 decoration-8 underline-offset-8">nâng cấp</span> kỹ năng nào?
           </h1>
           <p className="text-xl text-gray-400 font-bold max-w-2xl mx-auto leading-relaxed relative z-10">
             Chọn các chủ đề bạn yêu thích để Nebula chuẩn bị bài học nhỏ 5 phút mỗi ngày cho riêng bạn nhé! ✨
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {topics.map(t => {
             const isSelected = selected.has(t.id);
             const isSubscribed = t.is_subscribed;
             return (
               <button
                 key={t.id}
                 disabled={isSubscribed}
                 onClick={() => toggleTopic(t.id)}
                 className={`text-left group relative p-8 rounded-[3rem] border-4 transition-all duration-300 transform hover:-translate-y-2 ${
                   isSubscribed 
                    ? 'bg-gray-50 border-gray-100 opacity-60 grayscale' 
                    : isSelected 
                      ? 'bg-white border-orange-500 shadow-2xl shadow-orange-500/20 scale-105' 
                      : 'bg-white border-white hover:border-orange-100 shadow-xl shadow-orange-500/5'
                 }`}
               >
                  <div className="flex justify-between items-start mb-6">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform group-hover:rotate-6 ${
                       isSelected ? 'bg-orange-500 text-white shadow-orange-500/30' : 'bg-orange-50 text-orange-500'
                     }`}>
                       {t.icon_url ? <img src={t.icon_url} alt="" className="w-8 h-8 object-contain" /> : <BookOpen size={28} />}
                     </div>
                     <div className={`w-8 h-8 rounded-xl border-4 flex items-center justify-center transition-all ${
                       isSubscribed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : isSelected 
                          ? 'bg-orange-500 border-orange-500 text-white' 
                          : 'border-orange-50 bg-white group-hover:border-orange-200'
                     }`}>
                        {(isSelected || isSubscribed) && <Check size={18} strokeWidth={4} />}
                     </div>
                  </div>
                  <h3 className={`text-2xl font-black mb-3 tracking-tight ${isSelected ? 'text-orange-950' : 'text-gray-900 group-hover:text-orange-600'}`}>{t.name}</h3>
                  <p className="text-sm text-gray-400 font-bold leading-relaxed">{t.description}</p>
                  
                  {isSubscribed && (
                    <div className="mt-6 flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-lg">
                      <CheckCircle2 size={12} /> Đã đăng ký
                    </div>
                  )}
               </button>
             )
           })}
        </div>

        <div className="flex flex-col items-center justify-center gap-6 pt-12">
           <button
             disabled={selected.size === 0 || isSubmitting}
             onClick={subscribeAndStart}
             className="relative group px-16 py-6 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 transition-all shadow-2xl shadow-orange-500/30 text-white font-black rounded-[2.5rem] flex items-center gap-3 text-xl disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
           >
             {isSubmitting ? (
               <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
             ) : (
               <>
                 Khám phá lộ trình học tập <Rocket size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </>
             )}
           </button>
           <p className="text-[12px] font-black text-gray-300 uppercase tracking-widest italic opacity-50">
             Cam kết dành 5 phút mỗi ngày cùng Nebula Study ✨
           </p>
        </div>
      </div>
    </div>
  );
}
