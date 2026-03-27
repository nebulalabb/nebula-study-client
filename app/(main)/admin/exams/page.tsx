'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

export default function AdminExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExams = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/admin/exams', { params: { limit: 50 } });
      setExams(data.data.items || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchExams(); }, []);

  const togglePublish = async (id: string, is_public: boolean) => {
    try {
      await apiClient.patch(`/admin/exams/${id}/publish`, { is_public: !is_public });
      fetchExams();
    } catch (err: any) { alert(err.response?.data?.message || err.message); }
  };

  const deleteExam = async (id: string) => {
    if (!confirm('Xoá đề thi này vĩnh viễn?')) return;
    try {
      await apiClient.delete(`/admin/exams/${id}`);
      fetchExams();
    } catch (err: any) { alert(err.response?.data?.message || err.message); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100">Quản lý Đề Thi</h1>

      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-100 dark:border-zinc-800">
            <tr className="text-left text-xs font-black uppercase tracking-wider text-gray-400">
              <th className="px-6 py-4">Đề thi</th>
              <th className="px-4 py-4">Môn / Lớp</th>
              <th className="px-4 py-4">Câu hỏi</th>
              <th className="px-4 py-4">Thời gian</th>
              <th className="px-4 py-4">Trạng thái</th>
              <th className="px-4 py-4">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400 animate-pulse">Đang tải...</td></tr>
            ) : exams.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">Chưa có đề thi nào</td></tr>
            ) : exams.map(e => (
              <tr key={e.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-sm text-gray-900 dark:text-zinc-100 max-w-xs truncate">{e.title}</p>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">{e.subject} — Lớp {e.grade_level}</td>
                <td className="px-4 py-4 text-sm font-bold text-gray-900 dark:text-zinc-300">{e.total_questions}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{e.duration_minutes} phút</td>
                <td className="px-4 py-4">
                  <span className={'px-2.5 py-1 rounded-full text-xs font-bold ' + (e.is_public ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500')}>
                    {e.is_public ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => togglePublish(e.id, e.is_public)}
                      title={e.is_public ? 'Ẩn đề thi' : 'Hiển thị đề thi'}
                      className="p-2 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-sky-500 hover:text-sky-500 transition-colors">
                      {e.is_public ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => deleteExam(e.id)}
                      className="p-2 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-rose-500 hover:text-rose-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
