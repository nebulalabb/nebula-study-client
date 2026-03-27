'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Users, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface StatCard { label: string; value: string; sub: string; icon: React.ElementType; color: string; }

function Card({ label, value, sub, icon: Icon, color }: StatCard) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={'w-12 h-12 rounded-2xl flex items-center justify-center ' + color}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      <p className="text-sm font-bold text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-black text-gray-900 dark:text-zinc-100">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/admin/stats')
      .then(r => setStats(r.data.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const fmtVnd = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

  if (isLoading) return <div className="animate-pulse p-8 text-gray-400">Đang tải thống kê...</div>;

  const cards: StatCard[] = [
    { label: 'Tổng người dùng', value: stats?.users?.total?.toLocaleString() || '0', sub: `${stats?.users?.premium || 0} Premium`, icon: Users, color: 'bg-indigo-500' },
    { label: 'Doanh thu hôm nay', value: fmtVnd(stats?.revenue?.today_vnd || 0), sub: `Tổng: ${fmtVnd(stats?.revenue?.all_time_vnd || 0)}`, icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Buổi học đang diễn ra', value: stats?.bookings?.active?.toLocaleString() || '0', sub: 'Đặt lịch confirmed', icon: Calendar, color: 'bg-sky-500' },
    { label: 'Tỷ lệ Premium', value: stats?.users?.total > 0 ? `${Math.round((stats.users.premium / stats.users.total) * 100)}%` : '0%', sub: 'so với tổng user', icon: TrendingUp, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 mb-2">Dashboard</h1>
        <p className="text-gray-500">Tổng quan hoạt động nền tảng NebulaStudy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map(c => <Card key={c.label} {...c} />)}
      </div>
    </div>
  );
}
