'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Search, Crown } from 'lucide-react';
import CuteModal from '@/components/ui/CuteModal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const [modal, setModal] = useState<{isOpen: boolean, config: any}>({ 
    isOpen: false, 
    config: { title: '', description: '', type: 'info' } 
  });

  const showAlert = (title: string, description: string, type: 'success' | 'error' | 'info' = 'info') => {
    setModal({ isOpen: true, config: { title, description, type } });
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/admin/users', { params: { q: search || undefined, limit: 30 } });
      setUsers(data.data.items || []);
      setTotal(data.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateUser = async (id: string, patch: any) => {
    try {
      await apiClient.patch('/admin/users/' + id, patch);
      fetchUsers();
      showAlert('Thành công', 'Cập nhật trạng thái người dùng thành công! ✨', 'success');
    } catch (err: any) { showAlert('Lỗi hệ thống', err.response?.data?.message || err.message, 'error'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100">Người dùng</h1>
          <p className="text-gray-500">{total} tài khoản</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            className="pl-9 pr-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 outline-none"
            placeholder="Tìm theo tên, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchUsers()}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-100 dark:border-zinc-800">
            <tr className="text-left">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Người dùng</th>
              <th className="px-4 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Gói</th>
              <th className="px-4 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Trạng thái</th>
              <th className="px-4 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Ngày đăng ký</th>
              <th className="px-4 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400 animate-pulse">Đang tải...</td></tr>
            ) : users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 text-sm font-bold overflow-hidden shrink-0">
                      {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : u.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-zinc-100">{u.full_name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ' + (u.plan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400')}>
                    {u.plan === 'premium' && <Crown size={10} />}
                    {u.plan?.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={'px-2.5 py-1 rounded-full text-xs font-bold ' + (u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600')}>
                    {u.is_active ? 'Hoạt động' : 'Đã khoá'}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {new Date(u.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => updateUser(u.id, { plan: u.plan === 'premium' ? 'free' : 'premium' })}
                      className="px-3 py-1.5 text-xs font-bold border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-colors">
                      {u.plan === 'premium' ? 'Hạ Free' : '↑ Premium'}
                    </button>
                    <button onClick={() => updateUser(u.id, { is_active: !u.is_active })}
                      className={'px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors ' + (u.is_active ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50')}>
                      {u.is_active ? 'Khoá' : 'Mở khoá'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Modal */}
      <CuteModal 
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.config.onConfirm}
        title={modal.config.title}
        description={modal.config.description}
        type={modal.config.type}
      />
    </div>
  );
}
