'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-[10%] w-12 h-12 bg-orange-100/50 rounded-full animate-bounce duration-[3000ms]" />
      <div className="absolute bottom-40 right-[15%] w-8 h-8 bg-rose-100/50 rounded-lg rotate-12 animate-pulse" />
      <div className="absolute top-1/2 left-[5%] w-6 h-6 bg-amber-100/30 rounded-full" />

      <div className="max-w-2xl w-full text-center z-10">
        {/* Cute Mascot */}
        <div className="relative w-72 h-72 mx-auto mb-8 drop-shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-400/20 to-transparent rounded-full blur-3xl opacity-50" />
          <Image
            src="/images/404-mascot.png"
            alt="404 Not Found"
            width={300}
            height={300}
            className="w-full h-full object-contain relative z-10 animate-float"
            priority
          />
        </div>

        {/* Text */}
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 mb-4 tracking-tight">
          Oops! 404
        </h1>
        <p className="text-xl font-bold text-gray-700 mb-2">
          Hình như bạn đang đi lạc giữa các vì sao...
        </p>
        <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị "lỗ đen" nào đó nuốt mất rồi. Đừng lo, hãy quay lại trạm trung chuyển nhé!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="min-w-[180px] h-14 rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:bg-orange-50 text-gray-600 font-black transition-all group px-8"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Quay lại
          </Button>

          <Button
            onClick={() => router.push('/')}
            className="min-w-[180px] h-14 rounded-2xl bg-gradient-to-r from-orange-400 to-rose-500 text-white font-black shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 transition-all px-8 border-0"
          >
            <Home className="mr-2" size={20} />
            Về Trang Chủ
          </Button>
        </div>

        {/* App Footer Quote */}
        <p className="mt-16 text-sm font-medium text-gray-400 italic">
          "Học tập là một hành trình dài, đôi khi chúng ta sẽ đi lạc một chút!" — NebulaStudy
        </p>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
