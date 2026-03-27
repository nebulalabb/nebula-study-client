'use client';

import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { QuotaBadge } from '@/components/QuotaBadge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Zap,
  Brain,
  BookOpen,
  Clock,
  FileText,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Calendar,
  Flame,
  Trophy,
  Target,
  ChevronRight,
  Star
} from 'lucide-react';

const tools = [
  {
    title: 'AI Flashcard',
    description: 'Học nhanh, nhớ lâu với Spaced Repetition thông minh',
    icon: Zap,
    iconColor: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    href: '/learn/flashcard',
    module: 'flashcard',
    quotaLabel: 'Flashcard tháng này',
  },
  {
    title: 'Giải bài từng bước',
    description: 'AI hướng dẫn chi tiết từng bước — Toán, Lý, Hóa, Văn...',
    icon: Brain,
    iconColor: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/10',
    href: '/learn/solver',
    module: 'solver',
    quotaLabel: 'Lượt giải hôm nay',
  },
  {
    title: 'Luyện đề 4.0',
    description: 'Kho đề phong phú, chấm điểm tự động với phân tích lỗ hổng',
    icon: BookOpen,
    iconColor: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    href: '/learn/exam',
    module: 'exam',
    quotaLabel: 'Đề tháng này',
  },
  {
    title: 'Học Nhanh Mỗi Ngày',
    description: '5 phút mỗi ngày — duy trì streak học tập liên tục',
    icon: Clock,
    iconColor: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-900/10',
    href: '/learn/microlearn',
    module: 'microlearn',
    quotaLabel: null,
  },
  {
    title: 'Tóm Tắt Ý Chính',
    description: 'Tóm tắt bài giảng dài thành ý chính trong vài giây',
    icon: FileText,
    iconColor: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/10',
    href: '/learn/notes',
    module: 'note',
    quotaLabel: 'Lượt tóm tắt hôm nay',
  },
  {
    title: 'Thuê Gia Sư',
    description: 'Kết nối với gia sư hàng đầu — minh bạch về giá và chất lượng',
    icon: Users,
    iconColor: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/10',
    href: '/learn/tutor',
    module: null,
    quotaLabel: null,
  },
  {
    title: 'Tạo Bài Test Nhanh',
    description: 'Tự tạo bộ câu hỏi ôn tập từ bất kỳ tài liệu nào',
    icon: CheckCircle,
    iconColor: 'text-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-900/10',
    href: '/learn/quiz',
    module: 'quiz',
    quotaLabel: 'Quiz hôm nay',
  },
];

function Greeting({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  return (
    <div className="space-y-1">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-800">
        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">{name}</span>! <span className="inline-block animate-bounce-slow">👋</span>
      </h1>
      <p className="text-gray-500 font-medium text-lg">Hôm nay bạn muốn chinh phục kiến thức gì nào?</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, delay }: { icon: any, label: string, value: string, color: string, delay: string }) {
  return (
    <div className={`p-5 rounded-[2rem] bg-white border-2 border-gray-100 shadow-[0_8px_0_0_#f3f4f6] hover:shadow-none hover:translate-y-1 transition-all group flex items-center gap-4 cursor-default ${delay}`}>
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform`}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-2xl font-black text-gray-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#FFF9F5] selection:bg-orange-200">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 relative">
          <Greeting name={user?.full_name || 'bạn'} />
          
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-3 rounded-3xl border-2 border-orange-100/50 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 rotate-12">
              <Calendar size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Ngày hiện tại</span>
              <span className="text-sm font-bold text-gray-700">{today}</span>
            </div>
          </div>
        </header>
        
        {user?.role === 'tutor' && (
          <section className="bg-indigo-600 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-500/20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 space-y-2 text-center md:text-left">
              <h3 className="text-3xl font-black tracking-tight">Chế độ Gia Sư đã bật! 🎓</h3>
              <p className="text-indigo-100 font-bold">Kiểm tra lịch dạy và chuẩn bị bài giảng cho học sinh ngay nhé.</p>
            </div>
            <Link href="/my/sessions" className="relative z-10">
              <Button className="h-14 px-10 rounded-2xl font-black bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl transition-all flex items-center gap-2">
                 Lịch dạy của tôi <ChevronRight size={20} className="stroke-[3px]" />
              </Button>
            </Link>
          </section>
        )}

        {/* Stats Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            icon={Flame} 
            label="Chuỗi học tập" 
            value={`${user?.streak || 0} Ngày`} 
            color="bg-gradient-to-br from-orange-400 to-rose-500"
            delay="delay-0"
          />
          <StatCard 
            icon={Star} 
            label="Điểm tích lũy" 
            value={`${(user?.xp || 0).toLocaleString()} XP`} 
            color="bg-gradient-to-br from-amber-400 to-orange-400"
            delay="delay-75"
          />
          <StatCard 
            icon={Trophy} 
            label="Xếp hạng" 
            value={user?.ranking ? `#${user.ranking}` : 'N/A'} 
            color="bg-gradient-to-br from-indigo-400 to-purple-500"
            delay="delay-150"
          />
        </section>

        {/* Tools Grid */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 -rotate-6 shadow-sm">
                <Sparkles size={22} fill="currentColor" />
              </div>
              Vũ khí học tập AI
            </h2>
            {/* <Link href="/learn" className="text-orange-500 font-bold text-sm hover:underline hidden sm:block">
              Xem tất cả →
            </Link> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {tools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={idx}
                  href={tool.href}
                  className="group flex flex-col p-8 bg-white rounded-[2.5rem] border-2 border-gray-50 hover:border-orange-200 transition-all duration-300 shadow-[0_10px_0_0_#f9fafb] hover:shadow-none hover:translate-y-2"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-16 h-16 rounded-[1.5rem] ${tool.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm border-2 border-white`}>
                      <Icon size={32} strokeWidth={2.5} className={tool.iconColor} />
                    </div>
                    <div className="p-2 rounded-full bg-orange-50 text-orange-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
                      <ChevronRight size={18} strokeWidth={3} />
                    </div>
                  </div>

                  <h3 className="text-xl font-black mb-2 text-gray-800 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{tool.title}</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed flex-1">{tool.description}</p>

                  {tool.module && tool.quotaLabel && (
                    <div className="mt-6 pt-6 border-t border-dashed border-gray-100">
                      <QuotaBadge module={tool.module} label={tool.quotaLabel} />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Upgrade Banner */}
        {user?.plan === 'free' && (
          <section className="relative p-10 md:p-14 rounded-[3rem] bg-gradient-to-br from-orange-400 to-rose-500 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-orange-500/30 overflow-hidden">
            <div className="absolute top-0 right-0 text-white/10 translate-x-1/4 -translate-y-1/4 rotate-12">
              <Sparkles size={300} />
            </div>
            
            <div className="relative z-10 space-y-4 text-center md:text-left">
              <h3 className="text-4xl font-black tracking-tight drop-shadow-md">Mở khóa toàn bộ "siêu năng lực"! 🚀</h3>
              <p className="text-orange-50 text-xl font-medium max-w-xl">
                Học không giới hạn với AI cực mạnh, lưu trữ bài giảng và hỗ trợ 24/7.
              </p>
            </div>
            <Link href="/billing/upgrade" className="relative z-10 shrink-0">
              <Button variant="secondary" className="h-16 px-10 rounded-[1.5rem] font-black text-xl text-orange-600 bg-white hover:bg-orange-50 shadow-[0_6px_0_0_#fdba74] hover:shadow-none hover:translate-y-1 transition-all">
                Nâng cấp Premium ✨
              </Button>
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
