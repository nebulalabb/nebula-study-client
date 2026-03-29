'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  LayoutGrid, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  PlusCircle,
  Users2
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function SocialHubPage() {
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await apiClient.get('/community/forum/topics?limit=3');
        setTrendingTopics(res.data.data.items || []);
      } catch (err) {
        console.error('Failed to fetch trending topics:', err);
      }
    };
    fetchTrending();
  }, []);

  const hubs = [
    {
      title: 'Diễn đàn / Forum',
      description: 'Nơi đặt câu hỏi, thảo luận bài tập và chia sẻ kiến thức theo chủ đề.',
      icon: MessageSquare,
      iconColor: 'text-purple-500',
      href: '/social/forum',
      color: 'bg-purple-50 hover:border-purple-200',
      action: 'Tham gia thảo luận'
    },
    {
      title: 'Bảng tin / Feed',
      description: 'Cập nhật hoạt động học tập, chia sẻ khoảnh khắc và hình ảnh cùng bạn bè.',
      icon: LayoutGrid,
      iconColor: 'text-orange-500',
      href: '/social/feed',
      color: 'bg-orange-50 hover:border-orange-200',
      action: 'Xem bảng tin'
    },
    {
      title: 'Bạn bè & Nhắn tin',
      description: 'Kết nối với bạn học và trao đổi trực tiếp qua tin nhắn thời gian thực.',
      icon: Users2,
      iconColor: 'text-indigo-500',
      href: '/social/friends',
      color: 'bg-indigo-50 hover:border-indigo-200',
      action: 'Quản lý bạn bè'
    }
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-10 relative">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="space-y-0.5">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Cộng đồng Nebula HUB!</span> 🌟
            </h2>
            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Học tập hiệu quả hơn khi có bạn đồng hành</p>
        </div>
        <Link href="/social/feed?create=true">
            <button className="h-12 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black shadow-xl shadow-orange-500/20 hover:scale-[1.05] transition-all flex items-center gap-2 active:scale-95 group text-sm">
               <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" /> Tạo bài viết mới
            </button>
        </Link>
      </div>

      {/* Hub Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hubs.map((hub, idx) => (
          <Link 
            key={idx} 
            href={hub.href}
            className={`group p-6 rounded-[2.5rem] border-4 border-white ${hub.color} hover:bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-500`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="w-16 h-16 rounded-[1.8rem] bg-white shadow-xl shadow-gray-500/5 flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                <hub.icon size={24} className={hub.iconColor} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">{hub.title}</h3>
              <p className="text-gray-400 font-bold text-[11px] leading-relaxed px-1">
                {hub.description}
              </p>
            </div>
            <div className="pt-1 flex items-center gap-2 text-orange-500 font-black text-[9px] group-hover:gap-4 transition-all uppercase tracking-[0.2em]">
              {hub.action} <ArrowRight size={14} strokeWidth={3} className="text-rose-500" />
            </div>
          </Link>
        ))}
      </div>

      {/* Trending & Engagement section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white rounded-[2.5rem] border-4 border-orange-50/50 p-6 space-y-6 shadow-xl shadow-orange-500/5 hover:border-orange-100 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full blur-2xl -mr-12 -mt-12" />
            <div className="flex items-center gap-3 relative z-10">
               <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <TrendingUp size={18} />
               </div>
               <h3 className="text-lg font-black text-gray-900 tracking-tight">Thảo luận nổi bật</h3>
            </div>
            <div className="space-y-2 relative z-10">
               {trendingTopics.length > 0 ? trendingTopics.map((topic, i) => (
                  <Link 
                    key={topic.id} 
                    href={`/social/forum/${topic.slug}`}
                    className="flex items-center justify-between p-3.5 rounded-[1.2rem] bg-[#FFF9F5] hover:bg-white border-2 border-transparent hover:border-orange-100 hover:shadow-lg transition-all cursor-pointer group/item"
                  >
                     <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white border-2 border-orange-50 flex items-center justify-center font-black text-[9px] text-orange-400 group-hover/item:bg-orange-500 group-hover/item:text-white transition-all shadow-sm">#{i + 1}</div>
                        <p className="font-black text-xs text-gray-700 truncate max-w-[200px] group-hover/item:text-orange-600 transition-colors uppercase tracking-tight">{topic.title}</p>
                     </div>
                     <ArrowRight size={14} className="text-gray-300 group-hover/item:text-orange-500 group-hover/item:translate-x-1 transition-all" />
                  </Link>
               )) : (
                  <div className="p-6 text-center">
                     <p className="text-gray-300 font-black text-[9px] uppercase tracking-widest italic py-4">Chưa có thảo luận nổi bật nào...</p>
                  </div>
               )}
            </div>
         </div>

         <div className="bg-gradient-to-br from-orange-400 to-rose-500 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-center shadow-2xl shadow-orange-500/20 group hover:scale-[1.01] transition-transform">
            <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 group-hover:rotate-45 group-hover:scale-125 transition-transform duration-700">
               <Sparkles size={100} />
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-3">
               <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest border border-white/30 text-white">
                  🔥 Đang diễn ra
               </div>
               <h3 className="text-2xl font-black leading-tight tracking-tighter">Cùng nhau bứt phá! 🚀</h3>
               <p className="text-orange-50 font-bold text-sm max-w-[280px] leading-relaxed opacity-90">
                  Tham gia thảo luận nhóm, giải bài tập và nhận XP bứt phá bảng xếp hạng.
               </p>
               <Link href="/social/forum">
                  <button className="h-10 px-5 rounded-lg bg-white text-orange-600 font-black shadow-xl hover:bg-orange-50 transition-all active:scale-95 flex items-center gap-2 text-xs">
                     Khám phá ngay <ArrowRight size={14} />
                  </button>
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
