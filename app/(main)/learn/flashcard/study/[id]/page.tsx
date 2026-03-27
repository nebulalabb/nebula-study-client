'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { FlipCard } from '@/components/FlipCard';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, RotateCcw, Frown, Meh, Smile, PartyPopper, Sparkles, BookOpen } from 'lucide-react';
type ReviewRating = 'easy' | 'medium' | 'hard' | 'again';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

interface SetDetails {
  id: string;
  title: string;
  cards: Flashcard[];
}

export default function FlashcardStudyPage() {
  const params = useParams();
  const router = useRouter();
  const setId = params.id as string;

  const [setData, setSetData] = useState<SetDetails | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    apiClient.get(`/flashcard/sets/${setId}`)
      .then(res => {
        setSetData(res.data.data);
        if (res.data.data.cards.length === 0) setIsDone(true);
      })
      .catch(() => {
        // Handle error or set setData to null
      })
      .finally(() => setIsLoading(false));
  }, [setId]);

  const handleRating = async (rating: ReviewRating) => {
    if (!setData || isSubmitting) return;
    setIsSubmitting(true);
    const cardId = setData.cards[currentIndex]!.id;

    try {
      // Gửi kết quả SM-2
      await apiClient.post('/flashcard/review/submit', { card_id: cardId, rating });
      
      // Chuyển thẻ tiếp theo
      if (currentIndex < setData.cards.length - 1) {
        setIsFlipped(false);
        setCurrentIndex(i => i + 1);
      } else {
        setIsDone(true);
      }
    } catch {
      alert('Không thể lưu kết quả review. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl" />
        <p className="font-black text-orange-600">Đang chuẩn bị thẻ bài...</p>
      </div>
    </div>
  );
  
  if (!setData) return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <p className="text-rose-500 font-bold text-lg underline">Bộ thẻ không tồn tại rồi!</p>
        <Link href="/learn/flashcard" className="inline-block px-6 py-3 bg-gray-100 rounded-xl font-bold">Quay lại Hub</Link>
      </div>
    </div>
  );

  if (isDone) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-12 text-center shadow-xl shadow-orange-500/5 border-2 border-orange-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-rose-500" />
          
          <div className="w-28 h-28 bg-emerald-100 text-emerald-500 rounded-[2rem] mx-auto flex items-center justify-center mb-8 rotate-3 shadow-lg">
            <PartyPopper size={56} />
          </div>
          
          <h1 className="text-4xl font-black mb-4 tracking-tight">Tuyệt vời quá!</h1>
          <p className="text-gray-500 font-bold text-lg leading-relaxed mb-10 max-w-sm mx-auto">
            Bạn đã hoàn thành phiên học bộ thẻ <strong>{setData.title}</strong> cực kỳ xuất sắc!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button 
              onClick={() => { setCurrentIndex(0); setIsDone(false); setIsFlipped(false); }} 
              className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-100 transition-all group"
            >
              <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" /> Học lại lần nữa
            </button>
            <Link 
              href="/learn/flashcard" 
              className="px-8 py-4 bg-gradient-to-r from-orange-400 to-rose-500 shadow-lg shadow-orange-500/20 text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <BookOpen size={20} /> Về Thư viện
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const card = setData.cards[currentIndex]!;
  const progress = ((currentIndex + 1) / setData.cards.length) * 100;

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-10">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col min-h-[90vh]">
        
        {/* ── Header / Progress ─────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Link href="/learn/flashcard" className="p-3 bg-white hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded-2xl shadow-sm transition-all border border-transparent hover:border-orange-100">
              <ArrowLeft size={24} />
            </Link>
            <div className="hidden md:block">
              <h2 className="text-xl font-black tracking-tight truncate max-w-[300px]">{setData.title}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đang học tập</p>
            </div>
          </div>
          
          <div className="flex-1 bg-white p-6 rounded-[2rem] shadow-sm border border-orange-50/50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-black text-orange-600">Tiến độ buổi học</span>
              <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-black">
                {currentIndex + 1} / {setData.cards.length} thẻ
              </span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden p-0.5 border border-gray-50">
              <div 
                className="bg-gradient-to-r from-orange-400 to-rose-500 h-full transition-all duration-700 rounded-full shadow-lg" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        </div>

        {/* ── Card Area ──────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full mb-10">
          <FlipCard
            key={card.id}
            front={card.front}
            back={card.back}
            hint={card.hint}
            onFlip={setIsFlipped}
          />

          {/* ── Rating Buttons ───────────────────────────────────────────────── */}
          <div className={`w-full mt-12 transition-all duration-700 ${isFlipped ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95 pointer-events-none'}`}>
            <div className="text-center mb-6">
              <span className="px-5 py-2 bg-white rounded-full text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] shadow-sm border border-gray-50">
                Bạn nhớ thẻ này thế nào?
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'again', icon: RotateCcw, label: 'Quên rùi', delay: 'Sớm nè', color: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-500 hover:text-white', emoji: '😣' },
                { id: 'hard', icon: Frown, label: 'Hơi khó', delay: '1 ngày', color: 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-500 hover:text-white', emoji: '😕' },
                { id: 'medium', icon: Meh, label: 'Bình thường', delay: '3 ngày', color: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white', emoji: '😐' },
                { id: 'easy', icon: Smile, label: 'Dễ ợt', delay: '7 ngày', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-500 hover:text-white', emoji: '😎' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleRating(opt.id as ReviewRating)}
                  disabled={isSubmitting}
                  className={`flex flex-col items-center justify-center p-5 rounded-[2rem] border-2 transition-all group active:scale-90 ${opt.color} shadow-sm`}
                >
                  <span className="text-2xl mb-2 group-hover:scale-125 transition-transform">{opt.emoji}</span>
                  <span className="font-black text-sm mb-1">{opt.label}</span>
                  <span className="text-[10px] uppercase font-black opacity-60 tracking-widest">{opt.delay}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
