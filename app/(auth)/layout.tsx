import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Star, Rocket, Quote } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT SIDE: Brand/Illustration (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-400 to-rose-500 px-12 py-16 flex-col justify-between relative overflow-hidden text-white">
        {/* Floating Background Icons */}
        <div className="absolute top-24 left-16 opacity-20 animate-bounce">
          <Sparkles size={120} />
        </div>
        <div className="absolute bottom-32 right-20 opacity-30 animate-pulse">
          <Star size={140} fill="currentColor" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07] rotate-12">
          <Rocket size={400} />
        </div>

        {/* Brand */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/images/logo.png" alt="Nebula Study" width={48} height={48} unoptimized className="w-12 h-12 rounded-xl object-contain drop-shadow-md" />
            <span className="font-black text-3xl tracking-tight drop-shadow-sm">Nebula Study</span>
          </Link>
        </div>

        {/* Quote/Copy */}
        <div className="relative z-10 max-w-xl pb-10">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-md shadow-inner">
            <Quote size={28} className="fill-current text-white" />
          </div>
          <h2 className="text-[3rem] font-black leading-[1.1] mb-6 drop-shadow-md">
            Học tập không <br /> giới hạn.
          </h2>
          <p className="text-xl font-medium text-white/90 leading-relaxed pr-8">
            Hàng ngàn bài tập đa dạng, lộ trình cá nhân hóa và người trợ lý giảng dạy AI siêu việt đang chờ bạn khám phá. Bắt đầu ngay hôm nay! 🚀
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Forms container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-[#FFF9F5] relative selection:bg-orange-200">
        {/* Mobile Logo Only Form */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Image src="/images/logo.png" alt="Nebula Study" width={32} height={32} unoptimized className="w-8 h-8 rounded-lg object-contain group-hover:rotate-12 transition-transform shadow-sm" />
            <span className="font-black text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Nebula Study</span>
          </Link>
        </div>

        <div className="w-full max-w-[440px] px-2 py-10 fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
}
