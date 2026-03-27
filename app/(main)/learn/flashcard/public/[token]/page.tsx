'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { ArrowLeft, Copy, Play, Layers, BookOpen, Sparkles, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useAuth } from '@/context/auth-context';

interface Flashcard {
  front: string;
  back: string;
  hint?: string;
  image_url?: string;
}

interface SetDetails {
  id: string;
  title: string;
  description: string;
  subject: string;
  card_count: number;
  user_id: string;
  cards: Flashcard[];
}

export default function PublicFlashcardPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const { isAuthenticated } = useAuth();

  const [setData, setSetData] = useState<SetDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCloning, setIsCloning] = useState(false);

  useEffect(() => {
    apiClient.get(`/flashcard/public/${token}`)
      .then(res => setSetData(res.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleClone = async () => {
    if (!isAuthenticated) return router.push('/login?redirect=' + window.location.pathname);
    if (!setData || isCloning) return;

    setIsCloning(true);
    try {
      const { data } = await apiClient.post(`/flashcard/sets/${setData.id}/clone`);
      alert('Đã sao chép bộ thẻ này vào thư viện của bạn! 🎉');
      router.push(`/learn/flashcard/${data.data.id}`);
    } catch {
      alert('Không thể sao chép bộ thẻ này rùi!');
    } finally {
      setIsCloning(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl" />
        <p className="font-black text-orange-600">Đang tải bộ thẻ được chia sẻ...</p>
      </div>
    </div>
  );

  if (!setData) return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 mb-6">
          <BookOpen size={40} />
        </div>
        <h1 className="text-2xl font-black text-gray-800">Bộ thẻ hổng tồn tại rồi!</h1>
        <p className="text-gray-500 font-bold leading-relaxed">Có thể bộ thẻ này đã bị xóa hoặc chuyển sang chế độ riêng tư.</p>
        <Link href="/learn/flashcard" className="inline-block mt-4 px-8 py-3 bg-white border-2 border-gray-100 rounded-2xl font-black shadow-sm hover:border-orange-200 transition-all">Khám phá thư viện</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-10 space-y-12">
        
        {/* Header */}
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
                <span className="text-gray-400 font-bold text-sm bg-white px-3 py-1 rounded-lg border border-gray-50 flex items-center gap-1.5">
                  <User size={12} /> Cộng đồng chia sẻ
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tight leading-tight">{setData.title}</h1>
              {setData.description && <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl">{setData.description}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={handleClone}
              disabled={isCloning}
              className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-orange-200 text-orange-600 rounded-2xl font-black transition-all hover:bg-orange-50 active:scale-95 shadow-lg shadow-orange-500/5 group"
            >
              {isCloning ? (
                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Copy size={20} className="group-hover:rotate-12 transition-transform" /> Sao chép về thư viện</>
              )}
            </button>
            <Link
              href={`/learn/flashcard/study/${setData.id}?preview=true`}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-400 to-rose-500 shadow-xl shadow-orange-500/20 text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95"
            >
              <Play size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" /> 
              Học thử
            </Link>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-100 p-6 rounded-[2rem] flex items-center gap-4">
          <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-lg">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="font-black text-orange-900">Đây là bộ thẻ được chia sẻ công khai!</p>
            <p className="text-sm font-bold text-orange-700/80">Bạn có thể học thử hoặc sao chép về tài khoản cá nhân để lưu lại tiến độ ôn tập SM-2 nhé.</p>
          </div>
        </div>

        {/* Cards List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3 ml-2">
            <div className="p-2 bg-white rounded-xl shadow-sm"><BookOpen className="text-orange-500" size={24} /></div>
            Bản xem trước ({setData.cards.length} thẻ)
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {setData.cards.map((card, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] border-2 border-transparent hover:border-orange-100 transition-all shadow-sm hover:shadow-xl hover:shadow-orange-500/5 flex flex-col gap-4">
                <div className="flex justify-between">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">THẺ SỐ {idx + 1}</span>
                  {card.hint && <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">CÓ GỢI Ý 💡</span>}
                </div>
                <div className="space-y-4">
                  <div className="font-black text-gray-800 text-lg leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{card.front}</ReactMarkdown>
                  </div>
                  <hr className="border-dashed border-gray-100" />
                  <div className="font-bold text-orange-600 leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{card.back}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
