'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from './ui/button';
import { NotificationBell } from './shared/NotificationBell';
import { MessageBell } from './shared/MessageBell';
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Settings,
  Crown,
  Sparkles,
  Trophy,
  BookOpen,
  Brain,
  Zap,
  FileText,
  User,
  Calendar,
  Shield,
  Users
} from 'lucide-react';

function PlanBadge({ plan }: { plan: string }) {
  if (plan === 'premium' || plan === 'enterprise') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm">
        <Crown size={8} />
        {plan === 'enterprise' ? 'ENTERPRISE' : 'PREMIUM'}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
      FREE
    </span>
  );
}

export default function Navbar() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const featuresLink = pathname === '/' ? '#features' : '/#features';
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const toolsRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setIsToolsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + Links */}
          <div className="flex items-center">
            <Link href={(!isLoading && isAuthenticated) ? "/dashboard" : "/"} className="flex items-center gap-2 group">
              <Image src="/images/logo.png" alt="NebulaStudy" width={44} height={44} unoptimized className="w-11 h-11 object-contain group-hover:rotate-12 transition-transform" />
              <span className="font-black text-[1.7rem] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 drop-shadow-sm">NebulaStudy</span>
            </Link>

            <div className="hidden md:ml-10 md:flex items-center space-x-2">
              {/* ✅ FIX: đổi && thành ternary ? : để có fallback loading skeleton */}
              {!isLoading ? (
                <>
                  {isAuthenticated ? (
                    <>
                      {/* Auth Menu */}
                      <div className="relative" ref={toolsRef}>
                        <button
                          onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                          className={`px-4 py-2 text-base font-bold rounded-full transition-all flex items-center gap-2 ${isToolsMenuOpen ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
                        >
                          <BookOpen size={18} className="text-orange-500" /> Học tập <ChevronDown size={14} className={`transition-transform ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isToolsMenuOpen && (
                          <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 pb-2 mb-2 border-b border-gray-50">
                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Công cụ AI</p>
                            </div>
                            <Link href="/learn/solver" onClick={() => setIsToolsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 group transition-colors">
                              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                <Brain size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-800">Giải bài tập AI</p>
                                <p className="text-[11px] text-gray-500">Hướng dẫn chi tiết từng bước</p>
                              </div>
                            </Link>
                            <Link href="/learn/flashcard" onClick={() => setIsToolsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 group transition-colors">
                              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                <Zap size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-800">Kho Flashcard</p>
                                <p className="text-[11px] text-gray-500">Học nhanh, nhớ lâu vĩnh viễn</p>
                              </div>
                            </Link>
                            <Link href="/learn/exam" onClick={() => setIsToolsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 group transition-colors">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                <BookOpen size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-800">Luyện đề thi</p>
                                <p className="text-[11px] text-gray-500">Thi thử 4.0, phân tích lỗi sai</p>
                              </div>
                            </Link>
                          </div>
                        )}
                      </div>

                      <Link href="/learn/ranking" className="px-4 py-2 text-base font-bold text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all flex items-center gap-2">
                        <Trophy size={18} className="text-amber-500" /> Xếp hạng
                      </Link>

                      <Link href="/social/friends" className="px-4 py-2 text-base font-bold text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all flex items-center gap-2">
                        <Users size={18} className="text-indigo-500" /> Cộng đồng
                      </Link>

                      {user?.plan === 'free' && (
                        <Link href="/billing/upgrade" className="px-4 py-2 text-base font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-full transition-all border border-orange-100 flex items-center gap-2 animate-pulse-subtle">
                          <Sparkles size={18} className="text-orange-400" /> Nâng cấp
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Guest Menu */}
                      <Link href={featuresLink} className="px-4 py-2 text-base font-bold text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all flex items-center gap-2">
                        <Zap size={18} className="text-orange-500" /> Công cụ
                      </Link>
                      <Link href="/billing/upgrade" className="px-4 py-2 text-base font-bold text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all flex items-center gap-2">
                        <Crown size={18} className="text-amber-500" /> Gói cước
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <div className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                  <div className="w-24 h-8 bg-gray-100 rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          {/* Right — Auth */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoading && isAuthenticated && (
              <div className="flex items-center gap-2">
                <MessageBell />
                <NotificationBell />
              </div>
            )}
            {!isLoading ? (
              isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-sm overflow-hidden">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user?.full_name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    {/* Name + Badge */}
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold leading-none mb-0.5 max-w-[150px] truncate">
                        {user?.full_name}
                      </span>
                      <PlanBadge plan={user?.plan ?? 'free'} />
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 py-2 z-50">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 mb-1">
                        <p className="text-sm font-bold truncate">{user?.full_name}</p>
                        <p className="text-xs text-gray-500 truncate mb-2">{user?.email}</p>
                        <div className="flex items-center justify-between mb-1.5">
                          <PlanBadge plan={user?.plan ?? 'free'} />
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">LV {user?.level || 1}</span>
                        </div>
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-400 to-rose-500 transition-all duration-1000"
                            style={{ width: `${((user?.xp || 0) % 1000) / 10}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-gray-400 mt-1 text-right">{(user?.xp || 0) % 1000}/1000 XP</p>
                      </div>

                      <Link href="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 transition-colors">
                        <LayoutDashboard size={16} className="text-orange-500" /> Dashboard
                      </Link>
                      {user?.role === 'admin' && (
                        <Link href="/admin/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors font-bold">
                          <Shield size={16} /> Trang quản trị
                        </Link>
                      )}
                      <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 transition-colors font-semibold">
                        <User size={16} className="text-orange-500" /> Hồ sơ cá nhân
                      </Link>
                      <Link href="/my/bookings" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 transition-colors">
                        <Calendar size={16} className="text-orange-500" /> Lịch học của tôi
                      </Link>
                      <Link href="/settings" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        <Settings size={16} className="text-gray-400" /> Cài đặt
                      </Link>

                      {user?.plan === 'free' && (
                        <Link href="/billing/upgrade" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors font-semibold">
                          <Sparkles size={16} /> Nâng cấp Premium
                        </Link>
                      )}

                      <div className="border-t border-gray-100 dark:border-zinc-800 mt-1">
                        <button
                          onClick={async () => { 
                            try {
                              await logout(); 
                            } catch (err) {
                              console.error('Logout error ignored:', err);
                            }
                            setIsUserMenuOpen(false); 
                            router.push('/'); 
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors font-semibold"
                        >
                          <LogOut size={16} /> Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="rounded-full px-6 font-bold border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">Bắt đầu ngay</Button>
                  </Link>
                </>
              )
            ) : (
              <div className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                <div className="w-24 h-8 bg-gray-100 rounded-full"></div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-900/50 py-4 px-4 space-y-1 animate-in slide-in-from-top-4">
          <Link href={featuresLink} className="block px-4 py-2.5 text-lg font-bold text-gray-700 dark:text-zinc-300 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors">✨ Công cụ</Link>
          <Link href="/billing/upgrade" className="block px-4 py-2.5 text-lg font-bold text-gray-700 dark:text-zinc-300 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors">💎 Gói cước</Link>

          {isAuthenticated ? (
            <>
              <div className="px-4 py-3 mt-2 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">{user?.full_name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <div className="mt-2"><PlanBadge plan={user?.plan ?? 'free'} /></div>
              </div>

              <div className="pt-4 pb-2 px-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-2">Học tập</p>
                <Link href="/learn/solver" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 text-base font-bold text-gray-700 hover:text-orange-600 transition-colors">
                  <Brain size={18} className="text-purple-500" /> Giải bài tập AI
                </Link>
                <Link href="/learn/flashcard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 text-base font-bold text-gray-700 hover:text-orange-600 transition-colors">
                  <Zap size={18} className="text-amber-500" /> Kho Flashcard
                </Link>
                <Link href="/learn/exam" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 text-base font-bold text-gray-700 hover:text-orange-600 transition-colors">
                  <BookOpen size={18} className="text-blue-500" /> Luyện đề thi
                </Link>
              </div>

              <Link href="/learn/ranking" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-base font-bold text-gray-700 rounded-xl hover:bg-orange-50 hover:text-orange-600">
                <Trophy size={18} className="text-amber-500" /> Bảng xếp hạng
              </Link>

              <Link href="/social/friends" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-base font-bold text-gray-700 rounded-xl hover:bg-orange-50 hover:text-orange-600">
                <Users size={18} className="text-indigo-500" /> Cộng đồng
              </Link>

              {user?.plan === 'free' && (
                <Link href="/billing/upgrade" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-base font-bold text-orange-600 bg-orange-50 rounded-xl border border-orange-100 mt-2">
                  <Sparkles size={18} /> Nâng cấp Premium
                </Link>
              )}

              <div className="pt-4 border-t border-gray-100 dark:border-zinc-900 mt-4">
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-base font-bold text-gray-700 rounded-xl hover:bg-orange-50">Dashboard</Link>
                {user?.role === 'admin' && (
                  <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-base font-bold text-indigo-600 rounded-xl hover:bg-indigo-50">Trang quản trị</Link>
                )}
                <Link href="/my/bookings" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-base font-bold text-gray-700 rounded-xl hover:bg-orange-50">Lịch học của tôi</Link>
                <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-base font-bold text-gray-700 rounded-xl hover:bg-orange-50">Hồ sơ cá nhân</Link>
                <Link href="/settings" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-500 rounded-xl hover:bg-gray-50">Cài đặt</Link>
                <button 
                  onClick={async () => { 
                    try {
                      await logout(); 
                    } catch (err) {
                      console.error('Logout error ignored:', err);
                    }
                    setIsMenuOpen(false); 
                    router.push('/'); 
                  }} 
                  className="block w-full text-left px-4 py-2 text-base font-bold text-rose-500 rounded-xl hover:bg-rose-50 mt-1"
                >
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link href="/login" className="block w-full">
                <Button variant="outline" className="w-full justify-start rounded-xl font-bold">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register" className="block w-full">
                <Button className="w-full rounded-xl">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}