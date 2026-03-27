import React from 'react';
import { Sparkles, Star, LifeBuoy, Zap, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col selection:bg-orange-200 overflow-hidden relative pb-20">
      {/* CUTE DECORATIONS */}
      <div className="absolute top-20 left-10 text-orange-300 opacity-50 animate-bounce">
        <Sparkles size={48} />
      </div>
      <div className="absolute top-80 right-20 text-yellow-300 opacity-60 animate-pulse">
        <Star size={56} fill="currentColor" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20 w-full relative z-10">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-orange-200 text-orange-600 font-bold shadow-[0_4px_0_0_rgba(254,215,170,1)] hover:translate-y-1 hover:shadow-none transition-all cursor-default">
            <span className="text-xl">🆘</span>
            Luôn ở đây vì bạn
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-800 drop-shadow-sm">
            Trung Tâm <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Trợ Giúp</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Bạn đang gặp rắc rối? Đừng lo, đội ngũ NebulaStudy luôn sẵn sàng hỗ trợ bạn giải quyết mọi vấn đề! 🦸‍♂️
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-orange-500/5 border-2 border-orange-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform cursor-pointer">
            <div className="w-16 h-16 rounded-[1.5rem] bg-orange-100 text-orange-500 flex items-center justify-center mb-6">
              <LifeBuoy size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-3">Câu hỏi thường gặp</h3>
            <p className="text-gray-600 font-medium mb-6">Tổng hợp các bí kíp xử lý lỗi nhanh chóng mà không cần đợi đội hỗ trợ.</p>
            <Link href="/#features" className="px-6 py-3 rounded-full font-bold bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors w-full mt-auto">
              Xem Câu Hỏi
            </Link>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-orange-500/5 border-2 border-orange-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform cursor-pointer">
            <div className="w-16 h-16 rounded-[1.5rem] bg-rose-100 text-rose-500 flex items-center justify-center mb-6">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-3">Liên hệ trực tiếp</h3>
            <p className="text-gray-600 font-medium mb-6">Chat với admin hoặc gửi email để chúng mình xử lý các vấn đề khó nhằn.</p>
            <a href="mailto:support@nebulastudy.vercel.app" className="px-6 py-3 rounded-full font-bold bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors w-full mt-auto">
              Nhắn Tin Ngay
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
