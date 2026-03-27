import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="py-12 border-t-2 border-orange-100 px-4 mt-auto bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 group">
          <Image src="/images/logo.png" alt="NebulaStudy" width={100} height={100} unoptimized className="w-[4.5rem] h-[4.5rem] object-contain group-hover:rotate-12 transition-transform rounded-2xl shadow-sm" />
          <span className="font-black text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 drop-shadow-sm">NebulaStudy</span>
        </div>
        <div className="text-gray-500 font-medium text-lg text-center">
          Thiết kế với ❤️ dành cho học sinh Việt Nam.
        </div>
        <div className="flex items-center gap-6 text-lg font-bold text-gray-400">
          <Link href="/terms" className="hover:text-orange-500 transition-colors">Điều khoản</Link>
          <Link href="/privacy" className="hover:text-orange-500 transition-colors">Bảo mật</Link>
          <Link href="/help" className="hover:text-orange-500 transition-colors">Trợ giúp</Link>
        </div>
      </div>
    </footer>
  );
}
