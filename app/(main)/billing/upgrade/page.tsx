'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Star, Zap, Infinity, ArrowRight, Sparkles, Rocket } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  display_name: string;
  price_vnd: number;
  billing_cycle: string;
  features: {
    flashcard_limit: number;
    solver_daily_limit: number;
    summary_daily_limit: number;
    quiz_daily_limit: number;
    ai_model: string;
    storage_mb: number;
  };
}

export default function UpgradePage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    apiClient.get('/billing/plans')
      .then(res => setPlans(res.data.data.plans))
      .catch(err => console.error(err)) // added catch for safety
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectPlan = (planId: string) => {
    router.push(`/billing/checkout?plan=${planId}`);
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse text-orange-400 font-bold text-xl">Đang tải gói cước cực xịn... ✨</div>;

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col selection:bg-orange-200 overflow-hidden relative">
      
      {/* CUTE DECORATIONS */}
      <div className="absolute top-20 left-10 text-orange-300 opacity-50 animate-bounce">
        <Sparkles size={48} />
      </div>
      <div className="absolute top-40 right-20 text-yellow-300 opacity-60 animate-pulse">
        <Star size={56} fill="currentColor" />
      </div>
      <div className="absolute bottom-20 left-32 text-rose-300 opacity-40">
        <Rocket size={40} className="rotate-45" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20 w-full relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-orange-200 text-orange-600 font-bold shadow-[0_4px_0_0_rgba(254,215,170,1)] hover:translate-y-1 hover:shadow-none transition-all cursor-default">
            <span className="text-xl">💎</span>
            NebulaStudy Premium
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-800 drop-shadow-sm">
            Học thả ga, <br className="md:hidden" /> không lo giới hạn!
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Nâng cấp gói Premium để mở khóa 100% sức mạnh AI, bài toán nào khó có Nebula lo! ✨
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isPremium = plan.price_vnd > 0;
            const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(plan.price_vnd);
            const cycleText = plan.billing_cycle === 'monthly' ? '/ tháng' : plan.billing_cycle === 'yearly' ? '/ năm' : '';

            return (
              <div 
                key={plan.id} 
                className={`relative flex flex-col p-8 rounded-[2.5rem] border-2 transition-all duration-300 ${
                  isPremium 
                    ? plan.billing_cycle === 'yearly'
                      ? 'bg-gradient-to-br from-orange-400 to-rose-400 border-transparent text-white shadow-2xl md:scale-105 z-10 hover:md:scale-110'
                      : 'bg-white border-orange-200 shadow-[0_8px_0_0_#fed7aa] hover:translate-y-1 hover:shadow-none'
                    : 'bg-white border-gray-200 shadow-sm hover:translate-y-1 hover:shadow-xl'
                }`}
              >
                {plan.billing_cycle === 'yearly' && (
                  <div className="absolute -top-5 inset-x-0 flex justify-center z-20">
                    <span className="bg-yellow-300 text-yellow-900 border-2 border-yellow-400 text-sm font-black uppercase tracking-wider px-5 py-2 rounded-full shadow-lg flex items-center gap-1">
                      <Star size={16} fill="currentColor" /> Siêu Tiết Kiệm
                    </span>
                  </div>
                )}

                <div className="mb-8 text-center mt-2">
                  <h3 className={`text-2xl font-black mb-3 ${plan.billing_cycle === 'yearly' ? 'text-white' : 'text-gray-800'}`}>
                    {plan.display_name}
                  </h3>
                  <div className="flex flex-col items-center justify-center min-h-[5rem]">
                    <span className={`text-4xl font-black ${plan.billing_cycle === 'yearly' ? 'text-white drop-shadow-md' : 'text-orange-500'}`}>
                      {plan.price_vnd === 0 ? 'Miễn phí' : formatPrice}
                    </span>
                    {plan.price_vnd > 0 && <span className={`text-lg font-bold mt-1 ${plan.billing_cycle === 'yearly' ? 'text-orange-100' : 'text-gray-500'}`}>{cycleText}</span>}
                  </div>
                </div>

                <div className={`flex-1 space-y-5 mb-8 text-base font-bold ${plan.billing_cycle === 'yearly' ? 'text-white/90' : 'text-gray-600'}`}>
                  
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={22} className={plan.billing_cycle === 'yearly' ? 'text-yellow-300' : 'text-orange-500'} />
                    <span>
                      Giải bài chi tiết: {plan.features.solver_daily_limit === -1 ? <strong className={plan.billing_cycle === 'yearly' ? 'text-yellow-300' : 'text-orange-500'}>Không giới hạn</strong> : `${plan.features.solver_daily_limit} lượt/ngày`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={22} className={plan.billing_cycle === 'yearly' ? 'text-yellow-300' : 'text-orange-500'} />
                    <span>
                      Tóm tắt tài liệu: {plan.features.summary_daily_limit === -1 ? <strong className={plan.billing_cycle === 'yearly' ? 'text-yellow-300' : 'text-orange-500'}>Không giới hạn</strong> : `${plan.features.summary_daily_limit} lượt/ngày`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={22} className={plan.billing_cycle === 'yearly' ? 'text-yellow-300' : 'text-orange-500'} />
                    <span>
                      Đề thi/Quiz: {plan.features.quiz_daily_limit === -1 ? <strong className={plan.billing_cycle === 'yearly' ? 'text-yellow-300' : 'text-orange-500'}>Không giới hạn</strong> : `${plan.features.quiz_daily_limit} lượt/ngày`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={22} className={plan.billing_cycle === 'yearly' ? 'text-yellow-300' : 'text-orange-500'} />
                    <span>
                      Bộ Flashcard: {plan.features.flashcard_limit === -1 ? <strong className={plan.billing_cycle === 'yearly' ? 'text-yellow-300' : 'text-orange-500'}>Lưu thả ga</strong> : `Tối đa ${plan.features.flashcard_limit} bộ`}
                    </span>
                  </div>

                </div>

                {isPremium ? (
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-5 rounded-full font-black text-lg flex items-center justify-center gap-2 transition-all ${
                      plan.billing_cycle === 'yearly' 
                        ? 'bg-white text-orange-500 shadow-[0_6px_0_0_#fdba74] hover:shadow-[0_0px_0_0_#fdba74] hover:translate-y-1 hover:bg-orange-50' 
                        : 'bg-orange-500 text-white shadow-[0_6px_0_0_#ea580c] hover:shadow-none hover:translate-y-1'
                    }`}
                  >
                    Nâng cấp liền! <ArrowRight strokeWidth={3} />
                  </button>
                ) : (
                  <Link
                    href="/dashboard"
                    className="w-full py-5 rounded-full font-bold text-lg flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    Gói hiện tại
                  </Link>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
