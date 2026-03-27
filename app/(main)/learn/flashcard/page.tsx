'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { Brain, Plus, Play, CalendarCheck, Clock, Layers, Search, Trash2, Edit, Sparkles, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale/vi';

interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  subject: string;
  card_count: number;
  created_at: string;
}

export default function FlashcardHub() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [dueCount, setDueCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Fetch user sets
    apiClient.get('/flashcard/sets').then((res) => {
      setSets(res.data.data.items);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));

    // Fetch due count
    apiClient.get('/flashcard/review/due?limit=1').then((res) => {
      setDueCount(res.data.data.count);
    }).catch(() => setDueCount(0));
  }, [isAuthenticated]);

  if (isAuthLoading) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl shadow-orange-500/5 text-center border-2 border-orange-50">
          <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <Layers className="text-orange-600" size={40} />
          </div>
          <h1 className="text-3xl font-black mb-4">Học Flashcard</h1>
          <p className="text-gray-500 mb-8 font-medium leading-relaxed">
            Bạn cần đăng nhập để bắt đầu tạo và ôn tập các thẻ bài thông minh cùng NebulaAI.
          </p>
          <Link href="/login" className="block w-full py-4 bg-gradient-to-r from-orange-400 to-rose-500 text-white rounded-2xl font-black shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  const filteredSets = sets.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-10 space-y-12">
        
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-2xl -rotate-6">
                <Layers className="text-orange-600" size={32} />
              </div>
              Thư viện Flashcard
            </h1>
            <p className="text-gray-500 font-bold ml-1">
              ✨ Ôn luyện thông minh · Ghi nhớ dài lâu
            </p>
          </div>

          <Link
            href="/learn/flashcard/create"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-400 to-rose-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 group"
          >
            <Plus size={22} className="group-hover:rotate-90 transition-transform" /> 
            Tạo bộ thẻ mới
          </Link>
        </div>

        {/* ── Due Review Banner ──────────────────────────────────────────────── */}
        {dueCount !== null && (
          <div className={`p-8 rounded-[2.5rem] border-2 shadow-xl shadow-black/5 flex flex-col md:flex-row items-center justify-between gap-8 transition-all relative overflow-hidden ${
            dueCount > 0 
              ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200'
              : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
          }`}>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 relative z-10">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-lg ${
                dueCount > 0 ? 'bg-orange-500 text-white rotate-3' : 'bg-emerald-500 text-white -rotate-3'
              }`}>
                {dueCount > 0 ? <Brain size={32} /> : <CalendarCheck size={32} />}
              </div>
              <div>
                <h2 className={`text-2xl font-black ${dueCount > 0 ? 'text-orange-900' : 'text-emerald-900'}`}>
                  {dueCount > 0 ? `Bạn có ${dueCount} thẻ đến hạn!` : 'Hôm nay sạch bóng thẻ rồi!'}
                </h2>
                <p className={`text-sm font-bold mt-1 opacity-80 ${dueCount > 0 ? 'text-orange-700' : 'text-emerald-700'}`}>
                  {dueCount > 0 
                    ? 'Đừng để kiến thức bay màu nhé, ôn ngay cho nóng thôi nào!' 
                    : 'Bạn đã hoàn thành xuất sắc mục tiêu ôn tập. Nghỉ tay thôi!'}
                </p>
              </div>
            </div>
            {dueCount > 0 && (
              <Link
                href="/learn/flashcard/review"
                className="flex-shrink-0 flex items-center gap-2 px-10 py-4 bg-white text-orange-600 rounded-2xl font-black transition-all shadow-lg hover:bg-orange-600 hover:text-white relative z-10"
              >
                <Play size={20} fill="currentColor" /> Ôn tập ngay
              </Link>
            )}
          </div>
        )}

        {/* ── User Sets Grid ─────────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <BookOpen className="text-orange-500" /> Bộ thẻ của mình
            </h2>
            <div className="relative group max-w-sm w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Tìm bộ thẻ nào..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-white border-2 border-transparent rounded-[1.5rem] font-bold text-gray-700 shadow-sm focus:outline-none focus:border-orange-200 focus:bg-orange-50/20 transition-all"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-100 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : filteredSets.length === 0 ? (
            <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border-4 border-dashed border-orange-100 mt-4">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Layers className="text-orange-200" size={56} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Chưa có Flashcard nào đâu!</h3>
              <p className="text-gray-500 font-bold mb-8 max-w-sm mx-auto">Tải tài liệu lên hoặc nhập nội dung để AI soạn thẻ giúp bạn nhé.</p>
              <Link
                href="/learn/flashcard/create"
                className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
              >
                <Sparkles size={18} /> Soạn thẻ ngay thôi
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSets.map(set => (
                <div key={set.id} className="group relative bg-white rounded-[2.5rem] p-7 border-2 border-transparent transition-all shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 hover:border-orange-100 h-full flex flex-col">
                  
                  {/* Subject Tag */}
                  <div className="flex justify-between items-start mb-5">
                    <span className="px-4 py-1.5 text-xs font-black bg-orange-50 text-orange-600 rounded-full uppercase tracking-widest border border-orange-100">
                      {set.subject || 'Tổng hợp'}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                      <button className="p-2.5 text-gray-400 hover:text-orange-500 rounded-xl hover:bg-orange-50 transition-colors"><Edit size={16} /></button>
                      <button className="p-2.5 text-gray-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  
                  {/* Title & Stats */}
                  <div className="flex-1">
                    <h3 className="font-black text-xl mb-4 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">{set.title}</h3>
                    
                    <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                      <span className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-3 py-1 rounded-lg">
                        <Layers size={14} /> {set.card_count} thẻ
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {formatDistanceToNow(new Date(set.created_at), { locale: vi })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-50 flex gap-3">
                    <Link 
                      href={`/learn/flashcard/study/${set.id}`} 
                      className="flex-1 text-center py-3.5 bg-orange-500 shadow-lg shadow-orange-500/10 text-white font-black text-sm rounded-2xl hover:bg-orange-600 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      Học ngay
                    </Link>
                    <Link 
                      href={`/learn/flashcard/${set.id}`} 
                      className="px-6 py-3.5 bg-gray-50 text-gray-600 font-black text-sm rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                      Sửa
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
