'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, MessageCircle, UserPlus, ShieldAlert, LayoutGrid, MessageSquare, Home, Sparkles } from 'lucide-react';

const socialLinks = [
  { href: '/social', label: 'Tổng quan', icon: Home },
  { href: '/social/feed', label: 'Bảng tin', icon: LayoutGrid },
  { href: '/social/forum', label: 'Diễn đàn', icon: MessageSquare },
  { href: '/social/friends', label: 'Bạn bè', icon: Users },
  { href: '/social/chat', label: 'Tin nhắn', icon: MessageCircle },
];

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FFF9F5] relative overflow-hidden">
      {/* Global Background Decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/30 rounded-full blur-[120px] -mr-80 -mt-80 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-100/20 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-4 pb-4 md:pt-6 md:pb-6 relative z-10 h-[calc(100vh-110px)] min-h-[600px]">
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-64 shrink-0 space-y-3 lg:sticky lg:top-0 self-start h-full overflow-y-auto pb-10 pr-2 custom-scrollbar">
            <div className="mb-6 px-4 space-y-1">
              <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Cộng đồng</span>
                <Sparkles size={20} className="text-orange-400" />
              </h1>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Kết nối & Chia sẻ</p>
            </div>
            
            <nav className="space-y-2">
              {socialLinks.map(({ href, label, icon: Icon }) => {
                const isActive = href === '/social' 
                  ? pathname === '/social' 
                  : pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    scroll={false}
                    className={'group flex items-center gap-3 px-5 py-3.5 rounded-[1.5rem] font-black text-sm border-2 transition-all ' +
                      (isActive
                        ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-xl shadow-orange-500/20 border-transparent'
                        : 'bg-white/50 backdrop-blur-sm text-gray-500 hover:text-orange-600 hover:bg-white border-white hover:border-orange-100 shadow-sm')}
                  >
                    <div className={'transition-transform group-hover:scale-110 ' + (isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-500')}>
                       <Icon size={20} />
                    </div>
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-10 p-8 rounded-[2.5rem] bg-white border-4 border-white shadow-xl shadow-orange-500/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 text-orange-100 group-hover:text-orange-200 transition-colors">
                  <ShieldAlert size={56} className="rotate-12 translate-x-4 -translate-y-2" />
               </div>
               <div className="relative z-10 space-y-3">
                 <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 font-black mb-2">💡</div>
                 <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none">Mẹo học tập</p>
                 <p className="text-sm font-bold text-gray-700 leading-relaxed">
                   Kết bạn để cùng nhau thực hiện các bài thi nhóm và đua top bảng xếp hạng nhé!
                 </p>
               </div>
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 bg-white rounded-[3rem] border-4 border-white shadow-2xl shadow-orange-500/5 h-full relative overflow-hidden">
            <div key={pathname} className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
              {children}
            </div>
          </main>

          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #ffe4d6;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #ffd6c2;
            }
            /* Hide for Firefox */
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #ffe4d6 transparent;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
