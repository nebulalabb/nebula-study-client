'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { FileText, Plus, Search, Tag, Clock, Pin, FileDigit, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale/vi';

interface Note {
  id: string;
  title: string;
  source_type: string;
  word_count: number;
  tags: string[];
  is_pinned: boolean;
  created_at: string;
}

export default function NotesHub() {
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    
    apiClient.get(`/note${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`)
      .then((res) => {
        setNotes(res.data.data.items);
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
  }, [isAuthenticated, searchQuery]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border-2 border-orange-50 p-12 rounded-[3rem] shadow-2xl shadow-orange-500/5 text-center space-y-8">
          <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-lg rotate-3">
            <FileText size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">AI Note & Summary</h1>
          <p className="text-gray-400 font-bold leading-relaxed">Đăng nhập để tóm tắt và quản lý ghi chú thông minh của bạn cùng Nebula Study ✨</p>
          <Link href="/login" className="block w-full px-8 py-4 bg-orange-500 text-white rounded-2xl font-black hover:bg-orange-600 shadow-xl shadow-orange-500/20 active:scale-95 transition-all text-lg">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24 font-medium">
      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-4 border-orange-50">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-orange-400 animate-pulse" size={20} />
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">AI Summary Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center gap-4 text-gray-950">
              <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-xl shadow-orange-500/20 rotate-3">
                <FileText size={32} />
              </div>
              Trích xuất trí tuệ
            </h1>
            <p className="text-gray-400 font-bold max-w-lg mt-4 leading-relaxed">
              Tóm tắt thông minh tài liệu và bài giảng phức tạp thành ý chính súc tích trong vài giây. 🚀
            </p>
          </div>

          <Link
            href="/learn/notes/new"
            className="group flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-black transition-all shadow-2xl shadow-orange-500/20 active:scale-95 text-lg"
          >
            <Plus size={22} className="group-hover:rotate-90 transition-transform" /> Tóm tắt tài liệu mới
          </Link>
        </div>

        {/* Library Area */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-gray-900 border-l-8 border-orange-500 pl-4">
              📚 Thư viện ghi chú
            </h2>
            
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm tiêu đề ghi chú..." 
                className="w-full pl-12 pr-6 py-4 bg-white border-4 border-orange-50 rounded-[1.5rem] text-sm font-black focus:outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all shadow-sm hover:shadow-orange-500/5 placeholder:text-gray-300"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-white border-2 border-orange-50 rounded-[2.5rem] animate-pulse relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-50/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20 bg-white border-4 border-dashed border-orange-100 rounded-[3.5rem] shadow-sm">
              <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-orange-200">
                <FileText size={48} />
              </div>
              <h3 className="text-2xl font-black text-gray-300 mb-4 tracking-tight">Chưa có ghi chú nào</h3>
              <p className="text-gray-400 font-bold max-w-xs mx-auto mb-8">Dán văn bản hoặc tải file PDF để AI bắt đầu "chắt lọc" kiến thức cho bạn.</p>
              <Link href="/learn/notes/new" className="inline-flex items-center gap-2 px-8 py-4 bg-orange-50 text-orange-600 font-black rounded-2xl hover:bg-orange-100 transition-all">
                Thử ngay <ArrowRight size={20} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {notes.map(note => (
                <Link key={note.id} href={`/learn/notes/${note.id}`} className="group relative flex flex-col p-8 bg-white rounded-[2.5rem] border-2 border-orange-50 transition-all hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-orange-100 overflow-hidden">
                  
                  {/* Background Decoration */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  {note.is_pinned && (
                    <div className="absolute top-6 right-6 w-10 h-10 bg-orange-500 text-white rounded-2xl flex items-center justify-center rotate-3 shadow-lg shadow-orange-500/20">
                      <Pin size={18} className="fill-current" />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-orange-400 uppercase tracking-widest">
                       <BookOpen size={12} /> {note.source_type}
                    </div>
                    <h3 className="font-black text-xl mb-6 line-clamp-2 text-gray-900 group-hover:text-orange-600 transition-colors leading-tight tracking-tight">
                      {note.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {note.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border flex items-center gap-1 ${
                           i % 2 === 0 ? 'bg-orange-50 border-orange-100 text-orange-500' : 'bg-rose-50 border-rose-100 text-rose-500'
                        }`}>
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="px-2 py-1 text-[10px] font-bold text-gray-300">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex items-center justify-between text-[11px] font-black text-gray-300 border-t border-orange-50/50 group-hover:border-orange-200 group-hover:text-gray-400 transition-colors uppercase tracking-[0.1em]">
                    <span className="flex items-center gap-1.5"><FileDigit size={14} className="text-orange-200 group-hover:text-orange-400" /> {note.word_count || 0} từ</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-orange-200 group-hover:text-orange-400" /> {formatDistanceToNow(new Date(note.created_at), { addSuffix: true, locale: vi })}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
