'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Star, Check, X, AlertTriangle } from 'lucide-react';

const STATUS_TABS = [
  { value: 'pending', label: 'Chờ duyệt', color: 'text-amber-600' },
  { value: 'approved', label: 'Đã duyệt', color: 'text-emerald-600' },
  { value: 'suspended', label: 'Đình chỉ', color: 'text-rose-600' },
];

export default function AdminTutorsPage() {
  const [status, setStatus] = useState('pending');
  const [tutors, setTutors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTutors = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/admin/tutors', { params: { status, limit: 30 } });
      setTutors(data.data.items || []);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchTutors(); }, [status]);

  const doAction = async (id: string, action: string) => {
    if (!confirm(`Bạn chắc muốn "${action}" gia sư này?`)) return;
    try {
      await apiClient.patch(`/admin/tutors/${id}/${action}`);
      fetchTutors();
    } catch (err: any) { alert(err.response?.data?.message || err.message); }
  };

  const fmtMoney = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100">Quản lý Gia Sư</h1>

      {/* Status Tabs */}
      <div className="flex gap-2 border-b border-gray-100 dark:border-zinc-800">
        {STATUS_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setStatus(t.value)}
            className={'px-5 py-3 text-sm font-bold border-b-2 transition-all -mb-px ' +
              (status === t.value ? t.color + ' border-current' : 'text-gray-400 border-transparent hover:text-gray-600')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 dark:bg-zinc-800 rounded-3xl" />)}
        </div>
      ) : tutors.length === 0 ? (
        <div className="py-16 text-center text-gray-400 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-100 dark:border-zinc-800">
          Không có gia sư nào ở trạng thái này
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutors.map(t => (
            <div key={t.id} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                  {t.avatar_url ? <img src={t.avatar_url} alt="" className="w-full h-full object-cover" /> : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">{t.full_name?.charAt(0)}</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-zinc-100">{t.full_name}</p>
                  <p className="text-sm text-gray-500">{t.email}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Star size={13} className="fill-amber-400 text-amber-400" />{Number(t.rating_avg).toFixed(1)}</span>
                    <span>{t.experience_years} năm KN</span>
                    <span className="font-bold text-gray-700 dark:text-zinc-300">{fmtMoney(t.hourly_rate_vnd)}/h</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-50 dark:border-zinc-800">
                {status === 'pending' && (
                  <>
                    <button onClick={() => doAction(t.id, 'approve')}
                      className="flex-1 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-sm font-bold flex items-center justify-center gap-1 transition-colors">
                      <Check size={16} /> Duyệt
                    </button>
                    <button onClick={() => doAction(t.id, 'reject')}
                      className="flex-1 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-sm font-bold flex items-center justify-center gap-1 transition-colors">
                      <X size={16} /> Từ chối
                    </button>
                  </>
                )}
                {status === 'approved' && (
                  <button onClick={() => doAction(t.id, 'suspend')}
                    className="flex-1 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl text-sm font-bold flex items-center justify-center gap-1 transition-colors">
                    <AlertTriangle size={16} /> Đình chỉ
                  </button>
                )}
                {status === 'suspended' && (
                  <button onClick={() => doAction(t.id, 'approve')}
                    className="flex-1 py-2 bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-200 rounded-xl text-sm font-bold flex items-center justify-center gap-1 transition-colors">
                    <Check size={16} /> Khôi phục
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
