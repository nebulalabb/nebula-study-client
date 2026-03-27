'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  Rocket, 
  ArrowLeft,
  PartyPopper,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';

function VNPayReturnContent() {
  const searchParams = useSearchParams();
  const rspCode = searchParams.get('vnp_ResponseCode');
  const amount = searchParams.get('vnp_Amount');
  const orderId = searchParams.get('vnp_TxnRef');
  
  const { refreshUser } = useAuth(); // trigger reload profile
  
  const isSuccess = rspCode === '00';
  const formatAmount = amount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount)/100) : '0 ₫';

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        refreshUser(); // reload user context to update Plan to premium on UI
      }, 1000);
    }
  }, [isSuccess, refreshUser]);

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6 selection:bg-orange-200 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl -mr-64 -mt-64 transition-colors duration-1000 ${isSuccess ? 'bg-emerald-100/40' : 'bg-rose-100/40'}`} />
      <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl -ml-40 -mb-40 transition-colors duration-1000 ${isSuccess ? 'bg-sky-100/30' : 'bg-orange-100/30'}`} />

      <div className="max-w-xl w-full relative z-10 animate-in fade-in zoom-in duration-500">
        <div className={`bg-white rounded-[3.5rem] border-4 p-10 md:p-16 text-center shadow-2xl transition-all ${isSuccess ? 'border-emerald-100 shadow-emerald-500/5' : 'border-rose-100 shadow-rose-500/5'}`}>
          
          {isSuccess ? (
            <div className="space-y-8">
              {/* Success Visual */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20 animate-pulse" />
                <div className="relative w-28 h-28 bg-[#FFF9F5] border-4 border-white rounded-[2.5rem] flex items-center justify-center text-emerald-500 shadow-xl rotate-6 animate-bounce-slow">
                   <PartyPopper size={56} strokeWidth={2.5} />
                </div>
                <div className="absolute -top-4 -right-4 text-yellow-400 animate-spin-slow">
                   <Sparkles size={32} />
                </div>
              </div>

              <div className="space-y-3">
                 <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-none">
                    Xịn quá, <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-sky-600">Thanh toán xong rồi!</span>
                 </h1>
                 <p className="text-gray-400 font-bold text-lg">Chào mừng bạn gia nhập hàng ngũ Premium chính hiệu! ✨</p>
              </div>

              {/* Order Info Card */}
              <div className="bg-[#FFF9F5] rounded-3xl border-2 border-emerald-50 p-6 flex flex-col gap-2 items-center justify-center shadow-inner">
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Đơn hàng: {orderId}</p>
                 <p className="text-2xl font-black text-gray-800">{formatAmount}</p>
                 <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <ShieldCheck size={14} /> Giao dịch bảo mật thành công
                 </div>
              </div>

              <div className="space-y-4 pt-4">
                 <Link href="/dashboard" className="block w-full">
                    <Button className="w-full h-16 rounded-2xl font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 text-xl active:scale-95 transition-all">
                       Vào Dashboard ngay ✨
                    </Button>
                 </Link>
                 <p className="text-xs font-bold text-gray-400 italic">"Hệ thống đang cập nhật quyền hạn của bạn sau vài giây..."</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Failure Visual */}
               <div className="relative inline-block">
                <div className="absolute inset-0 bg-rose-400 blur-2xl opacity-20 animate-pulse" />
                <div className="relative w-28 h-28 bg-[#FFF9F5] border-4 border-white rounded-[3rem] flex items-center justify-center text-rose-500 shadow-xl -rotate-6">
                   <AlertCircle size={56} strokeWidth={2.5} />
                </div>
              </div>

              <div className="space-y-3">
                 <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-none">
                    Oops! <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-600">Thanh toán bị lỗi</span>
                 </h1>
                 <p className="text-gray-400 font-bold text-lg">Đừng lo lắng, chưa có khoản tiền nào bị trừ khỏi ví của bạn đâu.</p>
              </div>

              <div className="bg-[#FFF9F5] rounded-3xl border-2 border-rose-50 p-8 flex flex-col gap-2 items-center justify-center shadow-inner">
                 <p className="text-gray-500 font-medium leading-relaxed">Giao dịch đã bị hủy hoặc có sự cố từ cổng thanh toán. Hãy thử lại hoặc liên hệ hỗ trợ nếu cần nhé.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <Link href="/billing/upgrade" className="flex-1">
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black border-2 border-rose-200 text-rose-600 hover:bg-rose-50">
                       Thử lại xem sao
                    </Button>
                 </Link>
                 <Link href="/dashboard" className="flex-1">
                    <Button className="w-full h-14 rounded-2xl font-black bg-gray-900 text-white shadow-xl shadow-gray-900/10">
                       Về Dashboard
                    </Button>
                 </Link>
              </div>
            </div>
          )}

        </div>

        {/* Footer Decoration */}
        <div className="text-center mt-12 space-y-4 opacity-60">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">NebulaStudy Payment ✨</p>
        </div>
      </div>

    </div>
  );
}

export default function VNPayReturnPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
          <div className="text-center space-y-4">
             <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
             <p className="text-orange-900 font-black text-lg animate-pulse">Đang kiểm tra kết quả giao dịch... ✨</p>
          </div>
       </div>
    }>
      <VNPayReturnContent />
    </Suspense>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
