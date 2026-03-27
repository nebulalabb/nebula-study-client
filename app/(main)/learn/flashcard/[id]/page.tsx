'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Plus, Edit2, Trash2, BookOpen, Layers, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

interface SetDetails {
  id: string;
  title: string;
  description: string;
  subject: string;
  cards: Flashcard[];
}

export default function FlashcardManagePage() {
  const params = useParams();
  const router = useRouter();
  const setId = params.id as string;

  const [setData, setSetData] = useState<SetDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Quick form for manual card adding
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    apiClient.get(`/flashcard/sets/${setId}`)
      .then(res => setSetData(res.data.data))
      .catch(() => {
        // Handle error
      })
      .finally(() => setIsLoading(false));
  }, [setId]);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front || !back) return;
    setIsAdding(true);
    try {
      const { data } = await apiClient.post(`/flashcard/sets/${setId}/cards`, {
        cards: [{ front, back }]
      });
      const newCard = data.data.cards[0];
      setSetData(prev => prev ? { ...prev, cards: [...prev.cards, newCard] } : null);
      setFront('');
      setBack('');
    } catch {
      alert('Không thể thêm thẻ nè, thử lại nhé!');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSet = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa bộ thẻ này không? Hành động này không thể hoàn tác đâu nha!')) return;
    try {
      await apiClient.delete(`/flashcard/sets/${setId}`);
      router.push('/learn/flashcard');
    } catch {
      alert('Không thể xóa bộ thẻ rùi :(');
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl" />
        <p className="font-black text-orange-600">Đang tải chi tiết bộ thẻ...</p>
      </div>
    </div>
  );

  if (!setData) return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6 text-center">
      <div className="space-y-4">
        <p className="text-rose-500 font-black text-xl">Bộ thẻ không tồn tại rùi!</p>
        <Link href="/learn/flashcard" className="inline-block px-8 py-3 bg-white border-2 border-gray-100 rounded-2xl font-black shadow-sm">Quay lại Thư viện</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-10 space-y-12">
        
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="flex items-start gap-5">
            <Link href="/learn/flashcard" className="p-3 mt-1 bg-white hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded-2xl shadow-sm transition-all border border-transparent hover:border-orange-100 shrink-0">
              <ArrowLeft size={24} />
            </Link>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 text-xs font-black bg-orange-100 text-orange-600 rounded-full uppercase tracking-widest border border-orange-200/50 shadow-sm">
                  {setData.subject || 'Tổng hợp'}
                </span>
                <span className="text-gray-400 font-bold text-sm bg-white px-3 py-1 rounded-lg border border-gray-50">{setData.cards.length} thẻ bài</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight leading-tight">{setData.title}</h1>
              {setData.description && <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl">{setData.description}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/learn/flashcard/study/${setId}`}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-400 to-rose-500 shadow-xl shadow-orange-500/20 text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95"
            >
              <Play size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" /> 
              Học ngay
            </Link>
            <button 
              onClick={handleDeleteSet} 
              className="p-4 text-gray-400 hover:text-rose-500 bg-white hover:bg-rose-50 rounded-2xl shadow-sm border border-transparent hover:border-rose-100 transition-all" 
              title="Xóa bộ thẻ"
            >
              <Trash2 size={22} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* ── Cards List (2/3 width) ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-3 ml-2">
              <div className="p-2 bg-white rounded-xl shadow-sm"><BookOpen className="text-orange-500" size={24} /></div>
              Danh sách thẻ bài
            </h2>

            {setData.cards.length === 0 ? (
              <div className="p-12 text-center bg-white/50 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-orange-100">
                <Layers className="text-orange-200 mx-auto mb-4" size={48} />
                <p className="font-bold text-gray-500">Chưa có thẻ nào trong bộ này cả!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {setData.cards.map((card, idx) => (
                  <div key={card.id} className="group relative p-8 bg-white rounded-[2rem] border-2 border-transparent hover:border-orange-100 transition-all shadow-sm hover:shadow-xl hover:shadow-orange-500/5 flex flex-col md:flex-row gap-8">
                    <div className="shrink-0 w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-sm font-black text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors rotate-3">
                      {idx + 1}
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 flex-1 text-sm prose prose-sm max-w-none font-medium">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Mặt trước</p>
                        <div className="text-gray-800 font-bold text-base leading-relaxed">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{card.front}</ReactMarkdown>
                        </div>
                      </div>
                      <div className="md:pl-8 md:border-l-2 md:border-dashed md:border-orange-50">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Mặt sau</p>
                        <div className="text-orange-600 font-bold text-base leading-relaxed">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{card.back}</ReactMarkdown>
                        </div>
                        {card.hint && (
                          <div className="mt-4 flex items-center gap-2 p-2 px-3 bg-amber-50 rounded-xl border border-amber-100 w-fit">
                            <span className="text-[10px]">💡</span>
                            <span className="text-xs font-bold text-amber-700">{card.hint}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Side Actions (1/3 width) ───────────────────────────────────── */}
          <div className="space-y-8">
            {/* Add Card Form */}
            <div className="p-8 bg-white rounded-[2.5rem] border-2 border-orange-50 shadow-xl shadow-orange-500/5 sticky top-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-orange-600">
                <Plus size={24} className="p-1 bg-orange-100 rounded-lg" /> Thêm thẻ mới
              </h3>
              
              <form onSubmit={handleAddCard} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mặt trước</label>
                  <textarea 
                    value={front} onChange={e => setFront(e.target.value)} required
                    placeholder="VD: Định nghĩa về Photosynthesis..." 
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 text-sm font-bold focus:outline-none focus:border-orange-200 focus:bg-white transition-all shadow-sm resize-none"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mặt sau</label>
                  <textarea 
                    value={back} onChange={e => setBack(e.target.value)} required
                    placeholder="VD: Quá trình quang hợp là..." 
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 text-sm font-bold focus:outline-none focus:border-orange-200 focus:bg-white transition-all shadow-sm resize-none"
                    rows={4}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isAdding || !front || !back} 
                  className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                  {isAdding ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Sparkles size={18} className="group-hover:rotate-12 transition-transform" /> Thêm vào bộ thẻ</>
                  )}
                </button>
              </form>
              
              <p className="mt-6 text-[10px] text-gray-400 font-bold text-center leading-relaxed">
                🚀 Mẹo: Bạn có thể sử dụng Markdown và LaTeX $$x^2$$ cho các công thức Toán lý nhé!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
