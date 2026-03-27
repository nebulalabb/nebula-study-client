'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, MessageCircle, UserPlus, ShieldAlert } from 'lucide-react';

const socialLinks = [
  { href: '/social/friends', label: 'Bạn bè', icon: Users },
  { href: '/social/chat', label: 'Tin nhắn', icon: MessageCircle },
];

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <div className="mb-6 px-4">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">Cộng đồng</h1>
            <p className="text-sm font-medium text-gray-500">Kết nối & Chia sẻ</p>
          </div>
          
          <nav className="space-y-1">
            {socialLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={'flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ' +
                    (isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-orange-100')}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 p-4 rounded-3xl bg-indigo-50 border border-indigo-100 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-2 text-indigo-200">
                <ShieldAlert size={40} className="rotate-12 translate-x-4 -translate-y-2" />
             </div>
             <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Mẹo học tập</p>
             <p className="text-sm font-bold text-indigo-700 relative z-10 leading-snug">
               Kết bạn để cùng nhau thực hiện các bài thi nhóm và đua top bảng xếp hạng nhé!
             </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white rounded-[2.5rem] border-2 border-orange-50 shadow-[0_10px_0_0_#f9fafb] overflow-hidden min-h-[600px]">
          {children}
        </main>
      </div>
    </div>
  );
}
