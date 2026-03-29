'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  MessageCircle, 
  ChevronUp, 
  ChevronDown, 
  PlusCircle, 
  Search,
  Filter,
  Users,
  Eye,
  Pin,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { formatTimeAgo } from '@/lib/time-util';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
}

interface Topic {
  id: string;
  title: string;
  slug: string;
  content: string;
  author_name: string;
  author_avatar: string;
  category_id: string;
  reply_count: number;
  vote_score: number;
  tags: string[];
  is_pinned: boolean;
  created_at: string;
}

export default function ForumPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catRes, topRes] = await Promise.all([
        apiClient.get('/community/forum/categories'),
        apiClient.get(`/community/forum/topics${selectedCategory ? `?categoryId=${selectedCategory}` : ''}`)
      ]);
      setCategories(catRes.data.data.items || []);
      setTopics(topRes.data.data.items || []);
    } catch (err) {
      console.error('Failed to fetch forum data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Forum Header */}
      <div className="p-6 md:p-8 border-b-2 border-orange-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-white to-orange-50/10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Diễn đàn học tập</span>
             <Sparkles size={20} className="text-orange-400" />
          </h2>
          <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Hỏi bất cứ điều gì, cộng đồng sẽ trả lời bạn! ✨</p>
        </div>
        <Link href="/social/forum/new">
          <button className="h-11 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black shadow-xl shadow-orange-500/20 hover:scale-[1.05] transition-all flex items-center gap-2 active:scale-95 group text-xs">
            <PlusCircle size={16} className="group-hover:rotate-90 transition-transform" /> Đặt câu hỏi mới
          </button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Categories Sidebar */}
        <aside className="w-full lg:w-72 border-r-2 border-orange-50/50 p-6 space-y-6 shrink-0 bg-[#FFF9F5]/30 h-full overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
             <div className="px-2">
                <h3 className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em]">Danh mục</h3>
             </div>
             <nav className="space-y-1.5">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={`group w-full text-left px-5 py-3.5 rounded-2xl font-black text-sm transition-all flex items-center gap-3 border-2 ${!selectedCategory ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20 border-orange-500' : 'bg-white text-gray-500 hover:text-orange-600 border-white hover:border-orange-100 shadow-sm'}`}
                >
                   <Filter size={16} className={!selectedCategory ? 'text-white' : 'text-orange-300 group-hover:rotate-12 transition-transform'} /> Tất cả
                </button>
                {categories.map(cat => (
                   <button 
                     key={cat.id}
                     onClick={() => setSelectedCategory(cat.id)}
                     className={`group w-full text-left px-5 py-3.5 rounded-2xl font-black text-sm transition-all flex items-center gap-3 border-2 ${selectedCategory === cat.id ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20 border-orange-500' : 'bg-white text-gray-500 hover:text-orange-600 border-white hover:border-orange-100 shadow-sm'}`}
                   >
                      <MessageSquare size={16} className={selectedCategory === cat.id ? 'text-white' : 'text-orange-300 group-hover:rotate-12 transition-transform'} /> {cat.name}
                   </button>
                ))}
             </nav>
          </div>

          <div className="p-6 rounded-[2rem] bg-white border-4 border-white shadow-xl shadow-orange-500/5 space-y-3 group">
             <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 font-black mb-1 group-hover:rotate-12 transition-transform text-sm">🛡️</div>
             <h4 className="text-[11px] font-black text-orange-600 uppercase tracking-widest leading-none">Quy tắc</h4>
             <ul className="text-[10px] text-gray-400 space-y-2 font-bold leading-relaxed">
                <li className="flex items-start gap-1">• <span className="text-gray-600">Không spam nội dung</span></li>
                <li className="flex items-start gap-1">• <span className="text-gray-600">Tôn trọng thành viên</span></li>
                <li className="flex items-start gap-1">• <span className="text-gray-600">Tiêu đề rõ ràng</span></li>
             </ul>
          </div>
        </aside>

        {/* Topics List */}
        <div className="flex-1 h-full overflow-y-auto custom-scrollbar px-6 md:px-8 py-8 md:py-10">
          <div className="flex items-center gap-3 bg-[#FFF9F5] p-1 rounded-[1.2rem] border-4 border-white shadow-inner mb-6">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={16} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm chủ đề thảo luận..." 
                  className="w-full bg-white/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-[11px] font-black text-gray-700 placeholder:text-gray-300 focus:ring-4 focus:ring-orange-500/5 transition-all"
                />
             </div>
          </div>

          <div className="space-y-5">
            {isLoading ? (
               [1, 2, 3].map(i => (
                 <div key={i} className="bg-white border-4 border-white rounded-[2rem] p-6 space-y-4 animate-pulse shadow-xl shadow-orange-500/5">
                    <div className="flex gap-3">
                       <div className="w-11 h-11 bg-gray-50 rounded-xl" />
                       <div className="space-y-1.5 py-1.5">
                          <div className="h-3.5 w-40 bg-gray-50 rounded-lg" />
                          <div className="h-2 w-24 bg-gray-50 rounded-lg" />
                       </div>
                    </div>
                 </div>
               ))
            ) : topics.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-[#FFF9F5] rounded-[2rem] border-4 border-white flex items-center justify-center text-orange-200 shadow-inner rotate-3">
                     <MessageCircle size={36} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-black text-gray-900 tracking-tight">Chưa có thảo luận nào</p>
                    <p className="text-gray-400 font-bold max-w-xs mx-auto text-[11px]">Hãy là người đầu tiên đặt câu hỏi ngay!</p>
                  </div>
                  <Link href="/social/forum/new">
                    <button className="h-10 px-6 rounded-lg border-4 border-white bg-orange-50 text-orange-600 font-black shadow-lg hover:bg-orange-100 transition-all active:scale-95 text-xs">Tạo ngay</button>
                  </Link>
               </div>
            ) : (
               topics.map(topic => (
                  <div key={topic.id} className="group bg-white border-4 border-white rounded-[2rem] p-5 hover:border-orange-50 hover:shadow-2xl hover:shadow-orange-500/5 transition-all flex flex-col sm:flex-row gap-5 items-start relative overflow-hidden">
                     {/* Voting */}
                     <div className="flex flex-row sm:flex-col items-center shrink-0 bg-[#FFF9F5] rounded-[1.2rem] p-2 min-w-[48px] group-hover:bg-orange-50 transition-colors border-2 border-orange-50/50 shadow-inner">
                        <button className="text-orange-200 hover:text-orange-500 transition-all hover:scale-125">
                           <ChevronUp size={20} strokeWidth={3} />
                        </button>
                        <span className="font-black text-gray-900 text-base px-1">{topic.vote_score}</span>
                        <button className="text-orange-200 hover:text-gray-900 transition-all hover:scale-125">
                           <ChevronDown size={20} strokeWidth={3} />
                        </button>
                     </div>

                     {/* Content */}
                     <div className="h-full overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8 md:space-y-10 min-h-full">
                        <div className="flex items-center gap-2">
                           {topic.is_pinned && <span className="p-1.5 rounded-lg bg-amber-50 text-amber-500 border border-amber-100 shadow-sm"><Pin size={14} fill="currentColor" /></span>}
                           <Link href={`/social/forum/${topic.slug}`}>
                             <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-orange-500 transition-all tracking-tight truncate">
                               {topic.title}
                             </h3>
                           </Link>
                        </div>

                        {topic.tags && topic.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {topic.tags.map(tag => (
                              <span key={tag} className="px-3 py-1 rounded-xl bg-[#FFF9F5] text-[10px] font-black text-orange-400 border border-orange-50 shadow-sm transition-all hover:bg-orange-500 hover:text-white">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-6 pt-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#FFF9F5] border-2 border-white shadow-sm ring-2 ring-orange-50">
                                 {topic.author_avatar ? <img src={topic.author_avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 font-black">{topic.author_name.charAt(0)}</div>}
                              </div>
                              <span className="text-gray-700">{topic.author_name}</span>
                           </div>
                           <div className="flex items-center gap-2"><Eye size={16} className="text-orange-300" /> {topic.reply_count} phản hồi</div>
                           <div className="flex items-center gap-2 italic opacity-60"><Users size={16} className="text-orange-300" /> {formatTimeAgo(topic.created_at)}</div>
                        </div>
                     </div>
                  </div>
               ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
