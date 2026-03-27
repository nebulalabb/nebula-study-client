'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { LayoutDashboard, Users, GraduationCap, FileText, BookOpen, Shield, Loader2, CreditCard, MessageSquare } from 'lucide-react';

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Người dùng', icon: Users },
  { href: '/admin/tutors', label: 'Gia sư', icon: GraduationCap },
  { href: '/admin/exams', label: 'Đề thi', icon: FileText },
  { href: '/admin/lessons', label: 'Bài học', icon: BookOpen },
  { href: '/admin/payments', label: 'Thanh toán', icon: CreditCard },
  { href: '/admin/support', label: 'Hỗ trợ', icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/admin/dashboard');
    } else if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 flex flex-col sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Shield size={16} />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900 dark:text-zinc-100">NebulaStudy Admin</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Control Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={'flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ' +
                  (isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800')}
              >
                <Icon size={18} className={isActive ? 'text-indigo-500' : 'text-gray-400'} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Back to App */}
        <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-all border border-indigo-100 dark:border-indigo-900/30">
            <LayoutDashboard size={18} />
            Về trang học tập
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}
