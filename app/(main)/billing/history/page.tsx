'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  SearchX, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  CreditCard, 
  Calendar,
  Wallet,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import { Button } from '@/components/ui/button';

interface HistoryItem {
  id: string;
  amount_vnd: number;
  currency: string;
  gateway: string;
  status: string;
  paid_at: string | null;
  plan_name: string;
}

export default function BillingHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/billing/history')
      .then(res => setHistory(res.data.data.items))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
         <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-orange-900 font-black text-lg animate-pulse">Đang lục lại sổ sách của bạn... ✨</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24 selection:bg-orange-200 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-100/20 rounded-full blur-3xl -ml-40 -mb-40" />

      <div className="max-w-4xl mx-auto px-6 pt-20 relative z-10 space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-2">
              <Link href="/settings" className="inline-flex items-center gap-2 text-sm font-black text-orange-500 hover:translate-x-[-4px] transition-transform">
                 <ArrowLeft size={16} strokeWidth={3} /> Quay lại
              </Link>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-none">
                 Lịch sử <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Giao dịch</span>
              </h1>
              <p className="text-gray-400 font-bold text-lg">Quản lý và theo dõi các khoản nạp của bạn.</p>
           </div>
           
           <div className="bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl border-2 border-orange-100 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                 <Wallet size={16} />
              </div>
              <span className="text-sm font-bold text-gray-700">Tổng cộng {history.filter(i => i.status === 'success').length} giao dịch thành công</span>
           </div>
        </header>

        {/* Content */}
        {history.length === 0 ? (
          <div className="bg-white rounded-[3rem] border-4 border-orange-50 p-20 text-center space-y-6 shadow-xl shadow-orange-500/5">
             <div className="w-24 h-24 bg-[#FFF9F5] rounded-[2.5rem] flex items-center justify-center text-gray-200 mx-auto border-4 border-white shadow-inner">
                <SearchX size={48} strokeWidth={2} />
             </div>
             <div className="space-y-2">
               <h3 className="text-2xl font-black text-gray-900">Chưa có giao dịch nào</h3>
               <p className="text-gray-400 font-bold max-w-xs mx-auto">
                  Bạn chưa thực hiện bất kỳ giao dịch nạp gói nào trên hệ thống.
               </p>
             </div>
             <Link href="/billing/upgrade">
                <Button className="rounded-2xl h-12 px-8 font-black bg-orange-500 text-white shadow-lg">Khám phá gói Premium</Button>
             </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => {
              const isSuccess = item.status === 'success';
              const isPending = item.status === 'pending';
              const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: item.currency}).format(item.amount_vnd);

              return (
                <div 
                  key={item.id} 
                  className={`group bg-white rounded-[2.5rem] border-4 p-6 md:p-8 transition-all hover:translate-y-[-4px] active:scale-[0.98] cursor-default flex flex-col md:flex-row items-center gap-6 ${
                    isSuccess ? 'border-orange-50 shadow-xl shadow-orange-500/5 hover:border-orange-200' : 'border-gray-50 opacity-80'
                  }`}
                >
                  {/* Transaction Icon */}
                  <div className={`w-16 h-16 rounded-[1.5rem] border-4 border-white shadow-lg flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform ${
                    isSuccess ? 'bg-orange-50 text-orange-500' : 
                    isPending ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'
                  }`}>
                     <CreditCard size={28} strokeWidth={2.5} />
                  </div>

                  {/* Info Area */}
                  <div className="flex-1 space-y-1 text-center md:text-left">
                     <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg w-fit mx-auto md:mx-0 ${
                          isSuccess ? 'bg-emerald-50 text-emerald-600' : 
                          isPending ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {item.status === 'success' ? 'Thành công' : item.status === 'pending' ? 'Chờ xử lý' : 'Thất bại'}
                        </span>
                        <p className="text-xs font-black text-gray-300 flex items-center justify-center md:justify-start gap-1">
                           <Calendar size={12} /> {item.paid_at ? format(new Date(item.paid_at), 'HH:mm - dd/MM/yyyy', { locale: vi }) : '—'}
                        </p>
                     </div>
                     <h4 className="text-xl font-black text-gray-800 leading-tight">
                        {item.plan_name || 'Gói nạp'}
                     </h4>
                     <p className="text-[10px] font-mono font-black text-gray-300 uppercase leading-none">ID: {item.id.split('-')[0]}</p>
                  </div>

                  {/* Price Area */}
                  <div className="text-right shrink-0">
                     <p className={`text-2xl font-black ${isSuccess ? 'text-orange-500' : 'text-gray-400'}`}>
                        {formatPrice}
                     </p>
                     <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mt-1">
                        Cổng: {item.gateway.toUpperCase()}
                     </p>
                  </div>

                  {/* Arrow Decor */}
                  <div className="hidden md:block opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                     <div className="w-10 h-10 bg-[#FFF9F5] rounded-xl flex items-center justify-center text-orange-500 shadow-inner">
                        <ChevronRight size={20} strokeWidth={3} />
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Motivation */}
        <footer className="text-center pt-12 space-y-4">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Nebula Ledger ✨</p>
           <p className="text-gray-400 font-bold max-w-lg mx-auto leading-relaxed italic">
             "Đầu tư vào tri thức là khoản đầu tư mang lại lợi nhuận cao nhất." — Benjamin Franklin
           </p>
        </footer>

      </div>
    </div>
  );
}
