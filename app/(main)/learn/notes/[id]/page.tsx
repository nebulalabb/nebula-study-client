'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2, Pin, Tag, Download, BookText, Sparkles, Clock, FileDigit, Calendar, Check, X } from 'lucide-react';
import { SummaryResult } from '@/components/SummaryResult';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale/vi';

interface NoteDetail {
  id: string;
  title: string;
  source_type: string;
  source_content: string;
  source_url: string;
  word_count: number;
  tags: string[];
  is_pinned: boolean;
  created_at: string;
  summary: {
    short_summary: string;
    bullet_points: string[];
    keywords: string[];
    full_summary: string | null;
  };
}

export default function NoteViewPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;

  const [note, setNote] = useState<NoteDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  useEffect(() => {
    apiClient.get(`/note/${noteId}`)
      .then(res => {
        setNote(res.data.data);
        setTitleInput(res.data.data.title);
      })
      .finally(() => setIsLoading(false));
  }, [noteId]);

  const handleUpdate = async (updates: Partial<NoteDetail>) => {
    try {
      const { data } = await apiClient.patch(`/note/${noteId}`, updates);
      setNote(prev => prev ? { ...prev, ...data.data } : null);
      if (updates.title) setIsEditingTitle(false);
    } catch {
      alert('Không thể cập nhật ghi chú.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Xóa bản tóm tắt này? Thao tác không thể phục hồi.')) return;
    try {
      await apiClient.delete(`/note/${noteId}`);
      router.push('/learn/notes');
    } catch {
      alert('Xóa thất bại.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-20">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-orange-100 rounded-[2rem] flex items-center justify-center animate-bounce shadow-xl shadow-orange-500/10">
            <BookText size={40} className="text-orange-500" />
          </div>
          <p className="text-lg font-black text-orange-400 animate-pulse tracking-widest uppercase">Đang tải tài liệu...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-20">
        <div className="bg-white p-12 rounded-[3.5rem] border-2 border-rose-50 text-center shadow-xl shadow-rose-500/5">
           <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <X size={32} />
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-2">Không tìm thấy ghi chú</h2>
           <p className="text-gray-400 font-bold mb-8">Ghi chú không tồn tại hoặc đã bị xóa bạn ơi 😭</p>
           <Link href="/learn/notes" className="px-8 py-3 bg-orange-500 text-white font-black rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
             Quay lại thư viện
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      <div className="max-w-6xl mx-auto px-6 pt-12 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-8 border-b-4 border-orange-50">
          <div className="flex items-start gap-6">
            <Link href="/learn/notes" className="p-4 bg-white hover:bg-orange-50 border-2 border-orange-50 hover:border-orange-100 rounded-2xl transition-all shadow-sm hover:shadow-lg active:scale-95">
              <ArrowLeft size={24} className="text-orange-500" />
            </Link>
            <div className="space-y-4">
              
              {/* Title Editing */}
              <div className="flex items-center gap-3">
                {isEditingTitle ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in slide-in-from-left-4 duration-300">
                    <input 
                      autoFocus
                      value={titleInput} 
                      onChange={e => setTitleInput(e.target.value)}
                      className="text-3xl md:text-4xl font-black bg-white border-4 border-orange-100 px-6 py-2 rounded-2xl focus:border-orange-500 focus:outline-none shadow-inner"
                      onKeyDown={e => e.key === 'Enter' && handleUpdate({ title: titleInput })}
                    />
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleUpdate({ title: titleInput })} className="px-4 py-2 bg-orange-500 text-white rounded-xl font-black hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all flex items-center gap-1">
                        <Check size={16} strokeWidth={4} /> Lưu
                      </button>
                      <button onClick={() => setIsEditingTitle(false)} className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl font-black hover:bg-gray-200 transition-all">Hủy</button>
                    </div>
                  </div>
                ) : (
                  <h1 className="text-3xl md:text-4xl font-black tracking-tighter group flex items-center gap-4 text-gray-950">
                    {note.title}
                    <button onClick={() => setIsEditingTitle(true)} className="opacity-0 group-hover:opacity-100 p-2 bg-orange-50 text-orange-400 hover:text-orange-600 rounded-xl transition-all shadow-sm">
                      <Edit2 size={18} />
                    </button>
                  </h1>
                )}
              </div>

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">
                <span className="px-3 py-1 bg-orange-500 text-white rounded-lg shadow-lg shadow-orange-500/10">
                  {note.source_type}
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-orange-50"><Calendar size={14} className="text-orange-300" /> {format(new Date(note.created_at), 'HH:mm - dd/MM/yyyy')}</span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-orange-50"><FileDigit size={14} className="text-orange-300" /> {note.word_count || 0} từ gốc</span>
              </div>
            </div>
          </div>

          {/* Combined Actions */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-[2rem] border-2 border-orange-50 shadow-xl shadow-orange-500/5">
            <button 
              onClick={() => handleUpdate({ is_pinned: !note.is_pinned })} 
              className={`p-4 rounded-xl transition-all shadow-sm transform active:scale-90 ${note.is_pinned ? 'bg-orange-500 text-white shadow-orange-500/20' : 'bg-gray-50 text-gray-300 hover:text-orange-400 hover:bg-orange-50'}`}
              title={note.is_pinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
            >
              <Pin size={20} className={note.is_pinned ? 'fill-current' : ''} />
            </button>
            {note.source_url && (
              <a href={note.source_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-4 bg-orange-50 text-orange-600 font-black rounded-xl hover:bg-orange-100 transition-all text-sm group">
                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> <span className="hidden sm:inline">File gốc</span>
              </a>
            )}
            <button onClick={handleDelete} className="p-4 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-90">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          
          {/* Main Content Area (Summary) */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-3 text-gray-900 tracking-tight">
                <div className="p-2.5 bg-orange-100 text-orange-500 rounded-2xl shadow-sm rotate-3">
                  <Sparkles size={24} />
                </div>
                Trí tuệ chắt lọc từ AI
              </h2>
            </div>
            
            <SummaryResult 
              shortSummary={note.summary.short_summary}
              bulletPoints={note.summary.bullet_points}
              keywords={note.summary.keywords}
            />
          </div>

          {/* Sidebar (Original Context) */}
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            {note.source_content && (
              <div className="bg-white rounded-[3rem] p-10 border-2 border-orange-50 shadow-2xl shadow-orange-500/5 h-[32rem] flex flex-col relative group">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-bl-[2.5rem] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                
                <h3 className="text-xs font-black text-orange-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3 relative z-10">
                  <div className="p-1.5 bg-orange-500 text-white rounded-lg shadow-sm">
                    <BookText size={16} />
                  </div>
                  Nội dung gốc
                </h3>
                <div className="flex-1 overflow-y-auto text-sm text-gray-500 dark:text-zinc-400 leading-relaxed pr-4 custom-scrollbar font-bold relative z-10">
                  {note.source_content}
                </div>
              </div>
            )}

            <div className="bg-white rounded-[3rem] p-10 border-2 border-orange-50 shadow-2xl shadow-orange-500/5 transition-all hover:border-orange-100">
              <h3 className="text-xs font-black text-orange-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <div className="p-1.5 bg-orange-500 text-white rounded-lg shadow-sm">
                  <Tag size={16} />
                </div>
                Gắn thẻ phân loại
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {note.tags.map((tag, i) => (
                  <span key={i} className={`px-4 py-2 rounded-xl text-sm font-black transition-all hover:-translate-y-1 ${
                    i % 2 === 0 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    #{tag}
                  </span>
                ))}
                {note.tags.length === 0 && <span className="text-sm text-gray-300 italic font-bold">Không có thẻ tag nào</span>}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
