'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import CuteModal from '@/components/ui/CuteModal';

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ topic_id: '', title: '', content: '', day_index: 1, estimated_minutes: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modal, setModal] = useState<{isOpen: boolean, config: any}>({ 
    isOpen: false, 
    config: { title: '', description: '', type: 'info' } 
  });

  const showAlert = (title: string, description: string, type: 'success' | 'error' | 'info' = 'info') => {
    setModal({ isOpen: true, config: { title, description, type } });
  };

  const showConfirm = (title: string, description: string, onConfirm: () => void) => {
    setModal({ isOpen: true, config: { title, description, type: 'confirm', onConfirm } });
  };

  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const [lRes, tRes] = await Promise.all([
        apiClient.get('/admin/lessons', { params: { limit: 50 } }),
        apiClient.get('/microlearn/topics')
      ]);
      setLessons(lRes.data.data.items || []);
      setTopics(tRes.data.data.items || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchLessons(); }, []);

  const createLesson = async () => {
    if (!form.topic_id || !form.title || !form.content) return showAlert('Thiếu thông tin', 'Vui lòng điền đầy đủ các thông tin bắt buộc nhé! ✨', 'error');
    setIsSubmitting(true);
    try {
      await apiClient.post('/admin/lessons', form);
      setShowForm(false);
      setForm({ topic_id: '', title: '', content: '', day_index: 1, estimated_minutes: 5 });
      fetchLessons();
      showAlert('Thành công', 'Đã thêm bài học mới thành công! 🌟', 'success');
    } catch (err: any) { showAlert('Lỗi hệ thống', err.response?.data?.message || err.message, 'error'); }
    finally { setIsSubmitting(false); }
  };

  const deleteLesson = async (id: string) => {
    showConfirm(
      'Xác nhận xoá',
      'Bạn có chắc chắn muốn xoá bài học này không? Hành động này không thể hoàn tác. 🗑️',
      async () => {
        try {
          await apiClient.delete(`/admin/lessons/${id}`);
          fetchLessons();
          showAlert('Thành công', 'Đã xoá bài học thành công! ✨', 'success');
        } catch (err: any) { showAlert('Lỗi hệ thống', err.response?.data?.message || err.message, 'error'); }
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100">Quản lý Bài Học</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors">
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Đóng form' : 'Thêm bài học'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6 space-y-4 shadow-lg shadow-indigo-500/5 animate-in slide-in-from-top-4">
          <h3 className="font-black text-lg text-gray-900 dark:text-zinc-100">Tạo bài học mới</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Chủ đề *</label>
              <select value={form.topic_id} onChange={e => setForm(f => ({ ...f, topic_id: e.target.value }))}
                className="w-full p-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 focus:border-indigo-500 outline-none text-sm">
                <option value="">-- Chọn chủ đề --</option>
                {topics.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Tiêu đề *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full p-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 focus:border-indigo-500 outline-none text-sm" placeholder="Tiêu đề bài học..." />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Nội dung (Markdown) *</label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={6} className="w-full p-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 focus:border-indigo-500 outline-none text-sm font-mono resize-none"
              placeholder="## Nội dung bài học..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Ngày (Day Index)</label>
              <input type="number" value={form.day_index} onChange={e => setForm(f => ({ ...f, day_index: Number(e.target.value) }))}
                className="w-full p-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 focus:border-indigo-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Thời gian (phút)</label>
              <input type="number" value={form.estimated_minutes} onChange={e => setForm(f => ({ ...f, estimated_minutes: Number(e.target.value) }))}
                className="w-full p-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 focus:border-indigo-500 outline-none text-sm" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 font-bold text-gray-500 hover:text-gray-700 rounded-xl">Huỷ</button>
            <button onClick={createLesson} disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
              <Check size={16} /> {isSubmitting ? 'Đang lưu...' : 'Lưu bài học'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-100 dark:border-zinc-800">
            <tr className="text-left text-xs font-black uppercase tracking-wider text-gray-400">
              <th className="px-6 py-4">Tiêu đề</th>
              <th className="px-4 py-4">Chủ đề</th>
              <th className="px-4 py-4">Ngày</th>
              <th className="px-4 py-4">Phút</th>
              <th className="px-4 py-4">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400 animate-pulse">Đang tải...</td></tr>
            ) : lessons.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">Chưa có bài học nào</td></tr>
            ) : lessons.map(l => (
              <tr key={l.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-sm text-gray-900 dark:text-zinc-100 max-w-xs truncate">{l.title}</p>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2.5 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 text-xs font-bold rounded-lg">{l.topic_name}</span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">Ngày {l.day_index}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{l.estimated_minutes} phút</td>
                <td className="px-4 py-4">
                  <button onClick={() => deleteLesson(l.id)}
                    className="p-2 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-rose-500 hover:text-rose-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
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
