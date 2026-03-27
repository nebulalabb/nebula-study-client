'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { ChevronDown, Trash2, BookOpen, Image as ImageIcon, Clock, AlertCircle, Sparkles, Filter } from 'lucide-react';
import type { SolutionData } from './SolutionDisplay';

interface HistoryItem {
  id: string;
  subject: string;
  question_text?: string;
  question_image_url?: string;
  input_type: 'text' | 'image' | 'mixed';
  solution: string;
  steps?: any[];
  explanation?: string;
  confidence?: number;
  solve_time_ms?: number;
  created_at: string;
}

const SUBJECT_LABELS: Record<string, string> = {
  toán: 'Toán học', lý: 'Vật Lý', hóa: 'Hóa học', sinh: 'Sinh học',
  văn: 'Ngữ Văn', anh: 'Tiếng Anh', sử: 'Lịch Sử', địa: 'Địa Lý',
  general: 'Tổng hợp',
};

function formatTime(isoStr: string) {
  const d = new Date(isoStr);
  return d.toLocaleString('vi-VN', { 
    day: 'numeric', 
    month: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

interface SolverHistoryProps {
  onSelect?: (item: SolutionData & { question_text?: string; question_image_url?: string }) => void;
  refreshKey?: number;
}

export function SolverHistory({ onSelect, refreshKey }: SolverHistoryProps) {
  const [items, setItems] = React.useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [subject, setSubject] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const fetchHistory = async (pg = page, subj = subject) => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = { page: String(pg), limit: '10' };
      if (subj) params.subject = subj;
      const { data } = await apiClient.get('/solver/history', { params });
      setItems(data.data.items);
      setTotalPages(data.meta.pagination.total_pages || 1);
    } catch {
      setError('Không thể tải lịch sử. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => { fetchHistory(1, subject); }, [refreshKey, subject]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Xóa lời giải này khỏi lịch sử nhé?')) return;
    setDeleting(id);
    try {
      await apiClient.delete(`/solver/history/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (expanded === id) setExpanded(null);
    } catch {
      /* ignore */
    } finally {
      setDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-50 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 text-sm font-bold text-rose-500 p-6 bg-rose-50 rounded-[1.5rem] border-2 border-rose-100 shadow-sm">
        <AlertCircle size={20} /> {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subject filter box */}
      <div className="bg-white p-5 rounded-[2rem] border-2 border-orange-50/50 shadow-sm">
        <div className="flex items-center gap-2 mb-4 ml-1">
          <Filter size={14} className="text-orange-400" />
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Bộ lọc môn học</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['', 'toán', 'lý', 'hóa', 'sinh', 'văn', 'anh', 'general'].map((s) => (
            <button
              key={s}
              onClick={() => { setSubject(s); setPage(1); }}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all active:scale-95 shadow-sm ${
                subject === s
                  ? 'bg-orange-500 text-white shadow-orange-500/20'
                  : 'bg-white border-2 border-gray-50 text-gray-500 hover:border-orange-200 hover:text-orange-500'
              }`}
            >
              {s === '' ? 'Tất cả' : SUBJECT_LABELS[s] ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="py-20 text-center bg-white/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-200" />
            <p className="font-black text-gray-400 italic">Lịch sử hiện đang trống trơn...</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li 
                key={item.id} 
                className={`group rounded-[2rem] border-2 transition-all overflow-hidden ${
                  expanded === item.id 
                    ? 'border-orange-200 bg-white shadow-xl shadow-orange-500/5' 
                    : 'border-transparent bg-white hover:border-orange-100 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Header row */}
                <div
                  role="button"
                  tabIndex={0}
                  className={`w-full flex items-center gap-4 px-6 py-5 text-left transition-colors cursor-pointer ${expanded === item.id ? 'bg-orange-50/30' : ''}`}
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setExpanded(expanded === item.id ? null : item.id);
                    }
                  }}
                >
                  <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center transition-transform group-hover:rotate-6 ${
                    item.input_type === 'image'
                      ? 'bg-rose-100 text-rose-500'
                      : 'bg-orange-100 text-orange-500'
                  }`}>
                    {item.input_type === 'image' ? <ImageIcon size={22} /> : <BookOpen size={22} />}
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-base font-black truncate text-gray-800 tracking-tight leading-tight">
                      {item.question_text
                        ? item.question_text.slice(0, 100) + (item.question_text.length > 100 ? '…' : '')
                        : '📷 Bài tập từ hình ảnh'}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="px-2 py-0.5 bg-orange-50 text-[10px] font-black text-orange-600 rounded-md whitespace-nowrap uppercase tracking-wider">
                        {SUBJECT_LABELS[item.subject] ?? item.subject}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 whitespace-nowrap">
                        <Clock size={12} /> {formatTime(item.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      disabled={deleting === item.id}
                      className="p-3 rounded-xl text-gray-300 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-40 transition-all opacity-0 group-hover:opacity-100"
                    >
                      {deleting === item.id ? <div className="w-4 h-4 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" /> : <Trash2 size={18} />}
                    </button>
                    <div className={`p-1.5 rounded-lg text-gray-300 transition-all ${expanded === item.id ? 'rotate-180 bg-orange-100 text-orange-500' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                {/* Expanded solution preview */}
                {expanded === item.id && (
                  <div className="px-8 pb-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 group/content">
                       <p className="text-sm font-bold text-gray-600 leading-relaxed line-clamp-[8]">
                        {item.solution}
                      </p>
                      {item.explanation && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <p className="text-xs font-black text-orange-600 flex items-center gap-2">
                            <Sparkles size={14} /> {item.explanation}
                          </p>
                          {onSelect && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onSelect(item as any); }}
                              className="px-4 py-2 bg-white hover:bg-orange-500 hover:text-white border-2 border-orange-100 hover:border-orange-500 text-orange-600 text-xs font-black rounded-xl transition-all shadow-sm active:scale-95"
                            >
                              Xem chi tiết
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 pt-6">
          <button 
            disabled={page <= 1} 
            onClick={() => { setPage(page - 1); fetchHistory(page - 1); }} 
            className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-gray-100 bg-white disabled:opacity-20 hover:border-orange-200 hover:text-orange-500 transition-all shadow-sm active:scale-90"
          >
            <ChevronDown size={24} className="rotate-90" />
          </button>
          
          <div className="px-5 py-2.5 bg-white border-2 border-orange-50 rounded-2xl text-xs font-black text-gray-400">
            Trang <span className="text-orange-500">{page}</span> / {totalPages}
          </div>
          
          <button 
            disabled={page >= totalPages} 
            onClick={() => { setPage(page + 1); fetchHistory(page + 1); }} 
            className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-gray-100 bg-white disabled:opacity-20 hover:border-orange-200 hover:text-orange-500 transition-all shadow-sm active:scale-90"
          >
            <ChevronDown size={24} className="-rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
}
