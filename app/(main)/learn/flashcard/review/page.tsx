'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { FlipCard } from '@/components/FlipCard';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, RotateCcw, Frown, Meh, Smile, PartyPopper, Brain, BookOpen } from 'lucide-react';
type ReviewRating = 'easy' | 'medium' | 'hard' | 'again';

interface DueCard {
  schedule_id: string;
  flashcard_id: string;
  set_title: string;
  front: string;
  back: string;
  hint?: string;
  repetition: number;
}

export default function FlashcardReviewPage() {
  const router = useRouter();

  const [cards, setCards] = useState<DueCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    // Fetch maximum 100 cards for a review session
    apiClient.get('/flashcard/review/due?limit=100')
      .then(res => {
        setCards(res.data.data.items);
        if (res.data.data.items.length === 0) setIsDone(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleRating = async (rating: ReviewRating) => {
    if (cards.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    const currentCard = cards[currentIndex]!;

    try {
      await apiClient.post('/flashcard/review/submit', { 
        card_id: currentCard.flashcard_id, 
        rating 
      });
      
      setReviewedCount(prev => prev + 1);

      // Chuyển thẻ tiếp theo
      if (currentIndex < cards.length - 1) {
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
        <div className="w-16 h-16 bg-orange-100 rounded-[1.5rem] flex items-center justify-center">
          <Brain className="text-orange-500 animate-bounce" size={32} />
        </div>
        <p className="font-black text-orange-600">NebulaAI đang soạn thẻ cần ôn...</p>
      </div>
    </div>
  );

  if (isDone || cards.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-12 text-center shadow-xl shadow-orange-500/5 border-2 border-orange-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-rose-500" />
          
          <div className="w-28 h-28 bg-orange-100 text-orange-500 rounded-[2rem] mx-auto flex items-center justify-center mb-8 rotate-3 shadow-lg">
            <Brain size={56} />
          </div>
          
          <h1 className="text-4xl font-black mb-4 tracking-tight">Học xong rồi!</h1>
          <p className="text-gray-500 font-bold text-lg leading-relaxed mb-6 max-w-sm mx-auto">
            Bạn đã hoàn thành phiên ôn tập hôm nay.<br/>
            Tổng cộng: <strong className="text-orange-600 text-2xl">{reviewedCount}</strong> thẻ bài đã thuộc!
          </p>

          <div className="bg-orange-50/50 rounded-2xl p-4 mb-10 inline-block border border-orange-100">
            <p className="text-orange-700 font-bold text-sm">✨ Kiên trì là chìa khóa của thành công ✨</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Link 
              href="/learn/flashcard" 
              className="px-10 py-5 bg-gradient-to-r from-orange-400 to-rose-500 shadow-xl shadow-orange-500/20 text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <BookOpen size={20} /> Về Thư viện ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex]!;
  const progress = ((currentIndex + 1) / cards.length) * 100;

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
              <h2 className="text-xl font-black tracking-tight truncate max-w-[200px]">Ôn tập định kỳ</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Spaced Repetition</p>
            </div>
          </div>
          
          <div className="flex-1 bg-white p-6 rounded-[2rem] shadow-sm border border-orange-50/50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-black text-orange-600 flex items-center gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-xs">
                  {card.set_title}
                </span>
                Ôn lần {card.repetition + 1}
              </span>
              <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-black">
                {currentIndex + 1} / {cards.length} do
              </span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden p-0.5 border border-gray-50">
              <div 
                className="bg-gradient-to-r from-orange-400 to-amber-500 h-full transition-all duration-700 rounded-full shadow-lg" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        </div>

        {/* ── Card Area ──────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full mb-10">
          <FlipCard
            key={card.schedule_id}
            front={card.front}
            back={card.back}
            hint={card.hint}
            onFlip={setIsFlipped}
          />

          {/* ── Rating Buttons ───────────────────────────────────────────────── */}
          <div className={`w-full mt-12 transition-all duration-700 ${isFlipped ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95 pointer-events-none'}`}>
            <div className="text-center mb-6">
              <span className="px-5 py-2 bg-white rounded-full text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] shadow-sm border border-gray-50">
                Lần ôn tập này thế nào?
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
